-- ============================================
-- MobileCLI Supabase Setup Script
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. WAITLIST TABLE
-- For collecting emails before Pro launch
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- RLS for waitlist
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (signup form)
CREATE POLICY "Allow anonymous insert to waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Allow anonymous select for count display
CREATE POLICY "Allow anonymous select from waitlist" ON waitlist
    FOR SELECT USING (true);


-- ============================================
-- 2. USER PROFILES TABLE
-- Extended user data beyond Supabase auth
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================
-- 3. SUBSCRIPTIONS TABLE
-- Tracks Stripe subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'team')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'expired')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update (via webhooks)
-- No policy for INSERT/UPDATE means only service_role can do it


-- ============================================
-- 4. APP LICENSES TABLE
-- For verifying app installations
-- ============================================
CREATE TABLE IF NOT EXISTS app_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT,
    license_key TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_licenses_user_id ON app_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_app_licenses_device_id ON app_licenses(device_id);
CREATE INDEX IF NOT EXISTS idx_app_licenses_license_key ON app_licenses(license_key);

-- RLS for app_licenses
ALTER TABLE app_licenses ENABLE ROW LEVEL SECURITY;

-- Users can read their own licenses
CREATE POLICY "Users can read own licenses" ON app_licenses
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own licenses (device registration)
CREATE POLICY "Users can register devices" ON app_licenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ============================================
-- 5. LICENSE VERIFICATION FUNCTION
-- Called by app to verify license status
-- ============================================
CREATE OR REPLACE FUNCTION verify_license(
    p_license_key TEXT,
    p_device_id TEXT
)
RETURNS JSON AS $$
DECLARE
    v_license app_licenses%ROWTYPE;
    v_subscription subscriptions%ROWTYPE;
    v_result JSON;
