import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_VUE_JS_SUPABASE_PROJECT || 'https://yubqzxywgskhdfalqsbw.supabase.co'
const supabaseKey = import.meta.env.VITE_VUE_JS_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YnF6eHl3Z3NraGRmYWxxc2J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzM4MzU0MCwiZXhwIjoyMDgyOTU5NTQwfQ.EwepQAOAN2JBqGkGwc4gQtu4Hgq3pY9nc-4_8cucSJI'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase