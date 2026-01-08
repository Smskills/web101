import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import process from 'process';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// 1. Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows frontend to access images in /uploads
}));
app.use(cors());

// 2. Logging (Only in dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. Request Parsing
app.use(express.json({ limit: process.env.UPLOAD_LIMIT || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.UPLOAD_LIMIT || '10mb' }));

// 4. Static File Hosting (Uploads)
// Path relative to the root of the backend folder
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));

// 5. API Route Registration
app.use('/api', apiRoutes);

// 6. Global Error Handler (Must be last)
app.use(errorHandler);

export default app;