// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project values
const SUPABASE_URL = "https://xbdcbwlpprdxbcedydqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZGNid2xwcHJkeGJjZWR5ZHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjc1NTUsImV4cCI6MjA3NjIwMzU1NX0.iSBUqQGoahQtetyDAFpdBpByAJ9qZiCByrcl2Q9FWx0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
