'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface SlideData {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  titleSuffix?: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export const defaultSlides: SlideData[] = [
  {
    id: 'slide-1',
    badge: 'New Season Arrivals',
    title: 'Wear Your ',
    highlight: 'Elegance',
    titleSuffix: ' Every Day.',
    description:
      'Soft cotton tees with an easy fit, made to be worn on repeat.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop',
    imageAlt: 'Women’s t-shirt collection',
    primaryCta: {
      label: 'Shop T-Shirts',
      href: '/category/tshirts',
    },
    secondaryCta: {
      label: 'Explore Collection',
      href: '/products',
    },
  },
  {
    id: 'slide-2',
    badge: 'Sleep Comfortably',
    title: 'Soft Cotton ',
    highlight: 'Nightsuits',
    titleSuffix: '.',
    description:
      'Two-piece cotton sets for sleep and quiet evenings at home.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1600&h=900&fit=crop',
    imageAlt: 'Women’s nightsuit collection',
    primaryCta: {
      label: 'Shop Nightsuits',
      href: '/category/nightsuits',
    },
    secondaryCta: {
      label: 'Shop All',
      href: '/products',
    },
  },
  {
    id: 'slide-3',
    badge: 'Everyday Essentials',
    title: 'Cotton ',
    highlight: 'Undergarments',
    titleSuffix: '.',
    description:
      'Camisoles and briefs in soft cotton, made for daily comfort.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop',
    imageAlt: 'Cotton essentials collection',
    primaryCta: {
      label: 'Shop Undergarments',
      href: '/category/undergarments',
    },
    secondaryCta: {
      label: 'Shop All',
      href: '/products',
    },
  },
];

interface HeroSliderProps {
  slides?: SlideData[];
  autoPlayInterval?: number; // in milliseconds
}

export function HeroSlider({
  slides = defaultSlides,
  autoPlayInterval = 5000,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      goToPrev(); // Swiped right -> prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative bg-neutral-900 text-white min-h-[520px] sm:min-h-[580px] md:min-h-[620px] flex items-center overflow-hidden select-none"
      aria-label="Featured Collections Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── Background Slides ─── */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover opacity-35 mix-blend-overlay scale-105 transition-transform duration-[6000ms] ease-out"
              style={{
                transform: isActive ? 'scale(1.0)' : 'scale(1.08)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/65 to-transparent" />
          </div>
        );
      })}

      {/* ─── Content Container ─── */}
      <div className="container relative z-20 py-16 md:py-24">
        <div className="max-w-xl space-y-6">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            if (!isActive) return null;

            return (
              <div
                key={slide.id}
                className="space-y-6 animate-fadeIn"
              >
                <div>
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary-500/20 text-primary-300 border border-primary-500/30 backdrop-blur-sm">
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
                  {slide.title}
                  <span className="text-primary-400">{slide.highlight}</span>
                  {slide.titleSuffix}
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-normal leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={slide.primaryCta.href}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-all shadow-lg shadow-primary-950/30"
                  >
                    {slide.primaryCta.label}
                  </Link>
                  <Link
                    href={slide.secondaryCta.href}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Slider Indicators / Dot Navigation ─── */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2.5">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.badge}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-8 bg-primary-500 shadow-sm shadow-primary-500/50'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

