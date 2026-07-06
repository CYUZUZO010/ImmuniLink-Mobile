import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function testQuery() {
  console.log("Testing query...");
  const { data, error } = await supabase
    .from('Patient')
    .select('*, VaccinationRecord(id, timestamp, Vaccine(name))');
    
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Success! Data:", JSON.stringify(data, null, 2));
  }
}

testQuery();
