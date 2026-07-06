const { Client } = require('pg');

const connectionString = "postgresql://postgres.oskoyobiiwrzpooswiir:123%2512abCD%23%24@108.128.216.176:5432/postgres?sslmode=prefer&connect_timeout=300";

async function fixSchema() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Adding missing columns to Patient table...');
    await client.query('ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "childId" TEXT UNIQUE');
    await client.query('ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "parentEmail" TEXT');
    
    console.log('Adding missing columns to User table...');
    await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT');
    await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastActive" TIMESTAMP WITH TIME ZONE DEFAULT NOW()');

    console.log('✅ Schema fixed successfully!');
  } catch (err) {
    console.error('❌ Error fixing schema:', err.message);
  } finally {
    await client.end();
  }
}

fixSchema();