BEGIN
    -- Find the license
    SELECT * INTO v_license
    FROM app_licenses
    WHERE license_key = p_license_key
    AND device_id = p_device_id
    AND is_active = true;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'valid', false,
            'error', 'License not found or inactive'
        );
    END IF;

    -- Check if expired
    IF v_license.expires_at IS NOT NULL AND v_license.expires_at < NOW() THEN
        RETURN json_build_object(
            'valid', false,
            'error', 'License expired'
        );
    END IF;

    -- Get subscription status
    SELECT * INTO v_subscription
    FROM subscriptions
    WHERE user_id = v_license.user_id
    AND status IN ('active', 'trialing')
    ORDER BY created_at DESC
    LIMIT 1;

    -- Update last verified timestamp
    UPDATE app_licenses
    SET last_verified_at = NOW()
    WHERE id = v_license.id;

    RETURN json_build_object(
        'valid', true,
        'user_id', v_license.user_id,
        'tier', COALESCE(v_subscription.tier, 'free'),
        'expires_at', v_license.expires_at,
        'subscription_status', COALESCE(v_subscription.status, 'none')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 6. GENERATE LICENSE KEY FUNCTION
-- Creates a unique license key for a user
-- ============================================
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
DECLARE
    v_key TEXT;
BEGIN
    -- Generate a unique license key: MCLI-XXXX-XXXX-XXXX-XXXX
    v_key := 'MCLI-' ||
        upper(substring(md5(random()::text) from 1 for 4)) || '-' ||
        upper(substring(md5(random()::text) from 1 for 4)) || '-' ||
        upper(substring(md5(random()::text) from 1 for 4)) || '-' ||
        upper(substring(md5(random()::text) from 1 for 4));
    RETURN v_key;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 7. REGISTER DEVICE FUNCTION
-- Called when app first launches with auth
-- ============================================
CREATE OR REPLACE FUNCTION register_device(
    p_user_id UUID,
    p_device_id TEXT,
    p_device_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_license app_licenses%ROWTYPE;
    v_new_key TEXT;
    v_subscription subscriptions%ROWTYPE;
BEGIN
    -- Check if device already registered for this user
    SELECT * INTO v_license
    FROM app_licenses
    WHERE user_id = p_user_id
    AND device_id = p_device_id;

    IF FOUND THEN
        -- Return existing license
        RETURN json_build_object(
            'success', true,
            'license_key', v_license.license_key,
            'message', 'Device already registered'
        );
    END IF;

    -- Get user's subscription to determine license duration
    SELECT * INTO v_subscription
    FROM subscriptions
    WHERE user_id = p_user_id
    AND status IN ('active', 'trialing')
    ORDER BY created_at DESC
    LIMIT 1;

    -- Generate new license key
    v_new_key := generate_license_key();

    -- Insert new license
    INSERT INTO app_licenses (user_id, device_id, device_name, license_key, expires_at)
    VALUES (
        p_user_id,
        p_device_id,
        p_device_name,
        v_new_key,
        CASE
            WHEN v_subscription.tier = 'pro' THEN v_subscription.current_period_end
            WHEN v_subscription.tier = 'team' THEN v_subscription.current_period_end
            ELSE NOW() + INTERVAL '7 days'  -- Free tier gets 7 day trial
        END
    );

    RETURN json_build_object(
        'success', true,
        'license_key', v_new_key,
        'tier', COALESCE(v_subscription.tier, 'free'),
        'message', 'Device registered successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 8. USAGE TRACKING TABLE (Optional)
-- Track app usage for analytics
-- ============================================
CREATE TABLE IF NOT EXISTS usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    device_id TEXT,
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying
CREATE INDEX IF NOT EXISTS idx_usage_events_user ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created ON usage_events(created_at);

-- RLS
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous tracking allowed)
CREATE POLICY "Allow event tracking" ON usage_events
    FOR INSERT WITH CHECK (true);

-- Users can only read their own events
CREATE POLICY "Users read own events" ON usage_events
    FOR SELECT USING (auth.uid() = user_id);


-- ============================================
-- 9. STRIPE WEBHOOK HANDLER HELPER
-- Used by Edge Function to update subscriptions
-- ============================================
CREATE OR REPLACE FUNCTION handle_stripe_webhook(
    p_event_type TEXT,
    p_customer_id TEXT,
    p_subscription_id TEXT,
    p_status TEXT,
    p_tier TEXT,
    p_period_start TIMESTAMP,
    p_period_end TIMESTAMP,
    p_cancel_at_period_end BOOLEAN
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Find user by Stripe customer ID
    SELECT user_id INTO v_user_id
    FROM subscriptions
    WHERE stripe_customer_id = p_customer_id
    LIMIT 1;

    IF p_event_type = 'customer.subscription.created' OR
       p_event_type = 'customer.subscription.updated' THEN

        -- Upsert subscription
        INSERT INTO subscriptions (
            user_id,
            stripe_customer_id,
            stripe_subscription_id,
            status,
            tier,
            current_period_start,
            current_period_end,
            cancel_at_period_end,
            updated_at
        )
        VALUES (
            v_user_id,
            p_customer_id,
            p_subscription_id,
            p_status,
            p_tier,
            p_period_start,
            p_period_end,
            p_cancel_at_period_end,
            NOW()
        )
        ON CONFLICT (stripe_subscription_id)
        DO UPDATE SET
            status = EXCLUDED.status,
            tier = EXCLUDED.tier,
            current_period_start = EXCLUDED.current_period_start,
            current_period_end = EXCLUDED.current_period_end,
            cancel_at_period_end = EXCLUDED.cancel_at_period_end,
            updated_at = NOW();

        -- Update license expiration for this user's devices
        UPDATE app_licenses
        SET expires_at = p_period_end
        WHERE user_id = v_user_id;

    ELSIF p_event_type = 'customer.subscription.deleted' THEN

        -- Mark subscription as cancelled
        UPDATE subscriptions
        SET status = 'cancelled', updated_at = NOW()
        WHERE stripe_subscription_id = p_subscription_id;

        -- Expire all licenses for this user
        UPDATE app_licenses
        SET expires_at = NOW(), is_active = false
        WHERE user_id = v_user_id;

    END IF;

    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 10. HELPER VIEW: User Dashboard Data
-- ============================================
CREATE OR REPLACE VIEW user_dashboard AS
SELECT
    p.id as user_id,
    p.email,
    p.display_name,
    s.tier,
    s.status as subscription_status,
    s.current_period_end,
    s.cancel_at_period_end,
    (SELECT COUNT(*) FROM app_licenses WHERE user_id = p.id AND is_active = true) as active_devices
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status IN ('active', 'trialing');


-- ============================================
-- DONE! Your Supabase is ready.
-- ============================================
-- Next steps:
-- 1. Set up Stripe products (Free, Pro $10/mo, Team $20/mo)
-- 2. Create Stripe webhook endpoint
-- 3. Connect Stripe customer ID to users on first payment
-- ============================================
