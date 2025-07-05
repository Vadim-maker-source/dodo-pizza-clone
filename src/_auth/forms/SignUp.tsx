import { useEffect, useState } from 'react';
import { createUser, getCurrentUser } from '../../lib/appwrite/api';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '', phone: '', userId: '' });
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) navigate('/');
    };
    checkAuth();
  }, []);

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendVerification = async () => {
    const newCode = generateCode();
    setCode(newCode);
    setLoading(true)
    const res = await fetch('http://localhost:5000/api/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, code: newCode })
    });
    
    setLoading(false)

    if (res.ok) {
      setMessage('Код отправлен на почту');
      setStep(2);
    } else {
      setMessage('Ошибка при отправке письма');
    }
  };

  const verifyCodeAndRegister = async () => {
    if (enteredCode === code) {
      await createUser(user);
      setMessage('Пользователь зарегистрирован');
      navigate("/")
    } else {
      setMessage('Неверный код');
    }
  };

  return (
    <>
    <title>Регистрация | Пиццерия</title>
    <div className="w-[100%] h-full flex items-center justify-center">
    <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Регистрация</h2>

      {step === 1 && (
        <form onSubmit={e => { e.preventDefault(); sendVerification(); }} className="space-y-4">
          <input
            type="text"
            placeholder="Имя"
            className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
            onChange={e => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
            onChange={e => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
            onChange={e => setUser({ ...user, password: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Телефон"
            className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
            onChange={e => setUser({ ...user, phone: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 cursor-pointer"
          >
            {loading ? ("Отправлено") : ("Отправить код")}
          </button>
          <p onClick={() => navigate("/sign-in")} className='w-full text-center cursor-pointer'>Уже есть аккаунт? Войдите</p>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Введите код"
            className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
            onChange={e => setEnteredCode(e.target.value)}
          />
          <button
            onClick={verifyCodeAndRegister}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 cursor-pointer"
          >
            Подтвердить
          </button>
          <button
            onClick={sendVerification}
            className="w-full bg-gray-200 text-black py-3 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            Отправить код заново
          </button>
        </div>
      )}

      <p className="text-center text-sm text-gray-600">{message}</p>
    </div>
    </div>
    </>
  );
};

export default SignUp;
