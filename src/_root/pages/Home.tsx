import { useState } from "react";
import { PizzaCatalog, type Pizza } from "../../components/Pizza";
import Sorting from "../../components/Sorting";
import { PizzaDetailsModal } from "../../components/PizzaDetails";

export type Filters = {
  doughTypes: {
    'Тонкое': boolean;
    'Традиционное': boolean;
  };
  selectedSize: string[];
  priceRange: [number, number];
  ingredients: {
    'Сырный бортик': boolean;
    'Сливочная моцарелла': boolean;
    'Сыры чеддер и пармезан': boolean;
    'Острый перец халапенью': boolean;
    'Нежный цыпленок': boolean;
  };
};

const Home = () => {
  const [filters, setFilters] = useState<Filters>({
    doughTypes: { 'Тонкое': false, 'Традиционное': true },
    selectedSize: [],
    priceRange: [0, 1000],
    ingredients: {
      'Сырный бортик': false,
      'Сливочная моцарелла': false,
      'Сыры чеддер и пармезан': false,
      'Острый перец халапенью': false,
      'Нежный цыпленок': false
    }
  });

  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);

  const filteredProducts = PizzaCatalog.filter((pizza) => {
    const selectedDoughTypes = Object.entries(filters.doughTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);

    const doughMatch = selectedDoughTypes.some(type => pizza.dough.includes(type));

    const sizeMatch = filters.selectedSize.length === 0
  ? true
  : filters.selectedSize.some(size => pizza.sizes.includes(size));

    const priceMatch =
      pizza.price >= filters.priceRange[0] && pizza.price <= filters.priceRange[1];

    const selectedIngr = Object.entries(filters.ingredients)
      .filter(([_, val]) => val)
      .map(([key]) => key);

    const ingredientsMatch = selectedIngr.every(ingr =>
      pizza.ingridients.includes(ingr)
    );

    return doughMatch && sizeMatch && priceMatch && ingredientsMatch;
  });

  return (
    <>
    <title>Пиццерия</title>
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="w-0 md:w-1/4 lg:w-1/5">
        <Sorting filters={filters} setFilters={setFilters} />
      </div>
    
      <div className="mt-9 flex-1">
        <h2 className="text-4xl font-extrabold mb-2">Пиццы</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 w-full mt-6">
          {filteredProducts.map((pizza) => (
            <div key={pizza.id} onClick={() => setSelectedPizza(pizza)} className="bg-white rounded-lg overflow-hidden duration-300 flex flex-col">
              {/* Блок с изображением (без изменений) */}
              <div className="flex md:h-140 bg-orange-50 rounded-xl items-center justify-center cursor-pointer">
                <img
                  src={pizza.imageUrl}
                  alt={pizza.name}
                  className="w-full object-cover relative top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] p-6"
                />
              </div>
              
              {/* Блок с текстом */}
              <div className="p-4 flex flex-col" style={{ minHeight: '160px' }}>
                <h2 className="text-3xl font-bold mb-2 line-clamp-2">{pizza.name}</h2>
                <p className="mb-3 text-lg text-gray-400 line-clamp-2 flex-grow">
                  {pizza.ingridients.join(", ")}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <h2 className="text-2xl">от <span className="font-bold">{pizza.price} ₽</span></h2>
                  <button className="flex items-center justify-center text-orange-500 rounded-2xl px-6 py-4 text-lg bg-orange-50 font-semibold cursor-pointer">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="25" 
                      height="25" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    <span className="ml-1">Выбрать</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPizza && (
        <PizzaDetailsModal
          pizza={selectedPizza}
          initialDough={filters.doughTypes['Тонкое'] ? 'Тонкое' : 'Традиционное'}
          initialSize={filters.selectedSize[0] as '20 см' | '30 см' | '40 см' || '20 см'}
          onClose={() => setSelectedPizza(null)}
        />
      )}
    </div>
    </>
  );
};

export default Home;
