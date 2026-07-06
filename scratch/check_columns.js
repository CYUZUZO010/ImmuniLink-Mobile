const { Client } = require('pg');

const connectionString = "postgresql://postgres.oskoyobiiwrzpooswiir:123%2512abCD%23%24@108.128.216.176:5432/postgres?sslmode=prefer&connect_timeout=300";

async function checkColumns() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to database');

    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Patient'
    `);
    
    const resUser = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `);
    
    console.log('Columns in User table:');
    console.log(resUser.rows.map(r => r.column_name));

    if (!res.rows.some(r => r.column_name === 'childId')) {
      console.log('❌ column "childId" is MISSING!');
    } else {
      console.log('✅ column "childId" exists.');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

checkColumns();
