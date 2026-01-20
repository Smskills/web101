
// @ts-ignore
import bcrypt from 'bcrypt';
// @ts-ignore
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database';
import { UsersRepository } from '../repositories/users.repo';
import { ENV } from '../config/env';
import { EmailService } from './email.service';

export class AuthService {
  static async login(identifier: string, plainPassword: string) {
    const user = await UsersRepository.findByIdentifier(identifier);
    if (!user) {
      const err: any = new Error('Unauthorized access');
      err.statusCode = 401;
      throw err;
    }

    const isLocked = user.status === 'locked';
    const isLockoutActive = user.lockout_until && new Date(user.lockout_until) > new Date();

    if (isLocked || isLockoutActive) {
      const lockoutTime = user.lockout_until ? new Date(user.lockout_until) : new Date();
      const remainingTime = Math.ceil((lockoutTime.getTime() - new Date().getTime()) / 60000);
      const err: any = new Error(`Account temporarily locked. Try again in ${remainingTime > 0 ? remainingTime : 1} minutes.`);
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    
    if (!isMatch) {
      try {
        const attempts = (user.failed_attempts || 0) + 1;
        let status = user.status || 'active';
        let lockout_until = null;

        if (attempts >= 5) {
          status = 'locked';
          lockout_until = new Date(Date.now() + 30 * 60000);
        }

        await pool.execute(
          'UPDATE users SET failed_attempts = ?, status = ?, lockout_until = ? WHERE id = ?',
          [attempts, status, lockout_until, user.id]
        );
      } catch (dbError) {
        console.warn("DB Resilience: Security columns missing.");
      }

      const err: any = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    try {
      await pool.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    } catch (e) {}

    try {
      await pool.execute('UPDATE users SET failed_attempts = 0, lockout_until = NULL, status = "active" WHERE id = ?', [user.id]);
    } catch (e) {}

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

  /**
   * Request a secure password reset link
   */
  static async requestPasswordReset(email: string) {
    const user = await UsersRepository.findByIdentifier(email);
    if (!user) return; // Silent failure for security

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // Valid for 1 hour

    try {
      // Store token and expiry in the users table
      await pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [token, expiry, user.id]
      );

      // Trigger Email Dispatch
      await EmailService.sendPasswordResetLink(email, token, user.username);
    } catch (error) {
      console.error("Recovery Fault:", error);
      throw new Error("Institutional security protocol failure. Contact system administrator.");
    }
  }

  /**
   * Update password if token is verified and fresh
   */
  static async resetPassword(token: string, plainPassword: string) {
    const [rows]: any = await pool.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW() LIMIT 1',
      [token]
    );

    if (rows.length === 0) {
      const err: any = new Error('The recovery link is invalid or has expired.');
      err.statusCode = 400;
      throw err;
    }

    const userId = rows[0].id;
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL, status = "active", failed_attempts = 0 WHERE id = ?',
      [hashedPassword, userId]
    );
  }
}
