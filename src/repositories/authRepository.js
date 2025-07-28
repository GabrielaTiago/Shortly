import { connection } from '../database/postgres.js';

async function checksIfEmailExists(email) {
  return connection.query('SELECT * FROM users WHERE email = $1', [email]);
}

async function signIn(name, email, encryptedPassword) {
  return connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, encryptedPassword]);
}

export { checksIfEmailExists, signIn };
