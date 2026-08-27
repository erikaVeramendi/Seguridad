import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ritcphpojubjrlxfuycd.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RQyXRImhcx-jbxI53GadqQ_zsUSmKKo'

export const supabase = createClient(supabaseUrl, supabaseKey)
