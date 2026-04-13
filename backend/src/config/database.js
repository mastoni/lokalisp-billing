// Database connection configuration
// Replace with your actual database connection logic

const connectDB = async () => {
  try {
    // Example: PostgreSQL connection
    // const { Pool } = require('pg');
    // const pool = new Pool({
    //   host: process.env.DB_HOST,
    //   port: process.env.DB_PORT,
    //   database: process.env.DB_NAME,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    // });
    
    // await pool.connect();
    console.log('Database connected successfully');
    // module.exports = pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = { connectDB };
