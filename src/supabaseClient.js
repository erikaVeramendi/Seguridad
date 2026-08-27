import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fycgmutmpzmmwrqmqhyi.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZHs77ObsFBdH1QWr55aLTg_cVgQWz-2'

export const supabase = createClient(supabaseUrl, supabaseKey)
