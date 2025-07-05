'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';

type RangeSliderProps = {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onValueChange: (values: [number, number]) => void;
  formatLabel?: (value: number) => string;
};

export const RangeSlider = ({
  min,
  max,
  step,
  value,
  onValueChange,
  formatLabel,
}: RangeSliderProps) => {
  const handleManualChange = (index: number, val: string) => {
    const numeric = parseInt(val.replace(/\D/g, ''), 10);
    if (!isNaN(numeric)) {
      const newValue = [...value] as [number, number];
      newValue[index] = Math.min(Math.max(numeric, min), max);
      onValueChange(newValue);
    }
  };

  return (
    <div className="relative w-full flex-shrink-0 space-y-4">

      {/* 📱 Мобильные input-поля */}
      <div className="flex items-center justify-between gap-4 md:hidden">
        <input
          type="number"
          className=" border w-25 border-gray-300 rounded px-3 py-2 text-lg"
          value={value[0]}
          min={min}
          max={value[1]}
          step={step}
          onChange={(e) => handleManualChange(0, e.target.value)}
        />
        <input
          type="number"
          className=" border w-25 border-gray-300 rounded px-3 py-2 text-lg"
          value={value[1]}
          min={value[0]}
          max={max}
          step={step}
          onChange={(e) => handleManualChange(1, e.target.value)}
        />
      </div>

      {/* 💻 Ползунок (скрыт на мобилках) */}
      <div className="hidden md:block">
        <SliderPrimitive.Root
          className="relative flex w-full touch-none select-none items-center"
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(vals) => onValueChange([vals[0], vals[1]])}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
            <SliderPrimitive.Range className="absolute h-full bg-orange-500" />
          </SliderPrimitive.Track>

          {value.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className="block h-5 w-5 rounded-full border-2 border-orange-500 bg-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          ))}
        </SliderPrimitive.Root>

        <div className="flex justify-between mt-2 text-sm text-gray-700">
          <span>{formatLabel ? formatLabel(value[0]) : value[0]}</span>
          <span>{formatLabel ? formatLabel(value[1]) : value[1]}</span>
        </div>
      </div>
    </div>
  );
};
