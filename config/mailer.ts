import { Resend } from 'resend';
import { logger } from '../shared/logger.js';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  const from = process.env.RESEND_FROM || process.env.SMTP_FROM || 'no-reply@local.dev';

  logger.debug({
    msg: '[mailer] preparing resend email send',
    resend: {
      hasApiKey: Boolean(resendApiKey),
    },
    message: {
      from,
      to,
      subject,
      textLength: text.length,
    },
  });

  if (!resend) {
    const error = new Error('RESEND_API_KEY is not configured.');

    logger.error(
      {
        err: error,
        msg: '[mailer] resend is not configured',
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

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });

    if (error) {
      logger.error(
        {
          msg: '[mailer] resend email send failed',
          resend: {
            name: error.name,
            message: error.message,
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

      throw new Error(error.message);
    }

    logger.info({
      msg: '[mailer] resend email sent successfully',
      message: {
        from,
        to,
        subject,
      },
      resend: {
        emailId: data?.id,
      },
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        msg: '[mailer] resend email send failed',
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
