// src/components/BroadcastCard.tsx
'use client';

import { useState } from 'react';
import Image from './ChessImage'

export default function BroadcastCard({ item }: { item: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.tour.image || "/chess-fallback.png");
  
  return (
    <div 
      className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-900 border border-blue-100 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.tour.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } object-cover`}
          onError={() => setImgSrc("/chess-fallback.png")}
          unoptimized={imgSrc.startsWith("https://image.lichess1.org")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex justify-between items-center">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {item.round.type || 'Tournament'}
            </span>
            {item.status === 'live' && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-neutral-800 dark:text-white truncate">
            {item.tour.name}
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.round.time || 'Ongoing'}
          </span>
        </div>
        
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2">
          {item.round.description || 'High-level chess competition with grandmasters'}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center mr-2">
              <span className="text-xs">♛</span>
            </div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {item.players || 'Grandmasters'}
            </span>
          </div>
          
          <a 
            href={item.round.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full hover:shadow-md transition-shadow"
          >
            Watch
          </a>
        </div>
      </div>
    </div>
  );
}