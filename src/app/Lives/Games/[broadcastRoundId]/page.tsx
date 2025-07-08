'use client'; 

import { getBroadcastRound } from '../../api/broadcast';
import Link from 'next/link';
import React, { useState, useMemo, useEffect, use } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trophy,
  ExternalLink,
  CheckCircle,
  Hourglass,
  AlertTriangle,
} from 'lucide-react';

// Define types for our data for excellent TypeScript support
type Player = { name: string; title?: string; rating?: number };
type Game = { id: string; players: Player[]; status: string };
// Awaited<T> is a utility type to get the resolved type of a Promise
type RoundData = Awaited<ReturnType<typeof getBroadcastRound>> | null;

//==============================================================================
// 1. HELPER COMPONENTS
//==============================================================================

// A dedicated component for showing error states.
function ErrorState({ message, subMessage }: { message: string; subMessage: string; }) {
  return (
    <div className="max-w-4xl mx-auto text-center py-20 flex flex-col items-center gap-4">
        <AlertTriangle className="w-16 h-16 text-amber-500" />
        <div>
            <h1 className="text-3xl font-bold">{message}</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
                {subMessage}
            </p>
        </div>
        <Link href="/Lives" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700">
          Back to all broadcasts
        </Link>
    </div>
  );
}

// A dedicated component for the loading skeleton.
function LoadingState() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
            <header className="py-6 space-y-3">
                <div className="h-5 w-1/4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                </div>
            </header>
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-10 w-64 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 rounded-lg bg-white dark:bg-slate-800/50"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}


// The UI for displaying a single game. This doesn't need state.
function GameItem({ game }: { game: Game }) {
  const [white, black] = game.players;
  const gameUrl = `https://lichess.org/broadcast/-/-/${game.id}`;

  const renderPlayer = (player: Player, isWinner: boolean) => (
    <div className="flex items-center gap-3">
      <Trophy className={`w-4 h-4 flex-shrink-0 ${isWinner ? 'text-amber-500' : 'text-transparent'}`} />
      <p className={`font-medium ${isWinner ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
        <span className="text-xs text-slate-400 mr-1.5">{player.title}</span>
        {player.name}
      </p>
      <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{player.rating || 'N/A'}</span>
    </div>
  );

  return (
    <a
      href={gameUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {renderPlayer(white, game.status === '1-0')}
          {renderPlayer(black, game.status === '0-1')}
        </div>
        <div className="text-right flex items-center gap-4">
            <span className="font-mono text-sm font-bold w-12 text-center text-slate-700 dark:text-slate-300">{game.status}</span>
            <ExternalLink className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </a>
  );
}

//==============================================================================
// 2. MAIN COMPONENT: Manages state, fetching, and interactivity.
//==============================================================================
export default function BroadcastRoundPage({
  params,
}: {
  params: { broadcastRoundId: string };
}) {

  const cleanParams = use(params);
  const { broadcastRoundId } = cleanParams;

  const [roundData, setRoundData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const GAMES_PER_PAGE = 10;
  
  // Fetch data inside useEffect because this is now a full Client Component
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getBroadcastRound(broadcastRoundId);
            setRoundData(data);
        } catch (err) {
            console.error("API Error in BroadcastRoundPage:", err);
            setError("The Lichess API is currently unavailable or the round could not be found. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [broadcastRoundId]);

  // Memoize filtering to avoid re-calculating on every render
  const filteredGames = useMemo(() => {
    if (!roundData?.games) return [];
    if (!searchQuery) return roundData.games;
    return roundData.games.filter((game) =>
      game.players.some((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [roundData?.games, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // --- RENDER LOGIC ---
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState message="Could Not Fetch Round" subMessage={error} />;
  }
  
  if (!roundData) {
    return <ErrorState message="Round Not Found" subMessage="The round you are looking for might not exist." />;
  }

  const { round, tour } = roundData;
  const isFinished = round.finished;
  const isUpcoming = !isFinished && round.startsAt && new Date(round.startsAt) > new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header / Hero Section */}
      <header className="py-6 space-y-2">
        <Link href={`/Lives/${tour.id}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← Back to {tour.name}
        </Link>
        <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{round.name}</h1>
            {isFinished && <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50 px-3 py-1 rounded-full"><CheckCircle size={14} /> Finished</span>}
            {isUpcoming && <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50 px-3 py-1 rounded-full"><Hourglass size={14} /> Upcoming</span>}
            {!isFinished && !isUpcoming && <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50 px-3 py-1 rounded-full animate-pulse">LIVE</span>}
        </div>
      </header>
      
      {/* Games List Section */}
      <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Games ({filteredGames.length})</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by player..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {paginatedGames.length > 0 ? (
            paginatedGames.map((game) => <GameItem key={game.id} game={game} />)
          ) : (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">No games match your search.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}