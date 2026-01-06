// ============================================
// MobileCLI Stripe Configuration
// ============================================
// IMPORTANT: Replace STRIPE_PUBLIC_KEY with your actual Stripe publishable key
// The publishable key is safe to expose in client-side code
// ============================================

// Stripe Configuration
// TODO: Replace with your actual Stripe publishable key
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

// Price IDs from your Stripe Dashboard
// TODO: Replace these with your actual Price IDs after creating products
const STRIPE_PRICES = {
    pro_monthly: 'price_YOUR_PRO_MONTHLY_PRICE_ID',      // $10/month
    pro_yearly: 'price_YOUR_PRO_YEARLY_PRICE_ID',        // $100/year (save $20)
    team_monthly: 'price_YOUR_TEAM_MONTHLY_PRICE_ID',    // $20/user/month
    team_yearly: 'price_YOUR_TEAM_YEARLY_PRICE_ID'       // $200/user/year
};

// Initialize Stripe
let stripe = null;

function initStripe() {
    if (!stripe && typeof Stripe !== 'undefined') {
        stripe = Stripe(STRIPE_PUBLIC_KEY);
    }
    return stripe;
}

// ============================================
// Subscription Management
// ============================================

const payments = {
    // Check if Stripe is configured
    isConfigured() {
        return STRIPE_PUBLIC_KEY !== 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';
    },

    // Get or create Stripe customer for current user
    async getOrCreateCustomer() {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if user already has a Stripe customer ID
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        if (sub?.stripe_customer_id) {
            return sub.stripe_customer_id;
        }

        // Create new customer via Edge Function
        const response = await fetch('/api/create-customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({ email: user.email })
        });

        const data = await response.json();
        return data.customerId;
    },

    // Create checkout session for subscription
    async createCheckoutSession(priceId, successUrl, cancelUrl) {
        const user = await auth.getUser();
        if (!user) {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({
                priceId,
                successUrl: successUrl || window.location.origin + '/dashboard.html?payment=success',
                cancelUrl: cancelUrl || window.location.origin + '/pricing.html?payment=cancelled'
            })
        });

        const { sessionId, url } = await response.json();

        if (url) {
            // Redirect to Stripe Checkout
            window.location.href = url;
        } else if (sessionId) {
            // Use Stripe.js redirect
            const stripe = initStripe();
            await stripe.redirectToCheckout({ sessionId });
        }
    },

    // Open customer portal for managing subscription
    async openCustomerPortal(returnUrl) {
        const response = await fetch('/api/customer-portal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({
                returnUrl: returnUrl || window.location.href
            })
        });

        const { url } = await response.json();
        if (url) {
            window.location.href = url;
        }
    },

    // Get current subscription status
    async getSubscription() {
        const user = await auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing'])
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return data;
    },

    // Check if user has Pro access
    async hasProAccess() {
        const sub = await this.getSubscription();
        return sub && (sub.tier === 'pro' || sub.tier === 'team');
    },

    // Check if user has Team access
    async hasTeamAccess() {
        const sub = await this.getSubscription();
        return sub && sub.tier === 'team';
    },

    // Subscribe to Pro monthly
    async subscribePro() {
        await this.createCheckoutSession(STRIPE_PRICES.pro_monthly);
    },

    // Subscribe to Pro yearly
    async subscribeProYearly() {
        await this.createCheckoutSession(STRIPE_PRICES.pro_yearly);
    },

    // Subscribe to Team monthly
    async subscribeTeam() {
        await this.createCheckoutSession(STRIPE_PRICES.team_monthly);
    },

    // Cancel subscription (via portal)
    async cancelSubscription() {
        await this.openCustomerPortal();
    }
};

// ============================================
// License Management (for app)
// ============================================

const licenses = {
    // Get the user's license key (if they have one)
    async getLicenseKey() {
        const user = await auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('app_licenses')
            .select('license_key, tier, created_at')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return data;
    },

    // Generate a new license key for the user
    async generateLicenseKey() {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check subscription status
        const sub = await payments.getSubscription();
        if (!sub || sub.tier === 'free') {
            throw new Error('Pro subscription required');
        }

        // Generate license using the stored procedure
        const { data, error } = await supabase
            .rpc('generate_license_key', {
                p_user_id: user.id
            });

        if (error) throw error;
        return { license_key: data };
    },

    // Register a device and get license key
    async registerDevice(deviceId, deviceName) {
        const user = await auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .rpc('register_device', {
                p_user_id: user.id,
                p_device_id: deviceId,
                p_device_name: deviceName
            });

        if (error) throw error;
        return data;
    },

    // Verify a license key
    async verifyLicense(licenseKey, deviceId) {
        const { data, error } = await supabase
            .rpc('verify_license', {
                p_license_key: licenseKey,
                p_device_id: deviceId
            });

        if (error) throw error;
        return data;
    },

    // Get all devices for current user
    async getDevices() {
        const user = await auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('app_licenses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return data || [];
    },

    // Deactivate a device
    async deactivateDevice(licenseId) {
        const { error } = await supabase
            .from('app_licenses')
            .update({ is_active: false })
            .eq('id', licenseId);

        if (error) throw error;
    }
};

// ============================================
// Helper: Require Pro Access
// Redirect to pricing if not Pro
// ============================================
async function requireProAccess() {
    const hasPro = await payments.hasProAccess();
    if (!hasPro) {
        window.location.href = '/pricing.html?upgrade=required';
        return false;
    }
    return true;
}

// ============================================
// Helper: Show Subscription Status
// ============================================
async function displaySubscriptionStatus(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const sub = await payments.getSubscription();

    if (!sub) {
        element.innerHTML = `
            <span class="tier-badge tier-free">Free</span>
            <a href="/pricing.html" class="upgrade-link">Upgrade to Pro</a>
        `;
    } else if (sub.tier === 'pro') {
        element.innerHTML = `
            <span class="tier-badge tier-pro">Pro</span>
            ${sub.cancel_at_period_end ? '<span class="cancel-notice">Cancels at period end</span>' : ''}
        `;
    } else if (sub.tier === 'team') {
        element.innerHTML = `
            <span class="tier-badge tier-team">Team</span>
            ${sub.cancel_at_period_end ? '<span class="cancel-notice">Cancels at period end</span>' : ''}
        `;
    }
}
