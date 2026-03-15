// src/app/Lives/Games/[broadcastRoundId]/page.tsx

import { getBroadcastRound } from "../../api/broadcast";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import GamesClientView from "./components/GamesClientView";

// ✅ Updated for Next.js 15 - params is now a Promise
export default async function BroadcastRoundPage({
  params,
}: {
  params: Promise<{ broadcastRoundId: string }>;
}) {
  const { broadcastRoundId } = await params;

  let roundData = null;
  try {
    // getBroadcastRound already returns game.pgn for each game in the round
    roundData = await getBroadcastRound(broadcastRoundId);
  } catch (error) {
    console.error(`Failed to fetch round ${broadcastRoundId}:`, error);
    return (
      <div className="max-w-4xl mx-auto text-center py-20 flex flex-col items-center gap-4">
        <AlertTriangle className="w-16 h-16 text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold">Could Not Fetch Round</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            The API might be unavailable. Please try again.
          </p>
        </div>
        <Link
          href="/Lives"
          className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700"
        >
          Back to all broadcasts
        </Link>
      </div>
    );
  }

  if (!roundData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold">Round Not Found</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          This round may not exist.
        </p>
        <Link
          href="/Lives"
          className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700"
        >
          Back to all broadcasts
        </Link>
      </div>
    );
  }

  // The Lichess broadcast round API already includes pgn for each game.
  // Simply pass roundData directly — no separate PGN fetch needed.
  return <GamesClientView roundData={roundData} />;
}
