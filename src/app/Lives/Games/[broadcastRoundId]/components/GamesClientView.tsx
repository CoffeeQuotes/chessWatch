// src/app/Lives/Games/[broadcastRoundId]/components/GamesClientView.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Flag from "react-world-flags";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle,
  Hourglass,
  X,
} from "lucide-react";

const GameBoard = dynamic(
  () => import("../../../components/GameBoard").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
    ),
  },
);

// Type definitions...
type Player = { name: string; title?: string; rating?: number; fed?: string };
type Game = { id: string; players: Player[]; status: string; fen: string };
type RoundData = {
  round: { name: string; finished: boolean; startsAt?: number };
  tour: { id: string; name: string };
  games: Game[];
};

export default function GamesClientView({
  roundData,
}: {
  roundData: RoundData;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const GAMES_PER_PAGE = 10;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedGame(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredGames = useMemo(() => {
    if (!searchQuery) return roundData.games;
    return roundData.games.filter((game) =>
      game.players.some((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [roundData.games, searchQuery]);

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE,
  );

  const { round, tour } = roundData;
  const isFinished = round.finished;
  const isUpcoming =
    !isFinished && round.startsAt && new Date(round.startsAt) > new Date();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="py-6 space-y-2">
          <Link
            href={`/Lives/${tour.id}`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to {tour.name}
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              {round.name}
            </h1>
            {isFinished && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50 px-3 py-1 rounded-full">
                <CheckCircle size={14} /> Finished
              </span>
            )}
            {isUpcoming && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50 px-3 py-1 rounded-full">
                <Hourglass size={14} /> Upcoming
              </span>
            )}
            {!isFinished && !isUpcoming && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50 px-3 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            )}
          </div>
        </header>

        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Games ({filteredGames.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by player..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-3">
            {paginatedGames.map((game) => (
              <GameItem
                key={game.id}
                game={game}
                onGameSelect={setSelectedGame}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute -top-2 -right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <GameBoard
              key={selectedGame.id + selectedGame.fen}
              fen={selectedGame.fen}
              whitePlayer={selectedGame.players[0]}
              blackPlayer={selectedGame.players[1]}
              status={selectedGame.status}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Helper components remain here as they are part of the client view
function GameItem({
  game,
  onGameSelect,
}: {
  game: Game;
  onGameSelect: (game: Game) => void;
}) {
  const [white, black] = game.players;
  return (
    <button
      onClick={() => onGameSelect(game)}
      className="w-full text-left p-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
    >
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div className="space-y-2">
          {" "}
          <PlayerInfo player={white} isWinner={game.status === "1-0"} />{" "}
          <PlayerInfo player={black} isWinner={game.status === "0-1"} />{" "}
        </div>{" "}
        <div className="text-right flex items-center gap-4">
          {" "}
          <span className="font-mono text-sm font-bold w-12 text-center text-slate-700 dark:text-slate-300">
            {game.status}
          </span>{" "}
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />{" "}
        </div>{" "}
      </div>{" "}
    </button>
  );
}

const PlayerInfo = ({
  player,
  isWinner,
}: {
  player: Player;
  isWinner: boolean;
}) => (
  <div className="flex items-center gap-3">
    {" "}
    <Trophy
      className={`w-4 h-4 flex-shrink-0 ${isWinner ? "text-amber-500" : "text-transparent"}`}
    />{" "}
    <Flag className="w-5 h-5 flex-shrink-0" code={player.fed} />
    <p
      className={`font-medium truncate ${isWinner ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
      title={player.name}
    >
      {" "}
      <span className="text-xs text-slate-400 mr-1.5">{player.title}</span>
      {player.name}{" "}
    </p>{" "}
    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
      {player.rating || "N/A"}
    </span>{" "}
  </div>
);

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
      {" "}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} /> Previous
      </button>{" "}
      <span className="text-sm text-slate-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>{" "}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={16} />
      </button>{" "}
    </div>
  );
}
