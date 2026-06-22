import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgwcfazhwuzxcqbqbjat.supabase.co'
const supabaseAnonKey = 'sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)