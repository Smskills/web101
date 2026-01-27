import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/error.middleware';
import { ENV } from './config/env';
import { CONSTANTS } from './config/constants';

const app: Application = express();

// 1. Core Security & Logging
// Hardened CORS for production/development consistency
app.use(cors({
  origin: '*', // In production, replace with specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}) as any);

app.use(helmet({ crossOriginResourcePolicy: false }) as any);

if (ENV.NODE_ENV === 'development') app.use(morgan('dev') as any);

// 2. Request Parsing
app.use(express.json({ limit: ENV.UPLOAD_LIMIT }) as any);
app.use(express.urlencoded({ extended: true, limit: ENV.UPLOAD_LIMIT }) as any);

// 3. Static File Access
app.use('/uploads', express.static(CONSTANTS.UPLOADS.ROOT) as any);

// 4. API Core Routing
app.use('/api', apiRoutes);

// 5. Global Error Handler (MUST be last)
app.use(errorHandler);

export default app;