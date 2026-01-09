import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendResponse(res, 400, false, 'Email and password are required');
      }

      const authData = await AuthService.login(email, password);
      
      return sendResponse(res, 200, true, 'Login successful', authData);
    } catch (error) {
      // Passes errors (like 404 User not found or 401 Incorrect password) to the error middleware
      next(error);
    }
  }
}