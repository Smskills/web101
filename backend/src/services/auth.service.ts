
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
    // findByIdentifier uses SELECT *, which is safe even if columns are missing
    const user = await UsersRepository.findByIdentifier(identifier);
    if (!user) {
      const err: any = new Error('Unauthorized access');
      err.statusCode = 401;
      throw err;
    }

    // 2. Defensive Check for Account Lockout
    // We check if the properties exist on the returned object before using them
    const isLocked = user.status === 'locked';
    const isLockoutActive = user.lockout_until && new Date(user.lockout_until) > new Date();

    if (isLocked || isLockoutActive) {
      const lockoutTime = user.lockout_until ? new Date(user.lockout_until) : new Date();
      const remainingTime = Math.ceil((lockoutTime.getTime() - new Date().getTime()) / 60000);
      const err: any = new Error(`Account temporarily locked. Try again in ${remainingTime > 0 ? remainingTime : 1} minutes.`);
      err.statusCode = 403;
      throw err;
    }

    // 3. Cryptographic Verification
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    
    if (!isMatch) {
      // Failed Login Logic: Wrapped in individual try-catches to prevent "Unknown column" crashes
      try {
        const attempts = (user.failed_attempts || 0) + 1;
        let status = user.status || 'active';
        let lockout_until = null;

        if (attempts >= 5) {
          status = 'locked';
          lockout_until = new Date(Date.now() + 30 * 60000); // 30 minute lockout
        }

        // Try updating security columns. If these fail due to missing columns, 
        // the catch block handles it silently so the 401 error can still be thrown properly.
        await pool.execute(
          'UPDATE users SET failed_attempts = ?, status = ?, lockout_until = ? WHERE id = ?',
          [attempts, status, lockout_until, user.id]
        );
      } catch (dbError) {
        console.warn("DB Resilience: Security columns (failed_attempts/status) missing in 'users' table.");
      }

      const err: any = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    // 4. Success Path: Reset security state and update audit trail
    // We split these into separate queries so that the missing failed_attempts column 
    // doesn't block the standard last_login_at update.
    
    // A. Attempt standard audit update (Usually exists)
    try {
      await pool.execute(
        'UPDATE users SET last_login_at = NOW() WHERE id = ?',
        [user.id]
      );
    } catch (e) {
      console.warn("DB Resilience: 'last_login_at' column missing.");
    }

    // B. Attempt security reset (Might fail if columns missing)
    try {
      await pool.execute(
        'UPDATE users SET failed_attempts = 0, lockout_until = NULL, status = "active" WHERE id = ?',
        [user.id]
      );
    } catch (e) {
      // Silence error: Missing security columns should not block a successful login
    }

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
