
// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  /**
   * Transporter configured with connection pooling for maximum speed.
   * pool: true keeps the SMTP connection open for reuse.
   */
  private static transporter = nodemailer.createTransport({
    host: ENV.SMTP.HOST,
    port: ENV.SMTP.PORT,
    secure: ENV.SMTP.SECURE,
    pool: true, 
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: ENV.SMTP.USER,
      pass: ENV.SMTP.PASS,
    },
  });

  /**
   * Dispatches an email notification. 
   * Designed to be called without 'await' in controllers for background execution.
   */
  static async notifyNewLead(leadData: any, recipients: string[]) {
    if (!recipients || recipients.length === 0) return;

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
        <h2 style="color: #059669; margin-top: 0;">New ${leadData.source === 'enrollment' ? 'Enrollment Application' : 'General Enquiry'}</h2>
        <p style="color: #666; font-size: 14px;">A new submission was received on the S M Skills website.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 150px;">Student Name:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #111;">${leadData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Email:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #111;">${leadData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Phone:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #111;">${leadData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Course:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #059669;">${leadData.course}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #cbd5e1;">
            <p style="margin: 0; color: #475569; font-size: 13px;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; color: #1e293b; line-height: 1.5;">${leadData.message || 'No additional comments provided.'}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">Automated Alert • S M Skills Institute Management System</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"S M Skills Portal" <${ENV.SMTP.USER}>`,
        to: recipients.join(', '),
        subject: `New Lead: ${leadData.fullName} (${leadData.course})`,
        html: htmlContent,
      });
      console.log(`✅ Background Email success: Sent to ${recipients.length} recipients for ${leadData.fullName}`);
    } catch (err) {
      console.error('❌ Background Email failed:', err);
    }
  }
}
