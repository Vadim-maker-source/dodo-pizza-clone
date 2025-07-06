import { useEffect, useState } from 'react';
import { getCartItems, getCurrentUser, signOut } from '../lib/appwrite/api';
import type { CartItem, User } from '../lib/appwrite/types';
import { useNavigate } from 'react-router-dom';
import { PizzaCatalog, type Pizza } from './Pizza';
import { FaShoppingCart } from 'react-icons/fa';
import { PizzaDetailsModal } from './PizzaDetails';
import CartSidebar from './Cart';

const Topbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user?.userId) {
        try {
          const items = await getCartItems(user.userId);
          setCartItems(items);
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartItems([]);
        }
      }
    };
    fetchCartItems();
  }, [user]);
  
  const handleLogout = async () => {
    await signOut();
    setUser(null);
    navigate('/sign-in');
  };

  const refreshCart = async () => {
    if (user?.userId) {
      const items = await getCartItems(user.userId);
      setCartItems(items);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user?.userId]);

  // Подсчет общего количества товаров (сумма количеств)
  const cartItemsCount = cartItems.reduce((sum, item) => sum + parseInt(item.count || '1'), 0);

  // Подсчет общей суммы
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice;
    const count = parseInt(item.count || '1');
    return sum + (price * count);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      maximumFractionDigits: 2
    }).format(price);
  };

  const filteredPizzas = PizzaCatalog.filter(pizza =>
    pizza.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white shadow-sm p-6 flex justify-between items-center relative">
      <h1
        className="hidden lg:block text-3xl font-extrabold cursor-pointer text-orange-600 hover:text-orange-700 transition"
        onClick={() => navigate('/')}
      >
        Пиццерия
      </h1>

      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Поиск..."
          className="px-6 py-3 rounded-xl lg:w-150 bg-gray-100 border-none focus:outline-none text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        
        {showSuggestions && searchQuery && (
          <div className="absolute z-10 mt-2 w-150 bg-white rounded-7xl shadow-lg border border-gray-200 overflow-y-auto">
            {filteredPizzas.length > 0 ? (
              filteredPizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  className="p-4 gap-4 flex items-center hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 h-20"
                  onClick={() => {
                    setSearchQuery(pizza.name);
                    setShowSuggestions(false);
                    setSelectedPizza(pizza)
                  }}
                >
                    <img src={pizza.imageUrl} alt={pizza.name} height={45} width={45} />
                  <div className="flex flex-col">
                  <div className="font-semibold">{pizza.name}</div>
                  <div className="text-sm text-gray-500">
                    {pizza.ingridients.slice(0, 3).join(", ")}...
                  </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500">
                Ничего не найдено
              </div>
            )}
          </div>
        )}
      </div>

      {user ? (
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-lg font-bold text-gray-800">{user.name}</span>
          </div>

          <div
  className="relative bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-lg font-bold cursor-pointer hover:bg-gray-200 transition"
  onClick={() => setIsCartOpen(true)}
>
  {formatPrice(cartTotal)} ₽ |
  <FaShoppingCart className="inline ml-2" />
  {cartItemsCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
      {cartItemsCount}
    </span>
  )}
</div>

          <button
            onClick={handleLogout}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-bold text-lg"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          <button
            onClick={() => navigate('/sign-in')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-bold text-lg"
          >
            Вход
          </button>
          <button
            onClick={() => navigate('/sign-up')}
            className="bg-white text-orange-600 border-2 border-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50 transition font-bold text-lg"
          >
            Регистрация
          </button>
        </div>
      )}
      {selectedPizza && (
          <PizzaDetailsModal
              pizza={selectedPizza}
              initialDough={'Традиционное'}
              initialSize={'30 см'}
              onClose={() => setSelectedPizza(null)}
          />
      )}
      <CartSidebar 
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  cartItems={cartItems}
  cartTotal={cartTotal}
  userId={user?.userId || ''}
  onCartUpdate={refreshCart}
/>
    </div>
  );
};

export default Topbar;