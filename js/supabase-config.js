// Supabase Configuration for MobileCLI
const SUPABASE_URL = 'https://mwxlguqukyfberyhtkmg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGxndXF1a3lmYmVyeWh0a21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTg5ODgsImV4cCI6MjA4MzA3NDk4OH0.VdpU9WzYpTyLeVX9RaXKBP3dNNNf0t9YkQfVf7x_TA8';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helper functions
const auth = {
    // Sign up with email
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },

    // Sign in with email
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    // Sign in with OAuth (Google, GitHub)
    async signInWithOAuth(provider) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });
        return { data, error };
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = '/';
        }
        return { error };
    },

    // Get current user
    async getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Get session
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    // Listen for auth changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Redirect to dashboard if logged in (for login page)
async function redirectIfLoggedIn() {
    const session = await auth.getSession();
    if (session) {
        window.location.href = '/dashboard.html';
    }
}

// Redirect to login if not logged in (for protected pages)
async function requireAuth() {
    const session = await auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
    }
    return session;
}

// Waitlist signup
const waitlist = {
    async join(email, source = 'download') {
        const { data, error } = await supabase
            .from('waitlist')
            .insert([{
                email,
                source,
                created_at: new Date().toISOString()
            }]);
        return { data, error };
    },

    async checkExists(email) {
        const { data, error } = await supabase
            .from('waitlist')
            .select('email')
            .eq('email', email)
            .single();
        return { exists: !!data, error };
    }
};
