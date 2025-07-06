'use client'

import { useState, useEffect } from 'react';
import type { Pizza } from './Pizza';
import { addPizzaToCart, getCurrentUser } from '../lib/appwrite/api';
import type { User } from '../lib/appwrite/types';

interface Ingredient {
  name: string;
  price: number;
  imageUrl: string;
}

interface PizzaDetailsModalProps {
  pizza: Pizza;
  initialDough?: 'Тонкое' | 'Традиционное';
  initialSize?: '20 см' | '30 см' | '40 см';
  onClose: () => void;
}

const allAdditionalIngredients: Ingredient[] = [
    { name: 'Пряная говядина', price: 139, imageUrl: '/assets/addIngredients/spicy-beef.png' },
    { name: 'Моцарелла', price: 119, imageUrl: '/assets/addIngredients/cream-mozzarella.png' },
    { name: 'Сыры чеддер и пармезан', price: 69, imageUrl: '/assets/addIngredients/chedder-parmezan.png' },
    { name: 'Острый перец халапеньо', price: 59, imageUrl: '/assets/addIngredients/halapeniyu.png' },
    { name: 'Нежный цыпленок', price: 69, imageUrl: '/assets/addIngredients/chicken.png' },
    { name: 'Шампиньоны', price: 89, imageUrl: '/assets/addIngredients/champignons.png' },
    { name: 'Бекон', price: 99, imageUrl: '/assets/addIngredients/bacon.png' },
    { name: 'Ветчина', price: 89, imageUrl: '/assets/addIngredients/ham.png' },
    { name: 'Пикантная пепперони', price: 69, imageUrl: '/assets/addIngredients/spicy-pepperoni.png' },
    { name: 'Острая чоризо', price: 59, imageUrl: '/assets/addIngredients/spicy-chorizo.png' },
    { name: 'Маринованные огурчики', price: 49, imageUrl: '/assets/addIngredients/pickles.png' },
    { name: 'Свежие томаты', price: 69, imageUrl: '/assets/addIngredients/fresh-tomatoes.png' },
    { name: 'Красный лук', price: 39, imageUrl: '/assets/addIngredients/red-onion.png' },
    { name: 'Сочные ананасы', price: 89, imageUrl: '/assets/addIngredients/juicy-pineapples.png' },
    { name: 'Итальянские травы', price: 19, imageUrl: '/assets/addIngredients/italy-grass.png' },
    { name: 'Сладкий перец', price: 69, imageUrl: '/assets/addIngredients/sweet-pepper.png' },
    { name: 'Кубики брынзы', price: 69, imageUrl: '/assets/addIngredients/lump-brynza.png' },
    { name: 'Митболы', price: 89, imageUrl: '/assets/addIngredients/meetbal.png' },
    { name: 'Баварские колбаски', price: 119, imageUrl: '/assets/addIngredients/bavarian-sausages.png' },
    { name: 'Креветки', price: 169, imageUrl: '/assets/addIngredients/prawn.png' },
  ];

