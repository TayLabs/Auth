import env from '@/types/env';
import axios from 'axios';

type SendMailPayload = {
  to: {
    name?: string;
    email: string;
  };
  subject: string;
  text: string;
  html: string;
};

export const sendMail = async (data: SendMailPayload) => {
  await axios.post(
    `http://${env.MAIL_API.HOST}:${env.MAIL_API.PORT}/api/v1/send`,
    {
      ...data,
    },
    {
      headers: {
        'x-api-key': env.MAIL_API_KEY,
      },
    }
  );
};
