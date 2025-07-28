import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const { Pool } = pg;

// Create a configuration object for the PostgreSQL connection
const config = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
};

if (process.env.NODE_ENV === 'production') {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const connection = new Pool(config);

// Test the connection to the database
const testConnection = async () => {
  try {
    const client = await connection.connect();
    const result = await client.query('SELECT current_user, current_database();');
    console.log('Database connected successfully:', {
      user: result.rows[0].current_user,
      database: result.rows[0].current_database,
    });
    client.release();
  } catch (err) {
    console.error('Database connection error:', {
      message: err.message,
      code: err.code,
      detail: err.detail || 'No additional details',
    });
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

export { connection };
