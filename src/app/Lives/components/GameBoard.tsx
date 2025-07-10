// src/app/Lives/components/GameBoard.tsx
"use client";

import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import Flag from "react-world-flags";

// --- Type definitions ---
type Player = {
  name: string;
  title?: string;
  fed: string;
  rating?: number;
};

type GameBoardProps = {
  fen: string;
  whitePlayer: Player;
  blackPlayer: Player;
  status: string;
};

//==============================================================================
// 1. SELF-CONTAINED, COMPLETE SVG PIECE COMPONENTS
//==============================================================================
// These are complete, standalone SVG components for each piece.

const WhitePawn = () => (
  <img
    src="/pieces-svg/pawn-w.svg"
    alt="White Pawn"
    className="w-full h-full object-contain"
  />
);

const WhiteRook = () => (
  <img
    src="/pieces-svg/rook-w.svg"
    alt="White Rook"
    className="w-full h-full object-contain"
  />
);

const WhiteKnight = () => (
  <img
    src="/pieces-svg/knight-w.svg"
    alt="White Knight"
    className="w-full h-full object-contain"
  />
);

const WhiteBishop = () => (
  <img
    src="/pieces-svg/bishop-w.svg"
    alt="White Bishop"
    className="w-full h-full object-contain"
  />
);

const WhiteQueen = () => (
  <img
    src="/pieces-svg/queen-w.svg"
    alt="White Queen"
    className="w-full h-full object-contain"
  />
);

const WhiteKing = () => (
  <img
    src="/pieces-svg/king-w.svg"
    alt="White King"
    className="w-full h-full object-contain"
  />
);
const BlackPawn = () => (
  <img
    src="/pieces-svg/pawn-b.svg"
    alt="Black Pawn"
    className="w-full h-full object-contain"
  />
);

const BlackRook = () => (
  <img
    src="/pieces-svg/rook-b.svg"
    alt="Black Rook"
    className="w-full h-full object-contain"
  />
);

const BlackKnight = () => (
  <img
    src="/pieces-svg/knight-b.svg"
    alt="Black Knight"
    className="w-full h-full object-contain"
  />
);

const BlackBishop = () => (
  <img
    src="/pieces-svg/bishop-b.svg"
    alt="Black Bishop"
    className="w-full h-full object-contain"
  />
);

const BlackQueen = () => (
  <img
    src="/pieces-svg/queen-b.svg"
    alt="Black Queen"
    className="w-full h-full object-contain"
  />
);

const BlackKing = () => (
  <img
    src="/pieces-svg/king-b.svg"
    alt="Black King"
    className="w-full h-full object-contain"
  />
);

// A single map that directly maps the FEN character to the final component.
const pieceComponentMap: { [key: string]: React.FC } = {
  P: WhitePawn,
  R: WhiteRook,
  N: WhiteKnight,
  B: WhiteBishop,
  Q: WhiteQueen,
  K: WhiteKing,
  p: BlackPawn,
  r: BlackRook,
  n: BlackKnight,
  b: BlackBishop,
  q: BlackQueen,
  k: BlackKing,
};

const PlayerInfo = ({
  player,
  isWinner,
}: {
  player: Player;
  isWinner: boolean;
}) => (
  <div className="flex flex-col items-center text-center space-y-1">
    <div className="flex items-center gap-2 min-w-0">
      <Trophy
        className={`w-5 h-5 flex-shrink-0 ${isWinner ? "text-amber-400" : "text-transparent"}`}
      />
      <Flag className="w-5 h-5 flex-shrink-0" code={player.fed} />
      <p
        className="font-semibold text-base text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-[180px] md:max-w-[200px]"
        title={player.name}
      >
        {player.name}
      </p>
    </div>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      {player.title} {player.rating || ""}
    </p>
  </div>
);


//==============================================================================
// The Custom Chess Board Component
//==============================================================================
const ChessBoard = ({ fen }: { fen: string }) => {
  const [board, setBoard] = useState<(string | null)[][]>([]);

  useEffect(() => {
    const parseFEN = (fenString: string) => {
      const boardPart = fenString.split(" ")[0];
      const ranks = boardPart.split("/");
      const newBoard: (string | null)[][] = [];
      for (const rankString of ranks) {
        const row: (string | null)[] = [];
        for (const char of rankString) {
          if (char >= "1" && char <= "8") {
            row.push(...Array(parseInt(char)).fill(null));
          } else {
            row.push(char);
          }
        }
        newBoard.push(row);
      }
      return newBoard;
    };

    if (fen) {
      try {
        setBoard(parseFEN(fen));
      } catch (error) {
        console.error("Error parsing FEN:", error);
        setBoard(
          parseFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"),
        );
      }
    }
  }, [fen]);

  const isLightSquare = (row: number, col: number) => (row + col) % 2 === 0;
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div className="grid grid-cols-8 gap-0 aspect-square w-full shadow-lg rounded-md overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          // --- THE DEFINITIVE FIX ---
          // Look up the final component directly from the map.
          const PieceComponent = piece ? pieceComponentMap[piece] : null;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`relative aspect-square flex items-center justify-center ${
                isLightSquare(rowIndex, colIndex)
                  ? "bg-slate-200 dark:bg-slate-500"
                  : "bg-slate-400 dark:bg-slate-700"
              }`}
            >
              {/* Board notation... */}
              {colIndex === 0 && (
                <span
                  className={`absolute top-0 left-1 text-xs font-bold ${isLightSquare(rowIndex, colIndex) ? "text-slate-500 dark:text-slate-700" : "text-slate-200 dark:text-slate-400"}`}
                >
                  {8 - rowIndex}
                </span>
              )}
              {rowIndex === 7 && (
                <span
                  className={`absolute bottom-0 right-1 text-xs font-bold ${isLightSquare(rowIndex, colIndex) ? "text-slate-500 dark:text-slate-700" : "text-slate-200 dark:text-slate-400"}`}
                >
                  {files[colIndex]}
                </span>
              )}

              {/* Render the component if it exists. */}
              {PieceComponent && (
                <div className="w-full h-full p-[8%] drop-shadow-lg">
                  <PieceComponent />
                </div>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};

//==============================================================================
// The Main GameBoard Wrapper Component
//==============================================================================
export default function GameBoard({
  fen,
  whitePlayer,
  blackPlayer,
  status,
}: GameBoardProps) {
  const whiteWon = status === "1-0";
  const blackWon = status === "0-1";

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-4 sm:p-6 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl shadow-lg max-w-5xl mx-auto">
      {/* LEFT INFO PANE */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <PlayerInfo player={whitePlayer} isWinner={whiteWon} />
          <div className="text-center font-bold text-slate-400 dark:text-slate-500 text-xl">
            VS
          </div>
          <PlayerInfo player={blackPlayer} isWinner={blackWon} />
        </div>

        {/* FIXED: text-center is now the default */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Final Result
          </p>
          <p className="font-bold text-xl text-slate-800 dark:text-white">
            {status}
          </p>
        </div>
      </div>

      {/* RIGHT CHESS BOARD */}
      <div className="flex-1 w-full max-w-sm mx-auto md:mx-0">
        <ChessBoard fen={fen} />
      </div>
    </div>
  );
}