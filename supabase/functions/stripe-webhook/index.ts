// ============================================
// MobileCLI Stripe Webhook Handler
// Supabase Edge Function
// ============================================
// Deploy with: supabase functions deploy stripe-webhook
// Set secrets:
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Processing event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

          // Determine tier from price
          const priceId = subscription.items.data[0]?.price.id
          let tier = 'pro' // Default to pro

          // You can customize this based on your price IDs
          if (priceId?.includes('team')) {
            tier = 'team'
          }

          // Get user ID from metadata (set during checkout creation)
          const userId = session.metadata?.user_id

          if (userId) {
            // Create or update subscription
            await supabase.from('subscriptions').upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              tier,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'stripe_subscription_id'
            })

            // Update license expiration for all user's devices
            await supabase
              .from('app_licenses')
              .update({
                expires_at: new Date(subscription.current_period_end * 1000).toISOString()
              })
              .eq('user_id', userId)

            console.log(`Subscription created for user ${userId}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Determine tier
        const priceId = subscription.items.data[0]?.price.id
        let tier = 'pro'
        if (priceId?.includes('team')) {
          tier = 'team'
        }

        // Update subscription in database
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (existingSub) {
          await supabase.from('subscriptions').update({
            tier,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          }).eq('stripe_subscription_id', subscription.id)

          // Update license expiration
          await supabase
            .from('app_licenses')
            .update({
              expires_at: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('user_id', existingSub.user_id)

          console.log(`Subscription updated: ${subscription.id}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Get user ID before updating
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        // Mark subscription as cancelled
        await supabase.from('subscriptions').update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        }).eq('stripe_subscription_id', subscription.id)

        // Expire all licenses for this user
        if (existingSub) {
          await supabase
            .from('app_licenses')
            .update({
              expires_at: new Date().toISOString(),
              is_active: false
            })
            .eq('user_id', existingSub.user_id)
        }

        console.log(`Subscription cancelled: ${subscription.id}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Mark subscription as past_due
        if (invoice.subscription) {
          await supabase.from('subscriptions').update({
            status: 'past_due',
            updated_at: new Date().toISOString()
          }).eq('stripe_subscription_id', invoice.subscription as string)

          console.log(`Payment failed for subscription: ${invoice.subscription}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        // Ensure subscription is active
        if (invoice.subscription) {
          await supabase.from('subscriptions').update({
            status: 'active',
            updated_at: new Date().toISOString()
          }).eq('stripe_subscription_id', invoice.subscription as string)

          console.log(`Payment succeeded for subscription: ${invoice.subscription}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    console.error(`Webhook error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
