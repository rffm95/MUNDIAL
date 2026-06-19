/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Beer, Trophy, Star, ShieldCheck, MapPin } from 'lucide-react';
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
      // Auto-fullscreen attempt
      const doc = document.documentElement;
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch(() => {});
      }

      if (showOverlay) {
        setShowOverlay(false);
      } else if (!isSpinning) {
        spin();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // TV Remote OK (13) or Enter
      if (e.key === 'Enter' || e.keyCode === 13) {
        handleAction();
      }
    };

    const onClick = () => handleAction();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClick);
    };
  }, [spin, isSpinning, showOverlay]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden cursor-none select-none">
      <div className="relative aspect-video h-full w-full p-12 flex flex-col items-center justify-between">
        
        {/* Background Branded Header */}
        <div className="z-10 text-center flex flex-col items-center">
          <h1 
            className="text-white font-black text-[180px] leading-none tracking-tighter uppercase italic drop-shadow-2xl mb-8"
          >
            CHEERS O BAR
          </h1>
          <div className="bg-amber-600 text-white font-black text-4xl px-16 py-6 rounded-full border-8 border-white/20 shadow-2xl">
            <span className="text-white mr-8 tracking-widest">RÉGUA = 1 GIRO</span>
            <span className="text-white tracking-widest">METRO = 2 GIROS</span>
          </div>
        </div>

        {/* Game Stage */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <RouletteWheel prizes={PRIZES} rotation={rotation} />
          
          <div className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40
            w-28 h-28 rounded-full border-8 border-black/20 bg-white shadow-2xl
            flex items-center justify-center
          `}>
             <span className="text-black font-black text-2xl uppercase tracking-tighter">
                {isSpinning ? "..." : "GIRAR"}
             </span>
          </div>
        </div>

        {/* Footer Brand Assets */}
        <div className="z-10 w-full flex justify-between items-center opacity-80 px-20">
           <div className="flex flex-col">
              <span className="text-amber-500 font-bold text-xs uppercase">Cerveja Oficial</span>
              <span className="text-5xl font-black italic text-white tracking-widest leading-none">SAGRES</span>
           </div>
           
           <div className="flex flex-col items-center">
              <ShieldCheck className="text-amber-500 mb-2" size={32} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Beba com Responsabilidade</p>
           </div>

           <div className="flex flex-col text-right">
              <span className="text-emerald-500 font-bold text-xs uppercase">Sponsor Global</span>
              <span className="text-5xl font-black italic text-white tracking-widest leading-none">HEINEKEN</span>
           </div>
        </div>

        {/* Win Notification */}
        <AnimatePresence>
          {showOverlay && winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 transition-opacity"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`
                  p-16 rounded-[4rem] border-8 flex flex-col items-center text-center
                  ${winner.isWin ? 'bg-amber-600 border-white' : 'bg-zinc-900 border-zinc-700'}
                `}
              >
                {winner.isWin ? (
                  <>
                    <h3 className="text-5xl font-bold text-white/80 mb-2 uppercase tracking-widest">PARABÉNS!</h3>
                    <h2 className="text-[120px] font-black italic text-white leading-none mb-8">
                       {winner.award}
                    </h2>
                    <div className="flex items-center bg-white/20 px-8 py-4 rounded-3xl border-2 border-white/40">
                       <img src={winner.flag} className="w-16 h-10 object-cover mr-6 rounded shadow-lg" alt="" />
                       <span className="text-4xl font-bold text-white tracking-widest">{winner.country}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-[100px] font-black italic text-white leading-none mb-4 uppercase">AZAR!</h2>
                    <p className="text-4xl font-bold text-white/50 uppercase tracking-widest">Tenta outra vez!</p>
                  </>
                )}
                
                <div className="mt-12 text-white/40 font-bold text-xl uppercase tracking-widest animate-pulse font-mono">
                  CLIQUE NO OK PARA CONTINUAR
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

