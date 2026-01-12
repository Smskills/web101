


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
      // Fix: Cast req to any as Request type in this environment does not expose 'body'
      const { fullName, email, phone, course, message, source, details } = (req as any).body;

      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Required fields missing');
      }

      const [result]: any = await pool.execute(
        'INSERT INTO leads (full_name, email, phone, course, message, source, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, "New", ?, NOW())',
        [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
      );

      // Fetch dynamic recipient list from database
      const [config]: any = await pool.execute('SELECT notification_emails FROM site_config WHERE id = 1');
      
      let recipients: string[] = [];
      try {
        const rawEmails = config[0]?.notification_emails;
        if (rawEmails) {
          // Handle both JSON strings and JS objects if the driver auto-parses
          recipients = typeof rawEmails === 'string' ? JSON.parse(rawEmails) : rawEmails;
        }
      } catch (e) {
        console.error("Configuration parse error:", e);
      }

      // If recipients exist, dispatch the multi-email notification
      if (recipients.length > 0) {
          // Fix: Cast req to any as Request type in this environment does not expose 'body'
          await EmailService.notifyNewLead((req as any).body, recipients);
      }

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
      // Fix: Cast req to any as Request type in this environment does not expose 'body'
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