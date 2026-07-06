const { Client } = require('pg');

const connectionString = "postgresql://postgres.oskoyobiiwrzpooswiir:123%2512abCD%23%24@108.128.216.176:5432/postgres?sslmode=prefer&connect_timeout=300";

async function deleteUser() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to database');

    const email = 'sandracyuzuzo14@gmail.com';
    const res = await client.query('DELETE FROM auth.users WHERE email = $1', [email]);
    
    if (res.rowCount > 0) {
      console.log(`✅ Successfully deleted pending user: ${email}`);
    } else {
      console.log(`ℹ️ No user found with email: ${email}`);
    }

  } catch (err) {
    console.error('❌ Error deleting user:', err.message);
  } finally {
    await client.end();
  }
}

deleteUser();
