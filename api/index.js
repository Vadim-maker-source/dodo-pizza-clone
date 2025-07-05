import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verificationRoutes from './routes/verification.js';
import notifyLoginRoute from './routes/notifyLogin.js';
import orderNotificationsRoute from './routes/orderNotifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Явно разрешаем нужные методы
}));

app.use(express.json());

app.use('/api', verificationRoutes);
app.use('/api', notifyLoginRoute);
app.use('/api', orderNotificationsRoute);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});