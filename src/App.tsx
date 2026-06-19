/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck } from 'lucide-react';
import RouletteWheel from './components/RouletteWheel';
import { PRIZES, Prize } from './types';

export default function App() {
  // TV Optimized Version 2.5 (Performance + Global Trigger)
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowOverlay(false);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const extraSpins = 6 + Math.floor(Math.random() * 4); // 6-10 spins
    const segmentAngle = 360 / PRIZES.length;
    
    const newRotation = rotation + (extraSpins * 360) + (360 - (prizeIndex * segmentAngle) - (segmentAngle / 2)) - (rotation % 360);
    
    setRotation(newRotation);

    setTimeout(() => {
      const actualWinner = PRIZES[prizeIndex];
      setWinner(actualWinner);
      setIsSpinning(false);
      setShowOverlay(true);

      if (actualWinner.isWin) {
        confetti({
          particleCount: 40, // More stable for TV
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#d97706', '#ffffff'],
          zIndex: 100,
        });
      }
    }, 6100);
  }, [isSpinning, rotation]);

  // Global Key & Click Listeners for Total UI Trigger
  useEffect(() => {
    const handleAction = () => {
      // Auto-fullscreen attempt for TV engagement
      try {
        const doc = document.documentElement;
        if (doc.requestFullscreen) {
          doc.requestFullscreen().catch(() => {});
        }
      } catch (e) {
        // Fullscreen might be blocked, ignore
      }

      if (showOverlay) {
        setShowOverlay(false);
      } else if (!isSpinning) {
        spin();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Any key or specifically Enter/OK (13)
      handleAction();
    };

    const handleClick = () => handleAction();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [spin, isSpinning, showOverlay]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden cursor-none select-none">
      <div className="relative aspect-video h-full w-full p-10 flex flex-col items-center justify-between">
        
        {/* Massive Branded Header */}
        <div className="z-10 text-center flex flex-col items-center mt-4">
          <h1 
            className="text-white font-black text-[130px] leading-[0.8] tracking-tighter uppercase italic mb-8 drop-shadow-[5px_15px_25px_rgba(0,0,0,0.8)]"
          >
            CHEERS O BAR
          </h1>
          <div className="bg-amber-600 text-white font-black text-3xl px-16 py-5 rounded-full border-8 border-white/30 shadow-[0_0_80px_rgba(217,119,6,0.5)]">
            <span className="text-white mr-10 tracking-[0.1em]">RÉGUA = 1 GIRO</span>
            <span className="text-white tracking-[0.1em]">METRO = 2 GIROS</span>
          </div>
        </div>

        {/* Game Stage - Ultra Lighter Version */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <RouletteWheel prizes={PRIZES} rotation={rotation} />
          
          <div className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40
            w-28 h-28 rounded-full border-[10px] border-black/30 bg-white shadow-2xl
            flex items-center justify-center
          `}>
             <span className="text-black font-black text-2xl uppercase tracking-tighter">
                {isSpinning ? "..." : "GIRAR"}
             </span>
          </div>
        </div>

        {/* Brand Assets High Contrast */}
        <div className="z-10 w-full flex justify-between items-center opacity-90 px-24 mb-4">
           <div className="flex flex-col">
              <span className="text-amber-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">Cerveja Oficial</span>
              <span className="text-5xl font-black italic text-white tracking-widest leading-none">SAGRES</span>
           </div>
           
           <div className="flex flex-col items-center">
              <ShieldCheck className="text-amber-500 mb-1" size={32} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Beba com Responsabilidade</p>
           </div>

           <div className="flex flex-col text-right">
              <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">Sponsor Global</span>
              <span className="text-5xl font-black italic text-white tracking-widest leading-none">HEINEKEN</span>
           </div>
        </div>

        {/* Win Notification - Pure CSS transitions for zero lag */}
        {showOverlay && winner && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 transition-opacity"
            style={{ 
              animation: 'fadeIn 0.3s ease-out forwards'
            }}
          >
            <div
              className={`
                p-14 rounded-[3rem] border-8 flex flex-col items-center text-center max-w-4xl
                ${winner.isWin ? 'bg-amber-600 border-white shadow-[0_0_120px_rgba(255,255,255,0.25)]' : 'bg-zinc-900 border-zinc-700 shadow-2xl'}
              `}
              style={{
                animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards'
              }}
            >
              {winner.isWin ? (
                <>
                  <h3 className="text-4xl font-bold text-white/80 mb-3 uppercase tracking-[0.3em]">PARABÉNS!</h3>
                  <h2 className="text-[100px] font-black italic text-white leading-none mb-8 drop-shadow-xl">
                     {winner.award}
                  </h2>
                  <div className="flex items-center bg-white/20 px-8 py-4 rounded-2xl border-2 border-white/40">
                     <img src={winner.flag} className="w-16 h-11 object-cover mr-6 rounded shadow-lg animate-pulse" alt="" />
                     <span className="text-4xl font-bold text-white tracking-widest">{winner.country}</span>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-[100px] font-black italic text-white leading-none mb-6 uppercase">AZAR!</h2>
                  <p className="text-4xl font-bold text-white/50 uppercase tracking-widest">Tenta outra vez!</p>
                </>
              )}
              
              <div className="mt-10 text-white/60 font-bold text-2xl uppercase tracking-[0.4em] animate-pulse font-mono">
                CLIQUE PARA CONTINUAR
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

