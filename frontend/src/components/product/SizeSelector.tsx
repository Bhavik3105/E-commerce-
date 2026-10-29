'use client';

import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  disabledSizes?: string[];
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  disabledSizes = [],
}: SizeSelectorProps) {
  return (
    <div>
      <span className="block text-sm font-medium text-stone-700 mb-2">
        Select Size
      </span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isDisabled = disabledSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(size)}
              aria-pressed={isSelected}
              className={cn(
                'min-w-[3rem] px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200',
                isSelected &&
                  'bg-amber-700 text-white border-amber-700',
                !isSelected &&
                  !isDisabled &&
                  'bg-white text-stone-700 border-stone-300 hover:border-amber-700 hover:text-amber-800',
                isDisabled &&
                  'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed line-through'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SizeSelector;
