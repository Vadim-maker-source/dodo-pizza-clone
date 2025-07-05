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

// Функция для генерации HTML письма клиенту
const generateCustomerEmail = (order, customerEmail) => {
  const items = JSON.parse(order.items);
  const itemsList = items.map(item => 
    `<li>${item.name} (${item.size}, ${item.dough}, ингредиенты: ${item.ingredient.join(', ')}) × ${item.count} - ${item.totalPrice * item.count} ₽</li>`
  ).join('');

  return `
    <h1>Спасибо за ваш заказ!</h1>
    <p>Номер заказа: ${order._id}</p>
    <h3>Детали заказа:</h3>
    <ul>${itemsList}</ul>
    <p><strong>Способ получения:</strong> ${order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}</p>
    ${order.deliveryType === 'delivery' ? `<p><strong>Адрес доставки:</strong> ${order.address}</p>` : ''}
    <p><strong>Итого к оплате:</strong> ${order.totalPrice} ₽</p>
    <p>Для оплаты перейдите по ссылке: <a href="https://example.com/pay?order=${order._id}">Оплатить заказ</a></p>
    ${order.comment ? `<p><strong>Ваш комментарий:</strong> ${order.comment}</p>` : ''}
    <p>Спасибо за покупку!</p>
  `;
};

// Функция для генерации HTML письма админу
const generateAdminEmail = (order, customerEmail) => {
  const items = JSON.parse(order.items);
  const itemsList = items.map(item => 
    `<li>${item.name} (${item.size}, ${item.dough}, <h1 className="font-bold">Ингредиенты:</h1> ${item.ingredient.join(', ')}) × ${item.count} - ${item.totalPrice * item.count} ₽</li>`
  ).join('');

  return `
    <h1>Новый заказ #${order._id}</h1>
    <h3>Контактные данные:</h3>
    <p><strong>Телефон:</strong> ${order.phone}</p>
    <p><strong>Email:</strong> ${customerEmail}</p>
    
    <h3>Детали заказа:</h3>
    <ul>${itemsList}</ul>
    <p><strong>Способ получения:</strong> ${order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}</p>
    ${order.deliveryType === 'delivery' ? `<p><strong>Адрес доставки:</strong> ${order.address}</p>` : ''}
    <p><strong>Итого:</strong> ${order.totalPrice} ₽</p>
    ${order.comment ? `<p><strong>Комментарий клиента:</strong> ${order.comment}</p>` : ''}
  `;
};

router.post('/notify-order', async (req, res) => {
  const { order, customerEmail } = req.body;

  try {
    // Письмо клиенту
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: customerEmail,
      subject: `Ваш заказ #${order._id}`,
      html: generateCustomerEmail(order, customerEmail)
    });

    // Письмо админу
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: `Новый заказ #${order._id}`,
      html: generateAdminEmail(order, customerEmail)
    });

    res.status(200).json({ message: 'Письма отправлены' });
  } catch (error) {
    console.error('Ошибка при отправке писем:', error);
    res.status(500).json({ message: 'Ошибка при отправке писем' });
  }
});

export default router;