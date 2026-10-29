'use client';

import { cn } from '@/lib/utils';

interface ColourOption {
  colour: string;
  colourHex: string;
}

interface ColourSelectorProps {
  colours: ColourOption[];
  selectedColour: string | null;
  onSelect: (colour: string) => void;
  disabledColours?: string[];
}

/**
 * Check if a hex colour is very light (close to white) so we can add a visible border.
 */
function isLightColour(hex: string): boolean {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 220;
}

export function ColourSelector({
  colours,
  selectedColour,
  onSelect,
  disabledColours = [],
}: ColourSelectorProps) {
  const selected = colours.find((c) => c.colour === selectedColour);

  return (
    <div>
      <span className="block text-sm font-medium text-stone-700 mb-2">
        Select Colour
      </span>

      <div className="flex flex-wrap items-center gap-3">
        {colours.map(({ colour, colourHex }) => {
          const isDisabled = disabledColours.includes(colour);
          const isSelected = selectedColour === colour;
          const light = isLightColour(colourHex);

          return (
            <button
              key={colour}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(colour)}
              aria-label={`${colour}${isDisabled ? ' (out of stock)' : ''}`}
              aria-pressed={isSelected}
              className={cn(
                'relative w-8 h-8 rounded-full transition-all duration-200',
                isSelected && 'ring-2 ring-amber-700 ring-offset-2',
                light && !isSelected && 'ring-1 ring-stone-300',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
              style={{ backgroundColor: colourHex }}
            >
              {/* X overlay for disabled/out-of-stock colours */}
              {isDisabled && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-stone-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  >
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected colour name */}
      {selected && (
        <p className="text-xs text-stone-500 mt-2">{selected.colour}</p>
      )}
    </div>
  );
}

export default ColourSelector;
