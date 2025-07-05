import { FaTimes, FaPlus, FaMinus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import type { CartItem } from '../lib/appwrite/types';
import { PizzaCatalog } from './Pizza';
import { appwriteConfig, databases } from '../lib/appwrite/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  userId: string;
  onCartUpdate: () => void;
}

const CartSidebar = ({ isOpen, onClose, cartItems, onCartUpdate }: CartSidebarProps) => {
  const [localCart, setLocalCart] = useState<CartItem[]>(cartItems);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (JSON.stringify(cartItems) !== JSON.stringify(localCart)) {
      setLocalCart(cartItems);
    }
  }, [cartItems]);

  const getPizzaImage = (pizzaId: number) => {
    const pizza = PizzaCatalog.find(p => p.id === pizzaId);
    return pizza?.imageUrl || '/default-pizza.png';
  };

  const updateQuantity = async (itemId: string, newCount: number) => {
    if (newCount < 1) {
      await removeItem(itemId);
      return;
    }

    setIsUpdating(true);
    try {
      // Оптимистичное обновление
      setLocalCart(prev => prev.map(item => 
        item.$id === itemId ? { ...item, count: newCount.toString() } : item
      ));

      const prevPrice = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        itemId,
      )

      const previousPrice = prevPrice.totalPrice / prevPrice.count

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        itemId,
        { count: newCount.toString(),
          totalPrice: (previousPrice * newCount).toString()
         }
      );
      
      onCartUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Откат при ошибке
      setLocalCart(cartItems);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsUpdating(true);
    try {
      // Оптимистичное обновление
      setLocalCart(prev => prev.filter(item => item.$id !== itemId));

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        itemId
      );
      
      onCartUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
      setLocalCart(cartItems);
    } finally {
      setIsUpdating(false);
    }
  };

  // Локальный расчет суммы
  const currentTotal = localCart.reduce((sum, item) => {
    const price = typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice;
    return sum + (price);
  }, 0);

  function toOrd() {
    navigate("/create-order")
    const toOrder = onClose()
    return toOrder
  }

  return (
    <>
    <title>Корзина | Пиццерия</title>
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'} duration-300`}>
      {/* Оверлей */}
      <div className="absolute inset-0 bg-container hidden md:block" onClick={onClose} />
      
      {/* Боковая панель */}
      <div className={`absolute top-0 md:right-0 lg:right-0 h-full bg-[#f4f1ee] lg:w-115 md:w-96 w-full transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="py-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold pl-6">Ваша корзина</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 pr-6 cursor-pointer">
              <FaTimes size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {localCart.length > 0 ? (
              localCart.map(item => {
                const count = parseInt(item.count || '1');
                const price = typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice;
                const itemTotal = price;

                return (
                  <div key={item.$id} className="flex gap-4 p-3 items-start bg-white border-gray-300 py-4 mt-6">
                    <img 
                      src={getPizzaImage(parseInt(item.pizzaId))} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-xl">{item.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.size}, {item.dough} тесто, {(item.ingredient).join(", ")}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.$id, count - 1)}
                            className="p-3 rounded-xl text-orange-600 border border-orange-500 hover:bg-orange-500 hover:text-white duration-300 cursor-pointer"
                            disabled={count <= 1 || isUpdating}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-3 font-bold text-lg">{count}</span>
                          <button
                            onClick={() => updateQuantity(item.$id, count + 1)}
                            className="p-3 rounded-xl text-orange-600 border border-orange-500 hover:bg-orange-500 hover:text-white duration-300 cursor-pointer"
                            disabled={isUpdating}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <p className="font-bold text-lg">{itemTotal.toFixed(2)} ₽</p>
                        <button 
                          onClick={() => removeItem(item.$id)}
                          className="text-gray-400 hover:text-gray-500 cursor-pointer"
                          disabled={isUpdating}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-5">
                <img src="/assets/empty-box.webp" alt="Пустая коробка" width={150} height={150} />
                <h1 className="text-3xl font-bold">Корзина пустая</h1>
                <p className="font-semibold text-lg text-center text-gray-400 w-100">Добавьте хотя бы один товар, чтобы совершить заказ</p>
                <button className="w-60 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition font-semibold disabled:bg-gray-300 cursor-pointer px-5 py-5 text-xl flex items-center justify-between" onClick={onClose}><FaArrowLeft size={20} /> Вернуться назад</button>
              </div>
            )}
          </div>
          {localCart.length > 0 && (
          <div className="border-t border-gray-300 py-4 px-4">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Итого:</span>
              <span>{currentTotal.toFixed(2)} ₽</span>
            </div>
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-bold disabled:bg-gray-300 cursor-pointer"
              disabled={localCart.length === 0 || isUpdating}
              onClick={toOrd}
            >
              Оформить заказ
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CartSidebar;