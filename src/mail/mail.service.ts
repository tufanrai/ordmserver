// mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendStaffCredentials(
    ownerEmail: string,
    ownerName: string,
    restaurantName: string,
    cashierEmail: string,
    cashierPassword: string,
    kitchenEmail: string,
    kitchenPassword: string,
  ) {
    await this.mailerService.sendMail({
      to: ownerEmail,
      subject: `Welcome ${ownerName} — Your Staff Credentials`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          
          <h2>Welcome to Order Manager, ${ownerName}!</h2>
          <p>Your restaurant <strong>${restaurantName}</strong> has been registered successfully.</p>
          <p>Below are the login credentials for your staff. Please share them securely.</p>

          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3>Cashier Account</h3>
            <p>Email: <strong>${cashierEmail}</strong></p>
            <p>Temporary Password: <strong>${cashierPassword}</strong></p>
            <p style="color: #e57c00; font-size: 13px;">Staff must reset this password on first login.</p>
          </div>

          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3>Kitchen Account</h3>
            <p>Email: <strong>${kitchenEmail}</strong></p>
            <p>Temporary Password: <strong>${kitchenPassword}</strong></p>
            <p style="color: #e57c00; font-size: 13px;">Staff must reset this password on first login.</p>
          </div>

          <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    });
  }

  // Notify the sales amount with items
  async notifyUpdates() {}
}
