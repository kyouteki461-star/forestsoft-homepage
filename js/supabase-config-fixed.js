// Supabase Configuration with better error handling
const SUPABASE_URL = 'https://fzqbzujqjvmlowbjlxof.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r5e7t2Kjwhs2AVp6fvybpg_FwUCrH8J';

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    try {
        // Initialize Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // News data functions with error handling
        const newsAPI = {
            // Fetch all news items
            async fetchAllNews() {
                try {
                    const { data, error } = await supabase
                        .from('news')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) {
                        console.error('Fetch news error:', error);
                        if (error.code === 'PGRST116') {
                            throw new Error('Table does not exist. Please create the news table first.');
                        }
                        throw error;
                    }
                    return data || [];
                } catch (error) {
                    console.error('News API error:', error);
                    throw error;
                }
            },

            // Update news content
            async updateNews(id, content) {
                try {
                    const { data, error } = await supabase
                        .from('news')
                        .update({ content })
                        .eq('id', id)
                        .select()
                        .single();

                    if (error) {
                        console.error('Update news error:', error);
                        throw error;
                    }
                    return data;
                } catch (error) {
                    console.error('Update API error:', error);
                    throw error;
                }
            }
        };

        // Make functions available globally
        window.supabaseConfig = { supabase, newsAPI };
        console.log('Supabase initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        window.supabaseConfig = null;
    }
} else {
    console.log('Not in browser environment');
}