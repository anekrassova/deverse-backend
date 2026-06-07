import nodemailer from 'nodemailer';
import { logger } from '../shared/logger.js';

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

  logger.debug({
    msg: '[mailer] preparing email send',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: smtpPort,
      secure: false,
      requireTLS: true,
      hasAuth: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    },
    message: {
      from,
      to,
      subject,
      textLength: text.length,
    },
  });

  try {
    const info = await mailer.sendMail({
      from,
      to,
      subject,
      text,
    });

    logger.info({
      msg: '[mailer] email sent successfully',
      message: {
        from,
        to,
        subject,
      },
      transport: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        msg: '[mailer] email send failed',
        smtp: {
          host: process.env.SMTP_HOST || 'localhost',
          port: smtpPort,
          secure: false,
          requireTLS: true,
          hasAuth: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
        },
        message: {
          from,
          to,
          subject,
          textLength: text.length,
        },
      },
      'Email send failed',
    );

    throw error;
  }
};
