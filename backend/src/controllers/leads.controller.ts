
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';
import { EmailService } from '../services/email.service'; 

export class LeadsController {
  /**
   * Create a new lead from Website form
   */
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, course, message, source, details } = req.body;

      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Required fields missing');
      }

      const [result]: any = await pool.execute(
        'INSERT INTO leads (full_name, email, phone, course, message, source, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, "New", ?, NOW())',
        [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
      );

      // Fetch recipient list from site configuration (assuming site_config table or JSON blob)
      const [config]: any = await pool.execute('SELECT notification_emails FROM site_config LIMIT 1');
      const recipients = config[0]?.notification_emails ? JSON.parse(config[0].notification_emails) : [];

      if (recipients.length > 0) {
          await EmailService.notifyNewLead(req.body, recipients);
      }

      return sendResponse(res, 201, true, 'Lead recorded successfully', { id: result.insertId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all leads for dashboard
   */
  static async getAllLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
      return sendResponse(res, 200, true, 'Leads retrieved', rows);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Status
   */
  static async updateLeadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      const { status } = req.body;
      await pool.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
      return sendResponse(res, 200, true, 'Status updated');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Lead
   */
  static async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
      return sendResponse(res, 200, true, 'Lead record removed');
    } catch (error) {
      next(error);
    }
  }
}
