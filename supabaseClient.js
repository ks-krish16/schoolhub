import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chrgwnyaozwqfvojazrz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocmd3bnlhb3p3cWZ2b2phenJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTc1ODUsImV4cCI6MjA2MDk5MzU4NX0.V8XlwNLLMi3V4kCVKWSeMlXwZcfXYp_CVqzGzz4u_SE'

export const supabase = createClient(supabaseUrl, supabaseKey)
