import { useEffect, useRef, useState, useCallback } from 'react';

export type EngineAnalysis = {
  score: number | null; // Centennial score (e.g., +150 for +1.5)
  mate: number | null;  // Mate in X (- for black, + for white)
  depth: number;
  bestMove: string | null;
}

export function useEngine() {
  const engineRef = useRef<Worker | null>(null);
  const [analysis, setAnalysis] = useState<EngineAnalysis>({
    score: null,
    mate: null,
    depth: 0,
    bestMove: null,
  });

  useEffect(() => {
    // Initialize Web Worker using the stockfish file mapped to the public folder
    const worker = new Worker('/engine/stockfish.js');
    engineRef.current = worker;

    worker.onmessage = (e) => {
      const line = (e.data ?? "").toString();
      
      // Parse UCI info lines
      if (line.startsWith('info depth')) {
        const depthMatch = line.match(/depth (\d+)/);
        const scoreMatch = line.match(/cp (-?\d+)/);
        const mateMatch = line.match(/mate (-?\d+)/);
        
        setAnalysis(prev => ({
          ...prev,
          depth: depthMatch ? parseInt(depthMatch[1]) : prev.depth,
          score: scoreMatch ? parseInt(scoreMatch[1]) : prev.score,
          mate: mateMatch ? parseInt(mateMatch[1]) : prev.mate,
        }));
      }

      // Parse bestmove
      if (line.startsWith('bestmove')) {
        const match = line.match(/bestmove\s+(\S+)/);
        if (match) {
          setAnalysis(prev => ({ ...prev, bestMove: match[1] }));
        }
      }
    };

    worker.postMessage('uci');

    return () => {
      worker.terminate();
    };
  }, []);

  const evaluatePosition = useCallback((fen: string, depth = 15) => {
    if (engineRef.current) {
      engineRef.current.postMessage('stop');
      engineRef.current.postMessage('isready');
      engineRef.current.postMessage(`position fen ${fen}`);
      engineRef.current.postMessage(`go depth ${depth}`);
    }
  }, []);

  return { analysis, evaluatePosition };
}
