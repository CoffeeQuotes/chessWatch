// src/app/Lives/components/GameBoard.tsx
"use client";

import {
  Trophy,
  Expand,
  Shrink,
  Calculator,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import React from "react";
import Flag from "react-world-flags";
import dynamic from "next/dynamic";
const Chessboard = dynamic(() => import("react-chessboard").then((mod) => mod.Chessboard), { ssr: false });
import { Chess } from "chess.js";
import { useEngine } from "./useEngine";

// --- Type definitions ---
type Player = {
  name: string;
  title?: string;
  fed: string;
  rating?: number;
};

type GameBoardProps = {
  fen: string;
  pgn?: string | null;
  whitePlayer: Player;
  blackPlayer: Player;
  status: string;
};

type CustomTheme = {
  name: string;
  dark: string;
  light: string;
};

export const BOARD_THEMES: CustomTheme[] = [
  { name: "Premium Green", dark: "#739552", light: "#ebecd0" },
  { name: "Classic Wood", dark: "#b58863", light: "#f0d9b5" },
  { name: "Midnight Blue", dark: "#4b7399", light: "#eae9d2" },
  { name: "Sleek Dark", dark: "#505359", light: "#9a9ca1" },
];

// ─────────────────────────────────────────────────────────────
// PlayerCard
// ─────────────────────────────────────────────────────────────
const PlayerCard = ({
  player,
  isWinner,
  isWhite,
}: {
  player: Player;
  isWinner: boolean;
  isWhite: boolean;
}) => (
  <div
    className={`relative flex items-center justify-between p-3 rounded-xl border ${
      isWhite
        ? "bg-white/10 border-white/20"
        : "bg-black/30 border-black/40"
    } backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-blue-500/50 group`}
  >
    {isWinner && (
      <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    )}
    <div className="flex items-center gap-3 z-10 w-full">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-lg">
          <Flag className="w-full h-full object-cover" code={player.fed} />
        </div>
        <div
          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1e293b] ${
            isWhite ? "bg-white" : "bg-[#1a1a1a]"
          }`}
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {player.title && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
              {player.title}
            </span>
          )}
          <h3
            className="font-bold text-base text-white truncate"
            title={player.name}
          >
            {player.name}
          </h3>
          {isWinner && (
            <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{player.fed}</span>
          {player.rating && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="font-mono">{player.rating}</span>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// EvalBar
// ─────────────────────────────────────────────────────────────
const EvalBar = ({
  score,
  mate,
}: {
  score?: number | null;
  mate?: number | null;
}) => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  let whitePercent = 50;
  if (mate !== null && mate !== undefined) {
    whitePercent = mate > 0 ? 95 : 5;
  } else if (score !== null && score !== undefined) {
    const clamped = Math.max(-10, Math.min(10, score / 100));
    whitePercent = ((clamped + 10) / 20) * 100;
  }

  const display =
    mate !== null && mate !== undefined
      ? `M${Math.abs(mate)}`
      : score !== null && score !== undefined
      ? score > 0
        ? `+${(score / 100).toFixed(1)}`
        : (score / 100).toFixed(1)
      : "0.0";

  return (
    <div className="w-6 sm:w-7 h-full bg-[#1a1a1a] rounded flex flex-col overflow-hidden relative shadow-inner border border-white/10 flex-shrink-0 min-h-[200px]">
      {/* Black portion — top */}
      <div
        className="bg-[#1a1a1a] transition-all duration-700 ease-in-out"
        style={{ height: `${100 - whitePercent}%` }}
      />
      {/* White portion — bottom */}
      <div
        className="bg-[#e4e4e4] transition-all duration-700 ease-in-out"
        style={{ height: `${whitePercent}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[9px] font-mono font-bold text-slate-500 [writing-mode:vertical-rl] rotate-180"
          style={{ lineHeight: "1" }}
        >
          {display}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MoveNavigator — bottom UI bar for stepping through moves
// ─────────────────────────────────────────────────────────────
const MoveNavigator = ({
  currentIndex,
  total,
  onFirst,
  onPrev,
  onNext,
  onLast,
}: {
  currentIndex: number;
  total: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
}) => {
  if (total === 0) return null;
  const btnClass =
    "p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors";
  const atStart = currentIndex <= -1;
  const atEnd = currentIndex >= total - 1;

  return (
    <div className="flex items-center justify-between gap-2 mt-2 px-1">
      <div className="flex items-center gap-1">
        <button onClick={onFirst} disabled={atStart} className={btnClass} title="First move">
          <ChevronsLeft size={16} />
        </button>
        <button onClick={onPrev} disabled={atStart} className={btnClass} title="Previous move">
          <ChevronLeft size={16} />
        </button>
        <button onClick={onNext} disabled={atEnd} className={btnClass} title="Next move">
          <ChevronRight size={16} />
        </button>
        <button onClick={onLast} disabled={atEnd} className={btnClass} title="Last move">
          <ChevronsRight size={16} />
        </button>
      </div>
      <span className="text-xs text-slate-400 font-mono">
        {currentIndex === -1 ? "Start" : `Move ${currentIndex + 1} / ${total}`}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ChessBoardWrapper — handles game state and board display
// ─────────────────────────────────────────────────────────────
const ChessBoardWrapper = ({
  fen,
  pgn,
  theme,
  onPositionChange,
}: {
  fen: string;
  pgn?: string | null;
  theme: CustomTheme;
  onPositionChange?: (fen: string) => void;
}) => {
  // positions[0] = start FEN, positions[1..n] = after each move (only when PGN loaded)
  // For FEN-only mode: positions = [fen], currentIndex = 0 → shows the actual position
  // Synchronously parse PGN so the first render has the correct position
  const { initialPositions, initialIndex } = useMemo(() => {
    let pos: string[] = [];
    let idx = -1;

    if (pgn && pgn.trim()) {
      try {
        const cleanPgn = pgn
          .replace(/\{[^}]*\}/g, "")
          .replace(/\$\d+/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const game = new Chess();
        game.loadPgn(cleanPgn);
        const history = game.history(); // Get array of raw SAN strings (e.g. 'e4', 'Nf3') instead of verbose objects
        
        if (history.length > 0) {
          const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
          pos = [startFen];
          const temp = new Chess();
          for (const move of history) {
            const moveResult = temp.move(move);
            if (!moveResult) {
               console.warn("[GameBoard] Failed to parse historic move:", move);
            }
            pos.push(temp.fen());
          }
          idx = pos.length - 1;
        }
      } catch (e) {
        console.error("PGN parse error:", e);
      }
    }

    if (pos.length === 0 && fen && fen !== "start") {
      try {
        const g = new Chess();
        g.load(fen);
        pos = [g.fen()];
        idx = 0;
      } catch {}
    }

    return { initialPositions: pos, initialIndex: idx };
  }, [pgn, fen]);

  // Initialize state directly from the synchronously calculated initial values
  const [positions, setPositions] = useState<string[]>(initialPositions);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Sync state aggressively whenever the computed base PGN arrays change
  useEffect(() => {
    setPositions(initialPositions);
    setCurrentIndex(initialIndex);
  }, [initialPositions, initialIndex]);

  // Fallback diagnostic log to see exactly what FEN the board is requesting
  useEffect(() => {
    console.log(`[GameBoard] rendering index ${currentIndex} / ${positions.length - 1}`);
    if (positions.length > 0) {
      console.log(`[GameBoard] FEN at ${currentIndex}: ${positions[currentIndex]}`);
    }
  }, [currentIndex, positions]);

  // Keyboard navigation — only when we have PGN history (positions.length > 1)
  useEffect(() => {
    if (positions.length <= 1) return; // no navigation needed for FEN-only
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentIndex((p) => Math.max(0, p - 1));
      else if (e.key === "ArrowRight")
        setCurrentIndex((p) => Math.min(positions.length - 1, p + 1));
      else if (e.key === "ArrowUp") setCurrentIndex(0);
      else if (e.key === "ArrowDown") setCurrentIndex(positions.length - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [positions.length]);

  const currentFen = useMemo(() => {
    if (positions.length === 0) return fen || "start";
    const idx = Math.max(0, Math.min(currentIndex, positions.length - 1));
    return positions[idx] ?? fen ?? "start";
  }, [positions, currentIndex, fen]);

  const positionObject = useMemo(() => {
    if (!currentFen || currentFen === "start") return "start";
    try {
      const g = new Chess(currentFen);
      const board = g.board();
      if (!board) return "start";
      
      const obj: Record<string, string> = {};
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const sq = board[r][c];
          if (sq) {
            const file = String.fromCharCode(97 + c);
            const rank = 8 - r;
            obj[`${file}${rank}`] = `${sq.color}${sq.type.toUpperCase()}`;
          }
        }
      }
      return obj;
    } catch {
      return "start";
    }
  }, [currentFen]);

  useEffect(() => {
    if (onPositionChange && currentFen && currentFen !== "start") {
      onPositionChange(currentFen);
    }
  }, [currentFen, onPositionChange]);

  function onDrop(from: string, to: string) {
    const copy = new Chess(currentFen === "start" ? undefined : currentFen);
    const move = copy.move({ from, to, promotion: "q" });
    if (!move) return false;

    // Branch the history from current point
    const newPositions = positions.slice(0, currentIndex + 1);
    newPositions.push(copy.fen());
    setPositions(newPositions);
    setCurrentIndex(newPositions.length - 1);
    return true;
  }

  // MoveNavigator props — positions[0] = start (index 0), moves begin at index 1
  const hasPgn = positions.length > 1;
  const totalMoves = hasPgn ? positions.length - 1 : 0;
  // displayMoveIndex: -1 = at start, 0 to totalMoves-1 = after each move
  const displayMoveIndex = hasPgn ? currentIndex - 1 : -1;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const AnyChessboard = Chessboard as any;

  if (!isMounted) {
    return (
      <div className="flex flex-col w-full">
        <div className="w-full aspect-square shadow-2xl rounded-sm border-2 border-[#2b3543] bg-[#2b3543] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full shadow-2xl rounded-sm overflow-hidden border-2 border-[#2b3543] bg-[#2b3543] relative group">
        <AnyChessboard
          position={positionObject}
          onPieceDrop={onDrop}
          customDarkSquareStyle={{ backgroundColor: theme.dark }}
          customLightSquareStyle={{ backgroundColor: theme.light }}
        />
        {hasPgn && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ← → arrow keys to navigate
          </div>
        )}
      </div>
      {hasPgn && (
        <MoveNavigator
          currentIndex={displayMoveIndex}
          total={totalMoves}
          onFirst={() => setCurrentIndex(0)}
          onPrev={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          onNext={() => setCurrentIndex((p) => Math.min(positions.length - 1, p + 1))}
          onLast={() => setCurrentIndex(positions.length - 1)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// GameBoard — main exported component
// ─────────────────────────────────────────────────────────────
export default function GameBoard({
  fen,
  pgn,
  whitePlayer,
  blackPlayer,
  status,
}: GameBoardProps) {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const whiteWon = status === "1-0";
  const blackWon = status === "0-1";

  const { analysis, evaluatePosition } = useEngine();

  const handlePositionChange = useCallback(
    (newFen: string) => {
      evaluatePosition(newFen, 15);
    },
    [evaluatePosition]
  );

  // Evaluate initial position
  useEffect(() => {
    if (fen && fen !== "start") evaluatePosition(fen, 15);
  }, [fen, evaluatePosition]);

  // Close settings on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeTheme = BOARD_THEMES[activeThemeIndex];

  const evalDisplay =
    analysis.mate !== null
      ? `M${Math.abs(analysis.mate)}`
      : analysis.score !== null
      ? analysis.score > 0
        ? `+${(analysis.score / 100).toFixed(1)}`
        : (analysis.score / 100).toFixed(1)
      : "…";

  return (
    <div
      className={`transition-all duration-300 ${
        isTheaterMode
          ? "fixed inset-0 z-[60] bg-[#090f1a] flex flex-col overflow-y-auto"
          : "w-full relative bg-[#111827] rounded-2xl border border-white/10 shadow-2xl"
      }`}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              status === "*"
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {status === "*" ? "● LIVE" : status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings */}
          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setShowThemeMenu((v) => !v)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              title="Board Settings"
            >
              <Settings size={16} />
              <span className="text-xs hidden sm:inline">Theme</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100]">
                <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Board Theme</span>
                  <button
                    onClick={() => setShowThemeMenu(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="p-2 space-y-1">
                  {BOARD_THEMES.map((t, idx) => (
                    <button
                      key={t.name}
                      onClick={() => {
                        setActiveThemeIndex(idx);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                        activeThemeIndex === idx
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {t.name}
                      <div className="flex rounded overflow-hidden w-6 h-3 border border-white/20">
                        <div className="w-1/2 h-full" style={{ backgroundColor: t.light }} />
                        <div className="w-1/2 h-full" style={{ backgroundColor: t.dark }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theater mode */}
          <button
            onClick={() => setIsTheaterMode((v) => !v)}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            title={isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
          >
            {isTheaterMode ? <Shrink size={16} /> : <Expand size={16} />}
            <span className="text-xs hidden sm:inline">
              {isTheaterMode ? "Exit" : "Theater"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div
        className={`flex flex-col lg:flex-row gap-4 p-4 ${
          isTheaterMode ? "flex-1 overflow-y-auto lg:overflow-hidden" : ""
        }`}
      >
        {/* Left pane — players + engine */}
        <div className="flex flex-col gap-3 lg:w-72 flex-shrink-0">
          <PlayerCard player={blackPlayer} isWinner={blackWon} isWhite={false} />

          {/* Status separator */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
              vs
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <PlayerCard player={whitePlayer} isWinner={whiteWon} isWhite={true} />

          {/* Engine analysis */}
          <div className="mt-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 shadow">
            <div className="flex items-center gap-2 mb-3 text-slate-300">
              <Calculator className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-xs tracking-widest uppercase">Engine Analysis</h4>
            </div>

            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-mono font-bold text-white">{evalDisplay}</span>
              <span className="text-[10px] text-slate-400">
                Depth {analysis.depth || "–"} · Stockfish 16
              </span>
            </div>

            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (analysis.depth / 15) * 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 font-semibold text-xs">Best:</span>
              <span className="font-mono bg-black/30 px-2 py-0.5 rounded border border-white/5 text-slate-200 text-xs">
                {analysis.bestMove ?? "Thinking…"}
              </span>
            </div>
          </div>
        </div>

        {/* Right pane — board + eval bar */}
        <div className="flex gap-3 flex-1 min-w-0 items-start">
          <EvalBar score={analysis.score} mate={analysis.mate} />

          <div className="flex-1 min-w-0">
            <ChessBoardWrapper
              fen={fen}
              pgn={pgn}
              theme={activeTheme}
              onPositionChange={handlePositionChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}