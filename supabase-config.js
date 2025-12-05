// supabase-config.js
const SUPABASE_URL = 'https://zuqkclsdztbyzslzmzfr.supabase.co'; // COLE A URL AQUI
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cWtjbHNkenRieXpzbHptemZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzM0NzgsImV4cCI6MjA3ODU0OTQ3OH0.nBC2GYWPTfdaSYzi0jOgnBu4bi5xURoHBJ70MRjrdOs'; // COLE A CHAVE AQUI

// Cliente Supabase (sem precisar de npm install)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
