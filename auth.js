const { supabaseUrl, supabaseAnonKey } = window.siteConfig || {};

export const isConfigured = Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());

export const supabase = isConfigured
  ? window.supabase.createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
