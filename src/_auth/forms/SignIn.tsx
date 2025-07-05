import { useEffect, useState } from 'react';
import { getCurrentUser, signIn } from '../../lib/appwrite/api';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) navigate('/');
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    const session = await signIn(email, password);
    if (session) {
      await fetch('https://dodo-pizza-clone-green.vercel.app/api/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userAgent: navigator.userAgent }),
      });
      setMessage('Вход выполнен, уведомление отправлено на почту');
      navigate("/")
    } else {
      setMessage('Ошибка входа');
    }
  };

  return (
    <>
    <title>Вход в аккаунт | Пиццерия</title>
    <div className="w-[100%] h-full flex items-center justify-center">
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Вход</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 cursor-pointer"
      >
        Войти
      </button>

      <p onClick={() => navigate("/sign-up")} className='w-full text-center cursor-pointer'>Уже есть аккаунт? Войдите</p>

      <p className="text-center text-sm text-gray-600">{message}</p>
    </div>
    </div>
    </>
  );
};

export default SignIn;
