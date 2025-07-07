// src/app/Lives/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getTopBroadcasts } from './api/broadcast';
import BroadcastGrid from './components/BroadcastGrid';
import SkeletonLoader from './components/SkeletonLoader';



export default function LivesPage() {
  const [active, setActive] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchBroadcasts = async (pageNumber = 1) => {
    try {
      const data = await getTopBroadcasts(pageNumber);

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
    }
  };

  useEffect(() => {
    fetchBroadcasts(1); 
  }, []);

  const loadMore = async () => {
    if (!hasNextPage) return;
    setLoadingMore(true);
    try {
      await fetchBroadcasts(page + 1);
    } catch (err) {
      console.error('Failed to load more broadcasts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
            title="Upcoming Matches" 
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loadingMore ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white mr-2"></span>
                  Loading...
                </span>
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