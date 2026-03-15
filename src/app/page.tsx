import Link from "next/link";
import { Play, TrendingUp, MonitorPlay } from "lucide-react";
import HeroHighlight from "@/components/HeroHighlight";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-blue-500/30">
      {/* Background styling for a purely cinematic feel */}
      <div className="fixed inset-0 z-[-1] bg-[#09090b]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Glowing orb effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.8)_0,transparent_50%)] blur-[100px]"></div>
      </div>

      <main className="flex-1 flex flex-col items-center pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Typography Hero */}
        <div className="text-center space-y-8 max-w-4xl mx-auto relative mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-4 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            The Premier Esports Hub for Live Chess
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
            Watch the World's Best Chess. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-600">
              Distraction-Free.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience grandmaster play in a cinematic theater mode. Live broadcasts, real-time evaluations, zero clutter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/Lives"
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-slate-200"
            >
              Explore Live Tournaments
              <TrendingUp className="w-5 h-5 text-slate-600 group-hover:text-black transition-colors" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Dynamic Highlight Component */}
        <HeroHighlight />

        {/* Value Proposition / Features Grid */}
        <section id="features" className="w-full mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 text-center scroll-mt-32">
          
          <div className="flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <MonitorPlay className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Immersive Theater</h3>
            <p className="text-slate-400 leading-relaxed">
              Expansive, clutter-free board views designed specifically for spectating, making you feel like you're sitting at the board.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
              <Play className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Live Aggregation</h3>
            <p className="text-slate-400 leading-relaxed">
              We pull the best live games from top platforms into one elegant dashboard. Never miss a super-tournament again.
            </p>
          </div>

          <div className="flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Visual Analysis</h3>
            <p className="text-slate-400 leading-relaxed">
              Beginner-friendly engine integrations. Understand game tension instantly with visual threat indicators and win probability.
            </p>
          </div>

        </section>

      </main>

    </div>
  );
}
