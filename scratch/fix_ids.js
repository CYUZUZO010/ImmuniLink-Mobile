const { Client } = require('pg');

const connectionString = "postgresql://postgres.oskoyobiiwrzpooswiir:123%2512abCD%23%24@108.128.216.176:5432/postgres?sslmode=prefer&connect_timeout=300";

async function fixIdDefaults() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Setting default ID generation for Patient table...');
    // Ensure pgcrypto or the uuid-ossp extension is enabled if using older postgres
    // But gen_random_uuid() is built-in for recent versions
    await client.query('ALTER TABLE "Patient" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()');
    
    console.log('Setting default ID generation for User table...');
    await client.query('ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()');

    console.log('✅ ID defaults set successfully!');
  } catch (err) {
    console.error('❌ Error setting ID defaults:', err.message);
    
    // If gen_random_uuid() fails, try using uuid_generate_v4() after creating extension
    try {
      console.log('Attempting with uuid-ossp extension...');
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('ALTER TABLE "Patient" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()');
      await client.query('ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()');
      console.log('✅ ID defaults set using uuid-ossp!');
    } catch (extErr) {
      console.error('❌ Still failing:', extErr.message);
    }
  } finally {
    await client.end();
  }
}

fixIdDefaults();
