import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('--- [EMAIL MOCK / NO SMTP CONFIGURED] ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message Preview:\n${text || html?.replace(/<[^>]+>/g, '').slice(0, 300)}`);
    console.log('-----------------------------------------');
    return { mock: true, success: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: {
        user,
        pass
      }
    });

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Chulbul's Art"}" <${process.env.EMAIL_FROM_ADDRESS || user}>`,
      to,
      subject,
      text,
      html
    });

    return { mock: false, success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    // Return gracefully so the application flow never crashes due to mail delivery failure
    return { mock: false, success: false, error: error.message };
  }
};
