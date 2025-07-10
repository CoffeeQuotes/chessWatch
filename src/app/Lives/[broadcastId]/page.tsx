// src/app/Lives/[broadcastId]/page.tsx
import { getBroadcast } from "../api/broadcast";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  MapPin,
  Clock,
  Globe,
  Trophy,
  ExternalLink, // We will replace this icon
  ShieldCheck,
  CheckCircle,
  Hourglass,
  AlertTriangle,
  ChevronRight, // --- CHANGE 1: Import the new icon ---
} from "lucide-react";

// A type definition for our data for better TypeScript support
type BroadcastData = Awaited<ReturnType<typeof getBroadcast>>;

// Helper component for displaying key-value information with an icon
const InfoItem = ({
  icon: Icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  isLink?: boolean;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-4">
      <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 break-words"
          >
            {value.split("//")[1] || value}
          </a>
        ) : (
          <p className="text-sm text-slate-800 dark:text-slate-100 break-words">
            {value}
          </p>
        )}
      </div>
    </div>
  );
};

// Main Page Component - ✅ Updated for Next.js 15
export default async function BroadcastPage({
  params,
}: {
  params: Promise<{ broadcastId: string }>;
}) {
  // Await the params Promise
  const { broadcastId } = await params;

  let broadcastData: BroadcastData | null = null;
  try {
    // Fetch data directly in the Server Component
    broadcastData = await getBroadcast(broadcastId);
  } catch (error) {
    console.error(`Failed to fetch broadcast ${broadcastId}:`, error);
  }

  // Handle cases where data is not found or an error occurred
  if (!broadcastData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold">Broadcast Not Found</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          The broadcast you are looking for might have ended or does not exist.
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

  const { tour, rounds, group } = broadcastData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Banner Image */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-8">
        <Image
          src={tour.image || "/chess-fallback.png"}
          alt={tour.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white shadow-xl">
            {tour.name}
          </h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Rounds List */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-semibold mb-4">Rounds</h2>
            <div className="space-y-3">
              {rounds.map((round, index) => {
                // --- THIS IS THE NEW LOGIC ---
                const isFinished = round.finished;
                const now = new Date();
                const startTime = round.startsAt
                  ? new Date(round.startsAt)
                  : null;

                let status: "finished" | "live" | "upcoming" = "upcoming";

                if (isFinished) {
                  status = "finished";
                } else if (startTime && startTime <= now) {
                  // It has a start time and it has passed
                  status = "live";
                } else if (!startTime && round.startsAfterPrevious) {
                  // It's a tiebreak that starts after another round.
                  // We can assume it's live if the *previous* round in the array is finished.
                  if (index > 0 && rounds[index - 1].finished) {
                    status = "live";
                  } else {
                    // If the previous round isn't finished, this one is still upcoming.
                    status = "upcoming";
                  }
                } else {
                  // Default to upcoming if it has a future start time or no info
                  status = "upcoming";
                }

                return (
                  <Link
                    key={round.id}
                    href={`/Lives/Games/${round.id}`}
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {round.name}
                      </p>
                      {startTime && (
                        <p className="text-xs text-slate-500">
                          {startTime.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Use the new `status` variable to render the correct badge */}
                      {status === "finished" && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                          <CheckCircle size={14} /> Finished
                        </span>
                      )}
                      {status === "live" && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">
                          <div className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </div>
                          LIVE
                        </span>
                      )}
                      {status === "upcoming" && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          <Hourglass size={14} /> Upcoming
                        </span>
                      )}
                      <ChevronRight
                        size={20}
                        className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar): Info & Navigation */}
        <div className="space-y-8">
          {/* Tournament Info Panel */}
          <section className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-2xl font-semibold mb-2">Details</h2>
            <InfoItem
              icon={ShieldCheck}
              label="Format"
              value={tour.info.format}
            />
            <InfoItem icon={Clock} label="Time Control" value={tour.info.tc} />
            <InfoItem
              icon={MapPin}
              label="Location"
              value={tour.info.location}
            />
            <InfoItem
              icon={Users}
              label="Key Players"
              value={tour.info.players}
            />
            <InfoItem
              icon={Globe}
              label="Website"
              value={tour.info.website}
              isLink
            />
            <InfoItem
              icon={Trophy}
              label="Standings"
              value={tour.info.standings}
              isLink
            />
          </section>

          {/* Related Tours Panel */}
          {group && (
            <section className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-semibold mb-4">{group.name}</h2>
              <div className="space-y-2">
                {group.tours.map((groupTour) => (
                  <Link
                    key={groupTour.id}
                    href={`/Lives/${groupTour.id}`}
                    className={`block p-3 rounded-lg font-medium transition-colors ${
                      groupTour.id === broadcastId
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "hover:bg-slate-200 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {groupTour.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
