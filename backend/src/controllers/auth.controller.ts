
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = (req as any).body;

      if (!identifier || !password) {
        return sendResponse(res, 400, false, 'Identifier and password are required');
      }

      const authData = await AuthService.login(identifier, password);
      
      return sendResponse(res, 200, true, 'Login successful', authData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Initiate password recovery
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = (req as any).body;
      if (!email) return sendResponse(res, 400, false, 'Email address is required');

      await AuthService.requestPasswordReset(email);
      
      // For security, always return success to prevent email enumeration
      return sendResponse(res, 200, true, 'If the email exists, a secure recovery link has been dispatched.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Finalize password reset via secure token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = (req as any).body;
      if (!token || !password) return sendResponse(res, 400, false, 'Missing mandatory recovery credentials');

      await AuthService.resetPassword(token, password);
      return sendResponse(res, 200, true, 'Institutional password updated successfully. Please log in.');
    } catch (error) {
      next(error);
    }
  }
}
