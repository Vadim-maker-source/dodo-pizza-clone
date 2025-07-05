import { useEffect, useState } from 'react';
import type { Filters } from '../_root/pages/Home';
import { RangeSlider } from './RangeSlider';

type SortingProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const Sorting = ({ filters, setFilters }: SortingProps) => {
  const { doughTypes, selectedSize, priceRange, ingredients } = filters;

  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const toggleCheckbox = (category: 'doughTypes' | 'ingredients', key: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      },
    }));
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSize: prev.selectedSize.includes(size)
        ? prev.selectedSize.filter((s) => s !== size)
        : [...prev.selectedSize, size],
    }));
  };

  useEffect(() => {
    console.log('Фильтры обновлены:', filters);
  }, [filters]);

  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-md mt-3 mx-auto overflow-visible relative z-10">

      {/* Заголовок с кнопкой на мобильных устройствах */}
      <div className="md:hidden mb-6 flex items-center justify-between">
        <button
          onClick={toggleOpen}
          className="text-3xl font-bold"
        >
          {open ? 'Фильтрация' : 'Фильтрация'}
        </button>
      </div>

      {/* Заголовок на md+ устройствах */}
      <h2 className="hidden md:block text-3xl font-bold mb-8">Фильтрация</h2>

      {/* Контент фильтрации */}
      <div className={`${open ? 'block' : 'hidden'} md:block w-full`}>

        {/* Тип теста */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Тип теста</h3>
          <div className="space-y-3">
            {Object.entries(doughTypes).map(([type, checked]) => (
              <label key={type} className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheckbox('doughTypes', type)}
                    className="appearance-none h-8 w-8 bg-gray-100 rounded-xl checked:bg-orange-500 transition duration-200"
                  />
                  {checked && (
                    <svg
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[18px] text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Размеры */}
        <div className="mb-10 w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Размеры</h3>
          <div className="flex space-x-4">
            {['20 см', '30 см', '40 см'].map((size) => (
              <button
                key={size}
                role="checkbox"
                onClick={() => handleSizeChange(size)}
                className={`py-3 px-5 rounded-lg border-2 text-lg font-medium ${
                  selectedSize.includes(size)
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Цена */}
        <div className="mb-10 flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 break-normal">Цена от и до:</h3>
          <div className="lg:flex items-center justify-between mb-6 hidden md:block">
            <div className="bg-gray-100 px-4 py-2 rounded text-lg block">{priceRange[0]} ₽</div>
            <div className="bg-gray-100 px-4 py-2 rounded text-lg block">{priceRange[1]} ₽</div>
          </div>
          <RangeSlider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={(vals) => setFilters((prev) => ({ ...prev, priceRange: vals }))}
            formatLabel={(v) => `${v} ₽`}
          />
        </div>

        {/* Ингредиенты */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ингредиенты</h3>
          <div className="space-y-3">
            {Object.entries(ingredients).map(([name, checked]) => (
              <label key={name} className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheckbox('ingredients', name)}
                    className="appearance-none h-8 w-8 bg-gray-100 rounded-xl checked:bg-orange-500 transition duration-200"
                  />
                  {checked && (
                    <svg
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[18px] text-gray-700">{name}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sorting;
