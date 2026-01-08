import app from './app';
import pool from './config/db';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify Database Connection Pool
    const connection = await pool.getConnection();
    console.log('📦 MySQL Database connection pool initialized.');
    connection.release();

    // Start HTTP Listener
    app.listen(PORT, () => {
      console.log(`🚀 API Server running in [${process.env.NODE_ENV}] mode`);
      console.log(`📡 Endpoint: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unexpected process crashes
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down server...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();