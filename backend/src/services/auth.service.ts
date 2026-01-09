import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminRepository } from '../repositories/admin.repository';

export class AuthService {
  /**
   * Authenticate admin credentials and generate a secure session token.
   */
  static async login(email: string, pass: string) {
    const admin = await AdminRepository.findByEmail(email);

    // 1. Check existence and status
    if (!admin || admin.status !== 'Active') {
      const error: any = new Error('Authentication failed: Invalid credentials or inactive account.');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password hash
    const isMatch = await bcrypt.compare(pass, admin.password);
    if (!isMatch) {
      const error: any = new Error('Authentication failed: Invalid credentials.');
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate JWT
    const secret = process.env.JWT_SECRET || 'sms_default_secret_key_2024';
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      secret,
      { expiresIn: '8h' }
    );

    // 4. Sanitize sensitive data before returning
    const { password, ...adminData } = admin;
    
    return {
      token,
      admin: adminData
    };
  }
}