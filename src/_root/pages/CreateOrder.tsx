import { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import type { User, CartItem, Order } from '../../lib/appwrite/types';
import { createOrder, deleteCartItems, getCartItems, getCurrentUser } from '../../lib/appwrite/api';
import { useNavigate } from 'react-router-dom';
import { AdressInput } from '../../components/address-input';
import type { DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { PizzaCatalog } from '../../components/Pizza';

const CreateOrder = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [address, setAddress] = useState<DaDataSuggestion<DaDataAddress> | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  
  // Расчет стоимости
  const subtotal = items.reduce((sum, item) => {
    const price = typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice;
    const count = typeof item.count === 'string' ? parseInt(item.count) : item.count || 1;
    return sum + (price * count);
  }, 0);
  
  const deliveryCost = delivery ? 200 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryCost + tax;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const cartItems = await getCartItems(currentUser.userId);
          setItems(cartItems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async () => {
    if (!user?.userId || !phone || !user?.email || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const deliveryType: 'delivery' | 'pickup' = delivery ? 'delivery' : 'pickup';
      
      const orderData: Order = {
        userId: user.userId,
        phone,
        deliveryType,
        address: delivery ? address?.value || '' : 'Самовывоз',
        comment,
        items: JSON.stringify(items),
        totalPrice: total.toString()
      };
      
      // Создаем заказ
      const createdOrder = await createOrder(orderData);
      deleteCartItems(user.userId)

      // Отправляем письма
      await fetch('http://localhost:5000/api/notify-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: createdOrder,
          customerEmail: user.email
        })
      });
      
      navigate('/order-success');
    } catch (error) {
      console.error('Order submission error:', error);
      setIsSubmitting(false);
    }
};

  const getPizzaById = (id: string) => {
    return PizzaCatalog.find(pizza => pizza.id.toString() === id);
  };

  if (loading) return <div className="p-6 text-center">Загрузка...</div>;

  return (
    <>
    <title>Оформление заказа | Пиццерия</title>
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-orange-500 mb-6"
      >
        <FaArrowLeft /> Вернуться в корзину
      </button>

      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      {/* Шаги оформления */}
      <div className="flex mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div 
            key={stepNumber}
            className={`flex-1 text-lg text-center pb-2 border-b-2 ${
              step === stepNumber 
                ? 'border-orange-500 text-orange-500' 
                : 'border-gray-300 cursor-pointer'
            }`}
            onClick={() => step >= stepNumber && setStep(stepNumber as 1 | 2 | 3)}
          >
            {stepNumber === 1 && 'Контакты'}
            {stepNumber === 2 && 'Доставка'}
            {stepNumber === 3 && 'Подтверждение'}
          </div>
        ))}
      </div>

      {/* Шаг 1: Контактные данные */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Контактные данные</h2>
          
          <div>
            <label className="block mb-2">Имя</label>
            <input 
              type="text" 
              className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
              value={user?.name || ''}
              readOnly
            />
          </div>
          
          <div>
            <label className="block mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
              value={user?.email || ''}
              readOnly
            />
          </div>
          
          <div>
            <label className="block mb-2">Телефон *</label>
            <input
              type="tel" 
              className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (XXX) XXX-XX-XX"
              required
            />
          </div>
          
          <button
            onClick={() => setStep(2)}
            disabled={!phone}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300"
          >
            Продолжить
          </button>
        </div>
      )}

      {/* Шаг 2: Доставка */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Способ получения</h2>
          
          <div className="flex flex-col justify-start gap-4">
            {[
              { value: false, label: 'Самовывоз' },
              { value: true, label: 'Доставка (+200 ₽)' }
            ].map((option) => (
              <label key={String(option.value)} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input 
                    type="radio" 
                    checked={delivery === option.value}
                    onChange={() => setDelivery(option.value)}
                    className="appearance-none h-8 w-8 bg-gray-100 rounded-xl checked:bg-orange-500 transition duration-200"
                  />
                  {delivery === option.value && (
                    <FaCheck className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm" />
                  )}
                </div>
                {option.label}
              </label>
            ))}
          </div>
          
          {delivery && (
            <div>
              <label className="block mb-2">Адрес доставки *</label>
              <AdressInput 
                value={address}
                onChange={setAddress}
              />
            </div>
          )}
          
          <div>
            <label className="block mb-2">Комментарий к заказу</label>
            <textarea
              className="w-full p-4 border-2 text-xl border-gray-300 rounded-xl outline-0 max-h-70 min-h-30"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Особенности доставки, пожелания и т.д. (не обязательно)"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer duration-300"
            >
              Назад
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={delivery && !address}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg border cursor-pointer enabled:hover:text-orange-600 enabled:border-orange-600 hover:bg-white disabled:bg-gray-300 duration-300"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      {/* Шаг 3: Подтверждение */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Подтверждение заказа</h2>
          
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-xl">Ваш заказ:</h3>
            {items.map(item => {
              const count = typeof item.count === 'string' ? parseInt(item.count) : item.count || 1;
              const price = typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice || 0;
              const itemTotal = price * count;
              const pizza = getPizzaById(item.pizzaId);

              return (
                <div key={item.$id} className="flex items-center justify-between py-4 border-b border-gray-300">
                  <div className="flex items-center gap-4">
                    {pizza?.imageUrl && (
                      <img 
                        src={pizza.imageUrl} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium text-xl">{item.name}</p>
                      <p className="text-lg text-gray-500">
                        {item.size}, {item.dough} тесто × {count}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg">{itemTotal.toFixed(2)} ₽</p>
                </div>
              );
            })}
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xl">
                <span>Сумма:</span>
                <span>{subtotal.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Доставка:</span>
                <span>{deliveryCost.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>НДС (10%):</span>
                <span>{tax.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between font-bold text-xl mt-2">
                <span>Итого:</span>
                <span>{total.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-xl">Контактные данные:</h3>
            <p className="text-lg">Имя: {user?.name}</p>
            <p className="text-lg">Почта: {user?.email}</p>
            <p className="text-lg">Номер телефона: {phone}</p>
          </div>
          
          {delivery && (
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-xl">Адрес:</h3>
              <p className="text-lg">{address?.value || 'Адрес не указан'}</p>
              {address?.data.postal_code && (
                <p className="text-lg">Почтовый индекс: {address.data.postal_code}</p>
              )}
            </div>
          )}
          
          {comment && (
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-xl mb-2">Комментарий:</h3>
              <p className="text-lg">{comment}</p>
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 items-center border border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer duration-300"
            >
              Назад
            </button>
            <button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className={`flex-1 bg-orange-500 text-white py-3 rounded-lg border cursor-pointer hover:text-orange-600 border-orange-600 hover:bg-white duration-300 ${
    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Обработка...
    </span>
  ) : (
    <span className="flex items-center justify-center gap-4"><FaCheck /> Подтвердить заказ</span>
  )}
</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CreateOrder;