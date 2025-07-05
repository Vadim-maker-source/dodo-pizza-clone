import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

router.post('/notify-login', async (req, res) => {
  const { email, userAgent } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Новый вход в аккаунт',
    text: `Был выполнен вход с устройства: ${userAgent}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Уведомление отправлено' });
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    res.status(500).json({ message: 'Ошибка при отправке письма' });
  }
});

export default router;
