'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}

export function AddToCartButton({
  disabled = false,
  onClick,
  label = 'Add to Cart',
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (disabled || added) return;
    onClick();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'w-full py-3 px-6 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200',
        disabled
          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
          : added
            ? 'bg-green-600 text-white'
            : 'bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.98]'
      )}
    >
      {disabled ? 'Select options' : added ? '✓ Added!' : label}
    </button>
  );
}

export default AddToCartButton;
