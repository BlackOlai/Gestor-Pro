import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabase = (): SupabaseClient | null => {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, {
    auth: { persistSession: false },
    db: { schema: 'public' },
  });
};
