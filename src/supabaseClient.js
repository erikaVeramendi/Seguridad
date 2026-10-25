import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kglhvzqqcxforifzduwi.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xYKjL9bnzuXSJmjdh02wrQ_D_ZSHBDw'

export const supabase = createClient(supabaseUrl, supabaseKey)
