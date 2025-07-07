// src/components/BroadcastGrid.tsx
'use client';

import BroadcastCard from './BroadcastCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

const EmptyStateIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function BroadcastGrid({
  broadcasts,
  title,
  isCarousel = false,
}: {
  broadcasts: any[];
  title: string;
  isCarousel?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const tolerance = 1;
    setCanScroll({
      left: scrollLeft > tolerance,
      right: scrollLeft < scrollWidth - clientWidth - tolerance,
    });
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(scrollContainer);
    scrollContainer.addEventListener('scroll', updateScrollState, { passive: true });
    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener('scroll', updateScrollState);
    };
  }, [broadcasts, updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.9;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!broadcasts || broadcasts.length === 0) {
    return (
      // CHANGE: Updated empty state to match dark theme
      <div className="flex flex-col items-center justify-center gap-4 text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <EmptyStateIcon className="w-16 h-16 text-slate-400 dark:text-slate-600" />
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            No {title.toLowerCase()} available
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Check back later for upcoming matches.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative group py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        <div
          ref={scrollRef}
          className={`
            ${isCarousel
              ? 'flex overflow-x-auto pb-4 -mb-4 gap-5 scrollbar-hide snap-x snap-mandatory'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            }
          `}
        >
          {broadcasts.map((item, i) => (
            // FIX: Replaced min/max-width with a fixed width and flex-none for consistency.
            <div
              key={i}
              className={isCarousel ? 'w-[340px] flex-none snap-start' : ''}
            >
              <BroadcastCard item={item} />
            </div>
          ))}
        </div>

        {/* Carousel Controls: Updated colors to fit dark theme */}
        {isCarousel && (
          <>
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className={`absolute top-1/2 left-0 -translate-x-4 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center
                          bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full shadow-lg
                          text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900
                          transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-5
                          ${canScroll.left ? 'opacity-0' : 'opacity-0 pointer-events-none'}`}
              style={{ opacity: canScroll.left ? undefined : 0, transform: canScroll.left ? undefined : 'translateX(-100%)', pointerEvents: canScroll.left ? 'auto' : 'none' }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className={`absolute top-1/2 right-0 translate-x-4 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center
                          bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full shadow-lg
                          text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900
                          transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-5
                          ${canScroll.right ? 'opacity-0' : 'opacity-0 pointer-events-none'}`}
              style={{ opacity: canScroll.right ? undefined : 0, transform: canScroll.right ? undefined : 'translateX(100%)', pointerEvents: canScroll.right ? 'auto' : 'none' }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}