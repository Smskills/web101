import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return sendResponse(res, 400, false, 'Identifier and password are required');
      }

      const authData = await AuthService.login(identifier, password);
      
      return sendResponse(res, 200, true, 'Login successful', authData);
    } catch (error) {
      next(error);
    }
  }
}