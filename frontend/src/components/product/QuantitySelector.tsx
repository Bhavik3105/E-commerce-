'use client';

import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  maxQuantity,
  onChange,
}: QuantitySelectorProps) {
  const isMinDisabled = quantity <= 1;
  const isMaxDisabled = quantity >= maxQuantity;

  return (
    <div>
      <span className="block text-sm font-medium text-stone-700 mb-2">
        Quantity
      </span>
      <div className="inline-flex items-center border border-stone-300 rounded-lg overflow-hidden">
        <button
          type="button"
          disabled={isMinDisabled}
          onClick={() => onChange(quantity - 1)}
          aria-label="Decrease quantity"
          className={cn(
            'w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors',
            isMinDisabled
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-600 hover:bg-stone-100 active:bg-stone-200'
          )}
        >
          −
        </button>

        <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-stone-800 border-x border-stone-300 select-none">
          {quantity}
        </span>

        <button
          type="button"
          disabled={isMaxDisabled}
          onClick={() => onChange(quantity + 1)}
          aria-label="Increase quantity"
          className={cn(
            'w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors',
            isMaxDisabled
              ? 'text-stone-300 cursor-not-allowed'
              : 'text-stone-600 hover:bg-stone-100 active:bg-stone-200'
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantitySelector;
