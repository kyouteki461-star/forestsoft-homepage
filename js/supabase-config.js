// Supabase Configuration
const SUPABASE_URL = 'https://fzqbzujqjvmlowbjlxof.supabase.co'; // 您的 Supabase Project URL
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // 请替换为您的 Supabase Anon Key

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth utility functions
const auth = {
    // Check if user is logged in
    async checkAuth() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Auth check error:', error);
            return null;
        }
        return user;
    },

    // Sign in with admin credentials
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error('Sign in error:', error);
            return null;
        }
        return data.user;
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign out error:', error);
        }
    }
};

// News data functions
const newsAPI = {
    // Fetch all news items
    async fetchAllNews() {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch news error:', error);
            return [];
        }
        return data;
    },

    // Update news content
    async updateNews(id, content) {
        const { data, error } = await supabase
            .from('news')
            .update({ content })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update news error:', error);
            return null;
        }
        return data;
    }
};

// Make functions available globally
window.supabaseConfig = { supabase, auth, newsAPI };