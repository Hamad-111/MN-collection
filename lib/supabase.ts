import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fxwgfhtohgeqplxegizp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4d2dmaHRvaGdlcXBseGVnaXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNjEwMTksImV4cCI6MjA5NzYzNzAxOX0.rFjBt4SheKr96myBrq8oLi_0kYbGvjfsOtJCukT3b7Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
