// src/components/BroadcastGrid.tsx
'use client';

import BroadcastCard from './BroadcastCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function BroadcastGrid({ 
  broadcasts, 
  title, 
  isCarousel = false 
}: { 
  broadcasts: any[]; 
  title: string;
  isCarousel?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [canScroll, setCanScroll] = useState({
    left: false,
    right: false
  });

  // Update scroll position and control visibility
  const updateScrollState = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setScrollPosition(scrollLeft);
    setCanScroll({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth
    });
  };

  // Initialize and update scroll state
  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [broadcasts]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!broadcasts || broadcasts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-blue-50/50 dark:bg-neutral-800/50 rounded-2xl">
        <div className="text-3xl mb-2">♟️</div>
        <p>No {title.toLowerCase()} available right now.</p>
        <p className="text-sm mt-1">Check back later for upcoming matches</p>
      </div>
    );
  }

  return (
    <section 
      className="mb-10 relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          {title}
        </h2>
        
        {isCarousel && broadcasts.length > 3 && (
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScroll.left}
              className={`p-2 rounded-full transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              } ${
                canScroll.left 
                  ? 'bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-neutral-700 dark:hover:bg-neutral-600' 
                  : 'bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScroll.right}
              className={`p-2 rounded-full transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              } ${
                canScroll.right 
                  ? 'bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-neutral-700 dark:hover:bg-neutral-600' 
                  : 'bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={updateScrollState}
        className={`relative ${
          isCarousel 
            ? 'flex overflow-x-auto pb-4 gap-5 scrollbar-hide snap-x snap-mandatory' 
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {broadcasts.map((item, i) => (
          <div 
            key={i} 
            className={isCarousel ? 'min-w-[300px] max-w-[350px] flex-shrink-0 snap-start' : ''}
          >
            <BroadcastCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}