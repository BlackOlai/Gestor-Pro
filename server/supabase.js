// Supabase admin client (server-side only)
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[Supabase] Variáveis ausentes. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no server/.env para habilitar a persistência.');
}

const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
      db: { schema: 'public' }
    })
  : {
      from: () => ({ insert: async () => ({ error: new Error('Supabase não configurado') }) })
    };

module.exports = { supabase };
