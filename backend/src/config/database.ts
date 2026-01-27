
import mysql from 'mysql2/promise';
import { ENV } from './env';

const pool = mysql.createPool({
  host: ENV.DB.HOST,
  user: ENV.DB.USER,
  password: ENV.DB.PASS,
  database: ENV.DB.NAME,
  port: ENV.DB.PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool;
