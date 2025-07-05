// api/routes/verification.js
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/send-verification', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email и код обязательны' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Подтверждение <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Код подтверждения',
      text: `Ваш код подтверждения: ${code}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Письмо отправлено' });
  } catch (err) {
    console.error('Ошибка при отправке письма:', err);
    res.status(500).json({ error: 'Не удалось отправить письмо' });
  }
});

export default router; // 🔧 ВАЖНО: добавьте это