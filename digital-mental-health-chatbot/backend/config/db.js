const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mental_health_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  // Connection pool settings
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle connection errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connected successfully');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('🕐 Database server time:', result.rows[0].now);
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure PostgreSQL is running and accessible');
    } else if (error.code === '28P01') {
      console.error('💡 Check your database credentials in .env file');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist. Create it first or check DB_NAME in .env');
    }
    
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...');
  await pool.end();
  console.log('✅ Database connections closed');
  process.exit(0);
});

// Export the pool for use in other modules
module.exports = {
  pool,
  connectDB,
  
  // Helper function to execute queries
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      const start = Date.now();
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries (over 1 second)
      if (duration > 1000) {
        console.warn(`⚠️ Slow query detected (${duration}ms):`, text.substring(0, 100));
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    } finally {
      client.release();
    }
  },

  // Helper function for transactions
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction rolled back:', error.message);
      throw error;
    } finally {
      client.release();
    }
  },

  // Helper function to check if database is healthy
  healthCheck: async () => {
    try {
      const result = await pool.query('SELECT 1 as healthy');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connections: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
};

// Initialize database connection when module is loaded
connectDB();