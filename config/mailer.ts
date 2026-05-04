import nodemailer from 'nodemailer';

const smtpPort = Number(process.env.SMTP_PORT) || 1025;

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: smtpPort,
  secure: false,
  requireTLS: true,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASSWORD
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined,
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  const from = process.env.SMTP_FROM || 'no-reply@local.dev';

  await mailer.sendMail({
    from,
    to,
    subject,
    text,
  });
};
