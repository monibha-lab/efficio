import { createClient } from '@supabase/supabase-js'

// These come from Replit Secrets (set them in the Secrets tab)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️  Missing Supabase credentials. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Replit Secrets.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
