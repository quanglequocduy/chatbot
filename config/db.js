import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
.then(() => console.log('Connected to Postgres'))
.catch(() => console.error('Error connecting to Postgres', err.stack));

export default client;