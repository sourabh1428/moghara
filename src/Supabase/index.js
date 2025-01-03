// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and API key
const supabaseUrl = 'https://npycprqypwtohsmqamdt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weWNwcnF5cHd0b2hzbXFhbWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NTk4MDcsImV4cCI6MjA1MTAzNTgwN30.CAHJNllbzzQlccyCcoypLQOihmGUq6hU6n1Htns_CMk';

export const supabase = createClient(supabaseUrl, supabaseKey);