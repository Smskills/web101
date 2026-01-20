
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

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) {
      const err: any = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

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
        role: user.role
      }
    };
  }

  static async requestPasswordReset(email: string) {
    const user = await UsersRepository.findByIdentifier(email);
    
    if (!user) {
      console.log(`⚠️ Password Reset: Email "${email}" not found in database.`);
      return; 
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); 

    try {
      await pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [token, expiry, user.id]
      );
      await EmailService.sendPasswordResetLink(email, token, user.username);
    } catch (error) {
      console.error("❌ Recovery Error:", error);
      throw new Error("System failed to process recovery request.");
    }
  }

  static async resetPassword(token: string, plainPassword: string) {
    const [rows]: any = await pool.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW() LIMIT 1',
      [token]
    );

    if (rows.length === 0) {
      const err: any = new Error('Recovery link is invalid or expired.');
      err.statusCode = 400;
      throw err;
    }

    const userId = rows[0].id;
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, userId]
    );
  }
}
