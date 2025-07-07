'use client';

import { useState } from 'react';
import Image from './ChessImage';
import Link from 'next/link'; // --- CHANGE 1: Import the Link component ---

// Icons remain the same
const Icon = ({ path, className }: { path: string; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-5 h-5 ${className}`}
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);
const CrownIcon = () => <Icon className="text-slate-500" path="M10 2a.75.75 0 01.684.445l1.928 4.242a.75.75 0 00.56.41l4.676.334a.75.75 0 01.417 1.28l-3.52 3.01a.75.75 0 00-.224.64l1.04 4.544a.75.75 0 01-1.11.822L10.37 15.3a.75.75 0 00-.74 0l-4.12 2.45a.75.75 0 01-1.11-.822l1.04-4.543a.75.75 0 00-.224-.64l-3.52-3.01a.75.75 0 01.417-1.28l4.676-.334a.75.75 0 00.56-.41L9.316 2.445A.75.75 0 0110 2z" />;
const ArrowRightIcon = () => <Icon className="group-hover:translate-x-0.5 transition-transform" path="M9.22 4.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L12.94 10 9.22 6.28a.75.75 0 010-1.06z" />;

export default function BroadcastCard({ item }: { item: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.tour.image || "/chess-fallback.png");

  const { tour, round } = item;
  const playersDisplay = (tour.info?.players || 'Top Players').split(/[,;]/).map(p => p.trim()).join(', ');

  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={tour.name}
          fill
          sizes="340px"
          className={`object-cover transition-transform duration-500 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
          onError={() => setImgSrc("/chess-fallback.png")}
          unoptimized={imgSrc.startsWith("https://image.lichess1.org")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="space-y-1">
          <span className="text-xs font-medium text-blue-500 dark:text-blue-400">{round.name}</span>
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 truncate" title={item.group || tour.name}>
            {item.group || tour.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
            {tour.info?.format || 'High-level chess competition'}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-3 text-slate-500 dark:text-slate-400">
          <CrownIcon />
          <p className="text-sm truncate" title={playersDisplay}>
            {playersDisplay}
          </p>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {new Date(round.startsAt).toLocaleDateString()}
          </span>
          {/* --- CHANGE 2: Replace `<a>` with `<Link>` and update the href --- */}
          <Link
            href={`/Lives/${item.tour.id}`}
            className="group inline-flex items-center justify-center gap-1.5 text-sm font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
          >
            Watch
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}