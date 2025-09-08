import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

// Export types for use in other files
export type Tables = Database['public']['Tables'];
export type UserApp = Tables['users_app']['Row'];
export type Chat = Tables['chats']['Row'];
export type ChatMessage = Tables['chat_messages']['Row'];

// Extend the SupabaseClient to include our table types
export type TypedSupabaseClient = SupabaseClient<Database>;

// Simple type for the Supabase client with our database schema
let supabaseClient: TypedSupabaseClient | null = null;

export const getSupabase = (): TypedSupabaseClient | null => {
  // Return cached client if available
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error('❌ Supabase configuration error:');
    console.error('SUPABASE_URL:', url ? '✅ Present' : '❌ Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', key ? '✅ Present (first 10 chars: ' + key.substring(0, 10) + '...)' : '❌ Missing');
    return null;
  }
  
  try {
    console.log('🔌 Initializing Supabase client...');
    supabaseClient = createClient<Database>(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'consultia-api'
        }
      }
    });
    
    console.log('✅ Supabase client initialized successfully');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    return null;
  }
};
