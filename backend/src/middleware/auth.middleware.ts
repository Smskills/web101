
import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { sendResponse } from '../utils/response';

/**
 * Institutional Authentication Middleware
 * Enforces security by verifying the JSON Web Token in the Authorization header.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Verify header presence and Bearer schema
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, 'Institutional authentication required');
  }

  // 2. Extract the actual token string
  const token = authHeader.split(' ')[1];

  try {
    // 3. Perform cryptographic verification against the system secret
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    
    // 4. Attach decoded identity to request for use in controllers
    (req as any).user = decoded;
    
    // 5. Proceed to the protected controller
    next();
  } catch (error) {
    // 6. Catch expired, malformed, or invalid tokens
    return sendResponse(res, 403, false, 'Administrative session has expired or is invalid');
  }
};
