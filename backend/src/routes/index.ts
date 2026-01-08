
import { Router } from 'express';
import process from 'process';

const router = Router();

/**
 * Health Check Endpoint
 * Verifies API availability
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Future modular routes will be registered here:
// router.use('/courses', courseRoutes);
// router.use('/admin', adminRoutes);

export default router;