export const PizzaDetailsModal = ({
  pizza,
  initialDough = 'Традиционное',
  initialSize = '20 см',
  onClose
}: PizzaDetailsModalProps) => {
  const [selectedDough, setSelectedDough] = useState<'Тонкое' | 'Традиционное'>(initialDough);
  const [selectedSize, setSelectedSize] = useState<'20 см' | '30 см' | '40 см'>(initialSize);
  const [selectedAdditionalIngredients, setSelectedAdditionalIngredients] = useState<Record<string, boolean>>({});

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
      const fetchUser = async () => {
        const currentUser = await getCurrentUser();
        if(currentUser){
          setUser(currentUser);
        }
      };
  
      fetchUser();
    }, []);
  
  // Фильтруем только те ингредиенты, которых нет в стандартном составе
  const availableAdditionalIngredients = allAdditionalIngredients.filter(
    ing => !pizza.ingridients.includes(ing.name)
  );

  // Расчет множителя размера
  const getSizeMultiplier = () => {
    switch (selectedSize) {
      case '20 см': return 1;
      case '30 см': return 1.5;
      case '40 см': return 2;
      default: return 1;
    }
  };

  // Расчет цены
  const calculatePrice = () => {
    const multiplier = getSizeMultiplier();
    const basePrice = pizza.price * multiplier;
    
    const additionalIngredientsPrice = Object.entries(selectedAdditionalIngredients)
      .filter(([_, selected]) => selected)
      .reduce((sum, [name]) => {
        const ingredient = allAdditionalIngredients.find(i => i.name === name);
        return sum + (ingredient ? Math.round(ingredient.price * multiplier) : 0);
      }, 0);
    
    return Math.round(basePrice + additionalIngredientsPrice);
  };

  const [currentPrice, setCurrentPrice] = useState(calculatePrice());

  useEffect(() => {
    setCurrentPrice(calculatePrice());
  }, [selectedDough, selectedSize, selectedAdditionalIngredients]);

  const toggleAdditionalIngredient = (name: string) => {
    setSelectedAdditionalIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleAddToCart = () => {
    if(user){
    addPizzaToCart(
      user.userId,
      pizza.id,
      selectedDough,
      selectedSize,
      [
        ...pizza.ingridients,
        ...Object.entries(selectedAdditionalIngredients)
          .filter(([_, selected]) => selected)
          .map(([name]) => name)
      ],
      currentPrice,
      pizza.name,)
    }
    onClose();
  };

  // Функция для форматирования названия теста
  const formatDough = (dough: string) => {
    if (dough === 'Тонкое') return 'Тонкое';
    if (dough === 'Традиционное') return 'Традиционное';
    return dough;
  };

  // Функция для получения размера пиццы в пикселях
  const getPizzaSize = () => {
    switch (selectedSize) {
      case '20 см': return '24rem';
      case '30 см': return '30rem';
      case '40 см': return '36rem';
      default: return '18rem';
    }
  };

  return (
    <>
    <title>Пиццерия</title>
    <div className="fixed inset-0 bg-container flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-full md:max-h-[100vh] overflow-y-auto ">
        <div className="flex flex-col md:flex-row">
              <button 
                onClick={onClose}
                className="ml-[565px] mt-3 text-gray-500 hover:text-gray-700 md:hidden lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          {/* Левая часть с изображением пиццы */}
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center bg-white">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">{pizza.name}</h2>
              <p className="text-gray-600 mb-4">
                {selectedSize}, {formatDough(selectedDough)} тесто
              </p>
            </div>
            
            {/* Изображение пиццы */}
            <div className="mb-4 flex-1 flex items-center justify-center">
              <div 
                className="rounded-full flex items-center justify-center overflow-hidden transition-all duration-300"
                style={{ 
                  width: getPizzaSize(), 
                  height: getPizzaSize(),
                }}
              >
                <img 
                  src={pizza.imageUrl} 
                  alt={pizza.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Стандартные ингредиенты */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">Стандартный состав:</h3>
              <div className="p-2">
                <p className="text-gray-600 text-md">
                  {pizza.ingridients.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Правая часть с настройками */}
          <div className="w-full md:w-1/2 p-6 bg-gray-50">
            <div className="flex justify-end mb-4">
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hidden md:block cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Выбор размера */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Размер</h3>
              <div className="flex space-x-3 justify-center">
                {pizza.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size as '20 см' | '30 см' | '40 см')}
                    className={`py-2 px-4 rounded-full border-0 w-50 cursor-pointer ${
                      selectedSize === size
                        ? 'bg-white text-gray-700 shadow-sm'
                        : 'text-gray-700 border-0'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Выбор теста */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Тесто</h3>
              <div className="flex space-x-3 justify-center">
                {pizza.dough.map(dough => (
                  <button
                    key={dough}
                    onClick={() => setSelectedDough(dough as 'Тонкое' | 'Традиционное')}
                    className={`py-2 px-4 rounded-full border-0 w-50 cursor-pointer ${
                      selectedDough === dough
                        ? 'bg-white text-gray-700 shadow-sm'
                        : 'text-gray-700 border-0'
                    }`}
                  >
                    {dough}
                  </button>
                ))}
              </div>
            </div>

            {/* Дополнительные ингредиенты */}
            {availableAdditionalIngredients.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Добавить по вкусу</h3>
                <div className="grid grid-cols-2 gap-4 max-h-[30rem] overflow-y-auto pr-2">
                  {availableAdditionalIngredients.map(ingredient => {
                    const multiplier = getSizeMultiplier();
                    const ingredientPrice = Math.round(ingredient.price * multiplier);
                    const isSelected = !!selectedAdditionalIngredients[ingredient.name];
                    
                    return (
                      <div 
                        key={ingredient.name} 
                        className={`flex flex-col items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                          isSelected 
                            ? 'bg-orange-50 border border-orange-500' 
                            : 'bg-white border border-transparent'
                        }`}
                        onClick={() => toggleAdditionalIngredient(ingredient.name)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="mr-3 flex-shrink-0">
                            <img 
                              src={ingredient.imageUrl} 
                              alt={ingredient.name} 
                              className="w-35 h-35 object-cover rounded-full"
                            />
                          </div>
                          <span className="text-md">{ingredient.name}</span>
                        </div>
                        <div className="flex items-center">
                          {/* {isSelected && (
                            <div className="mr-2 w-5 h-5 flex items-center justify-center bg-orange-500 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )} */}
                          <span className="text-gray-600 text-md font-medium">+{ingredientPrice} ₽</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Итоговая цена и кнопка */}
            <div className="flex justify-between items-center mt-8 border-t border-gray-300 pt-4">
              <div className="text-xl font-bold">
                Итого: {currentPrice} ₽
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md cursor-pointer"
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};