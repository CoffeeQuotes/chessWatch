'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTopBroadcasts } from '@/app/Lives/api/broadcast';
import SkeletonLoader from '@/app/Lives/components/SkeletonLoader';

export default function HeroHighlight() {
  const [topBroadcast, setTopBroadcast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop() {
      try {
        const data = await getTopBroadcasts(1);
        if (data && data.active && data.active.length > 0) {
          setTopBroadcast(data.active[0]);
        }
      } catch (error) {
        console.error("Failed to fetch top broadcast for hero", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl max-h-[400px] bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-2xl p-8 flex items-center justify-center border border-white/10 mt-12 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-6 w-48 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!topBroadcast) return null;

  const { tour, round } = topBroadcast;
  const imgSrc = tour.image || "/chess-fallback.png";

  return (
    <div className="w-full max-w-5xl mt-12 group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-blue-500/50">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
           <Image
            src={imgSrc}
            alt={tour.name}
            fill
            className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105"
            unoptimized={imgSrc.startsWith("https://image.lichess1.org")}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between p-8 md:p-12 gap-8 h-full min-h-[300px]">
        
        {/* Match Info */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-500 font-bold uppercase tracking-wider text-sm">Live Now</span>
            <span className="text-slate-400 text-sm px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {round.name}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md tracking-tight">
            {topBroadcast.group || tour.name}
          </h2>
          
          <p className="text-slate-300 text-lg line-clamp-2 md:line-clamp-none max-w-xl">
            {tour.info?.players ? tour.info.players : (tour.info?.format || 'High-level chess competition')}
          </p>
        </div>

        {/* CTA */}
        <div className="w-full md:w-auto flex-shrink-0">
          <Link
            href={`/Lives/${tour.id}`}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)] group-hover:-translate-y-1"
          >
            Watch Game
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play ml-1"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
