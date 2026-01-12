
// @ts-ignore
import bcrypt from 'bcrypt';
// @ts-ignore
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { UsersRepository } from '../repositories/users.repo';
import { ENV } from '../config/env';

export class AuthService {
  static async login(identifier: string, plainPassword: string) {
    // 1. Locate user record
    const user = await UsersRepository.findByIdentifier(identifier);
    if (!user) {
      const err: any = new Error('Unauthorized access');
      err.statusCode = 401;
      throw err;
    }

    // 2. Check for Account Lockout
    if (user.status === 'locked' || (user.lockout_until && new Date(user.lockout_until) > new Date())) {
      const remainingTime = Math.ceil((new Date(user.lockout_until).getTime() - new Date().getTime()) / 60000);
      const err: any = new Error(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
      err.statusCode = 403;
      throw err;
    }

    if (user.status !== 'active') {
      const err: any = new Error('Institutional access suspended.');
      err.statusCode = 403;
      throw err;
    }

    // 3. Cryptographic Verification
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    
    if (!isMatch) {
      // Increment failed attempts
      const attempts = user.failed_attempts + 1;
      let status = user.status;
      let lockout_until = null;

      if (attempts >= 5) {
        status = 'locked';
        lockout_until = new Date(Date.now() + 30 * 60000); // 30 minute lockout
      }

      await pool.execute(
        'UPDATE users SET failed_attempts = ?, status = ?, lockout_until = ? WHERE id = ?',
        [attempts, status, lockout_until, user.id]
      );

      const err: any = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    // 4. Success: Reset failed attempts and update last login
    await pool.execute(
      'UPDATE users SET failed_attempts = 0, lockout_until = NULL, last_login_at = NOW() WHERE id = ?',
      [user.id]
    );

    // 5. Identity Token Generation
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: new Date()
      }
    };
  }
}
