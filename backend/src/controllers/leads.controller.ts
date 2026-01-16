
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';
import { EmailService } from '../services/email.service'; 

export class LeadsController {
  /**
   * Create a new lead from Website form
   * Optimized for speed by backgrounding the email task.
   */
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, course, message, source, details } = (req as any).body;

      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Required fields missing');
      }

      // 1. FAST PATH: Save to local database first
      const [result]: any = await pool.execute(
        'INSERT INTO leads (full_name, email, phone, course, message, source, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, "New", ?, NOW())',
        [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
      );

      // 2. BACKGROUND PATH: Fetch config and send email without waiting
      // We don't await this block to ensure the user gets a response in milliseconds
      (async () => {
        try {
          const [configRows]: any = await pool.execute('SELECT notification_emails FROM site_config WHERE id = 1');
          
          let recipients: string[] = [];
          if (configRows && configRows[0]?.notification_emails) {
            const raw = configRows[0].notification_emails;
            recipients = typeof raw === 'string' ? JSON.parse(raw) : raw;
          }

          if (recipients.length > 0) {
            // Note: No 'await' used on the outer call in createLead, 
            // but we await inside this self-invoking function to manage flow.
            await EmailService.notifyNewLead((req as any).body, recipients);
          }
        } catch (emailError) {
          console.error("Critical: Background notification task failed:", emailError);
        }
      })();

      // 3. IMMEDIATE SUCCESS: Tell the frontend we are done
      return sendResponse(res, 201, true, 'Application processed successfully', { id: result.insertId });
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
      const { status } = (req as any).body;
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
