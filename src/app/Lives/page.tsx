// src/app/Lives/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getTopBroadcasts } from './api/broadcast';
import BroadcastGrid from './components/BroadcastGrid';
import SkeletonLoader from './components/SkeletonLoader';

// ✅ Define proper types for API structure
interface BroadcastTourInfo {
  format: string;
  tc: string;
  fideTc: string;
  location: string;
  timeZone: string;
  players?: string;
  website?: string;
  standings?: string;
}

interface BroadcastTour {
  id: string;
  name: string;
  slug: string;
  info: BroadcastTourInfo;
  createdAt: number;
  url: string;
  tier: number;
  dates: number[];
  image: string;
  teamTable?: boolean;
}

interface BroadcastRound {
  id: string;
  name: string;
  slug: string;
  createdAt: number;
  rated: boolean;
  startsAt: number;
  finishedAt?: number;
  finished?: boolean;
  url?: string;
}

interface BroadcastItem {
  tour: BroadcastTour;
  round: BroadcastRound;
  roundToLink?: BroadcastRound;
  group?: string;
}

interface PastBroadcastItem {
  tour: BroadcastTour;
  round: BroadcastRound;
  group?: string;
}

interface BroadcastsApiResponse {
  active: BroadcastItem[];
  upcoming: BroadcastItem[];
  past: {
    currentPage: number;
    maxPerPage: number;
    currentPageResults: PastBroadcastItem[];
    previousPage: number | null;
    nextPage: number | null;
  };
}

export default function LivesPage() {
  const [active, setActive] = useState<BroadcastItem[]>([]);
  const [upcoming, setUpcoming] = useState<BroadcastItem[]>([]);
  const [past, setPast] = useState<PastBroadcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchBroadcasts = async (pageNumber = 1) => {
    setLoading(pageNumber === 1);
    setLoadingMore(pageNumber > 1);

    try {
      const data: BroadcastsApiResponse = await getTopBroadcasts(pageNumber);
      const activeData = data?.active || [];
      const upcomingData = data?.upcoming || [];
      const pastData = data?.past?.currentPageResults || [];

      if (pageNumber === 1) {
        setActive(activeData);
        setUpcoming(upcomingData);
        setPast(pastData);
      } else {
        setPast((prev) => [...prev, ...pastData]);
      }
      setHasNextPage(!!data?.past?.nextPage);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching broadcasts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts(1); 
  }, []);

  const loadMore = () => {
    if (!hasNextPage || loadingMore) return;
    fetchBroadcasts(page + 1);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {!!active.length && (
          <BroadcastGrid 
            broadcasts={active} 
            title="Live Now" 
            isCarousel={true} 
          />
        )}

        {!!upcoming.length && (
          <BroadcastGrid 
            broadcasts={upcoming} 
            title="Upcoming" 
            isCarousel={true} 
          />
        )}

        {!!past.length && (
          <BroadcastGrid 
            broadcasts={past} 
            title="Past Broadcasts" 
          />
        )}

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center justify-center text-sm font-semibold bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed dark:disabled:bg-blue-800 transition-colors"
            >
              {loadingMore ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
