import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fycgmutmpzmmwrqmqhyi.supabase.co'
const supabaseKey = 'sb_publishable_ZHs77ObsFBdH1QWr55aLTg_cVgQWz-2'

export const supabase = createClient(supabaseUrl, supabaseKey)
