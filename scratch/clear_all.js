const { Client } = require('pg');

const connectionString = "postgresql://postgres.oskoyobiiwrzpooswiir:123%2512abCD%23%24@108.128.216.176:5432/postgres?sslmode=prefer&connect_timeout=300";

async function clearDatabase() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to database');

    // Truncate tables in order of dependency
    console.log('Cleaning up tables...');
    await client.query('TRUNCATE TABLE "VaccinationRecord" CASCADE');
    await client.query('TRUNCATE TABLE "Patient" CASCADE');
    await client.query('TRUNCATE TABLE "User" CASCADE');
    
    // Optional: Also clear Auth users if possible (depends on permissions)
    try {
      console.log('Attempting to clear Supabase Auth users...');
      await client.query('DELETE FROM auth.users');
      console.log('Cleared Supabase Auth users');
    } catch (authErr) {
      console.warn('Could not clear Auth users directly via SQL (this is normal for non-superuser):', authErr.message);
    }

    console.log('✅ Database cleared successfully!');
  } catch (err) {
    console.error('❌ Error clearing database:', err.message);
  } finally {
    await client.end();
  }
}

clearDatabase();
