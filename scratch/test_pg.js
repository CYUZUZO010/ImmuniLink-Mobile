const { Client } = require('pg');

const connectionString = "postgresql://postgres.oskoyobiiwrzpooswiir:123%2512abCD%23%24@108.128.216.176:5432/postgres?sslmode=no-verify";

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected successfully to PostgreSQL');
    return client.query('SELECT current_database();');
  })
  .then(res => {
    console.log('Query result:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });
