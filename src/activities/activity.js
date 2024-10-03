import pool from '../../config/db.js';

export async function exampleActivity(name) {
  return `Hello, ${name}!`;
}

export async function saveMessagesToDb(role, content) {
  const query = `INSERT INTO chat_history (role, content) VALUES ($1, $2)`;
  await pool.query(query, [role, content]);
}
