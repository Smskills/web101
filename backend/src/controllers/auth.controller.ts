import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  /**
   * Endpoint handler for admin login.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendResponse(res, 400, false, 'Email and password are required.');
      }

      const data = await AuthService.login(email, password);

      return sendResponse(res, 200, true, 'Login successful.', data);
    } catch (error) {
      next(error);
    }
  }
}