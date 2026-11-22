'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { ProductImageGallery } from './ProductImageGallery';
import { SizeSelector } from './SizeSelector';
import { ColourSelector } from './ColourSelector';
import { QuantitySelector } from './QuantitySelector';
import { AddToCartButton } from './AddToCartButton';
import { getProductColours, getProductSizes, findVariant } from '@/data/products';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();

  // Extract unique colours and sizes
  const uniqueColours = getProductColours(product).map((v) => ({
    colour: v.colour,
    colourHex: v.colourHex,
  }));

  const [selectedColour, setSelectedColour] = useState<string | null>(
    uniqueColours[0]?.colour || null
  );

  // Available sizes for selected colour
  const availableSizesForColour = getProductSizes(
    product,
    selectedColour || undefined
  ).map((v) => v.size);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizesForColour[0] || null
  );

  const [quantity, setQuantity] = useState<number>(1);

  // Find selected variant
  const currentVariant =
    selectedSize && selectedColour
      ? findVariant(product, selectedSize, selectedColour)
      : undefined;

  const currentStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = !currentVariant || currentStock <= 0;

  // Disabled sizes (where stock is 0 for the selected colour)
  const disabledSizes = availableSizesForColour.filter((s) => {
    if (!selectedColour) return false;
    const v = findVariant(product, s, selectedColour);
    return !v || v.stock <= 0;
  });

  const activePrice = product.salePrice || product.price;
  const discountPercent = product.salePrice
    ? getDiscountPercent(product.price, product.salePrice)
    : 0;

  const handleAddToCart = () => {
    if (!currentVariant || !selectedSize || !selectedColour || isOutOfStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0]?.url || '',
      size: selectedSize,
      colour: selectedColour,
      colourHex: currentVariant.colourHex,
      price: activePrice,
      quantity,
      maxStock: currentStock,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      {/* ─── Product Image Gallery ─── */}
      <div>
        <ProductImageGallery images={product.images} />
      </div>

      {/* ─── Product Purchase Form ─── */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {formatPrice(activePrice)}
            </span>
            {product.salePrice && (
              <>
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1">Inclusive of all taxes. Free shipping on orders &gt; ₹999</p>
        </div>

        <div className="border-t border-b border-neutral-200 py-6 space-y-6">
          {/* Colour Selector */}
          {uniqueColours.length > 0 && (
            <div>
              <ColourSelector
                colours={uniqueColours}
                selectedColour={selectedColour}
                onSelect={(col) => {
                  setSelectedColour(col);
                  // Reset size if current size isn't available in new colour
                  const newSizes = getProductSizes(product, col).map((v) => v.size);
                  if (selectedSize && !newSizes.includes(selectedSize)) {
                    setSelectedSize(newSizes[0] || null);
                  }
                }}
              />
            </div>
          )}

          {/* Size Selector */}
          {availableSizesForColour.length > 0 && (
            <div>
              <SizeSelector
                sizes={availableSizesForColour}
                selectedSize={selectedSize}
                onSelect={(sz) => setSelectedSize(sz)}
                disabledSizes={disabledSizes}
              />
            </div>
          )}

          {/* Stock & Quantity */}
          <div className="flex flex-wrap items-center gap-6">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={Math.max(1, currentStock)}
              onChange={setQuantity}
            />

            <div className="pt-5">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  Out of Stock
                </span>
              ) : currentStock < 5 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  Only {currentStock} left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  In Stock ({currentStock} available)
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div>
            <AddToCartButton
              disabled={isOutOfStock || !selectedSize || !selectedColour}
              onClick={handleAddToCart}
            />
          </div>
        </div>

        {/* Product Details & Fabric Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Description</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="font-semibold text-neutral-900 block mb-1">Fabric & Care</span>
              <p className="text-neutral-600">100% Breathable Combed Cotton. Machine wash cold with like colours.</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <span className="font-semibold text-neutral-900 block mb-1">Delivery Time</span>
              <p className="text-neutral-600">Dispatched within 24-48 hours via local courier. 3-5 business days delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

