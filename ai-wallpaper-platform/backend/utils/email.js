const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to AI Wallpaper Platform!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome to AI Wallpaper Platform!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining us! You now have access to thousands of stunning AI-generated wallpapers.</p>
        <p>Get started by exploring our collection and finding the perfect wallpaper for your device.</p>
        <a href="${process.env.CLIENT_URL}/gallery" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Explore Gallery
        </a>
        <p>Happy browsing!</p>
        <p>The AI Wallpaper Platform Team</p>
      </div>
    `;

    await this.sendEmail({ to: user.email, subject, html });
  }

  async sendSubscriptionConfirmation(user, plan) {
    const subject = 'Subscription Confirmed!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Subscription Confirmed!</h1>
        <p>Hi ${user.name},</p>
        <p>Your subscription to the <strong>${plan.toUpperCase()}</strong> plan has been confirmed.</p>
        <p>You now have access to:</p>
        <ul>
          <li>Unlimited downloads</li>
          <li>High-resolution originals</li>
          <li>Commercial use license</li>
          <li>Priority support</li>
        </ul>
        <a href="${process.env.CLIENT_URL}/account" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Account
        </a>
        <p>Thank you for your support!</p>
      </div>
    `;

    await this.sendEmail({ to: user.email, subject, html });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Password Reset Request</h1>
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await this.sendEmail({ to: user.email, subject, html });
  }

  async sendNewsletterEmail(subscribers, content) {
    const promises = subscribers.map(subscriber => {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${content}
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            You're receiving this because you subscribed to our newsletter.
            <a href="${process.env.CLIENT_URL}/unsubscribe">Unsubscribe</a>
          </p>
        </div>
      `;

      return this.sendEmail({
        to: subscriber.email,
        subject: 'New Wallpapers & Updates',
        html
      });
    });

    return Promise.all(promises);
  }
}

module.exports = new EmailService();
