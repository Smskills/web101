import pool from '../config/database';

export class AdminRepository {
  /**
   * Find an admin record by email for authentication purposes.
   * Table schema assumes: admins(id, email, password, status)
   */
  static async findByEmail(email: string) {
    const [rows]: any = await pool.execute(
      'SELECT * FROM admins WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  }
}