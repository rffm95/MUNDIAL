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
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowOverlay(false);

    // FAIRNESS: Math.random() provides a uniform distribution. 
    // With 12 segments, each has exactly 1/12 (8.33%) chance.
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 spins
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
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97706', '#e42518', '#009739', '#ffffff'],
          zIndex: 100,
        });
      }
    }, 6200);
  }, [isSpinning, rotation]);

  // Optimized Global Key Listener for TV Remote (OK/Enter button) and high-performance fullscreen trigger
  useEffect(() => {
    const handleFullscreen = () => {
      const doc = document.documentElement;
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch(() => {
          // Fallback or handle block
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger fullscreen on first interaction as browsers require a gesture
      handleFullscreen();

      if (e.key === 'Enter' || e.keyCode === 13) {
        if (showOverlay) {
          setShowOverlay(false);
        } else if (!isSpinning) {
          spin();
        }
      }
    };

    const handleClick = () => {
      handleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [spin, isSpinning, showOverlay]);

  return (
    <div className="h-screen w-screen world-cup-gradient flex items-center justify-center overflow-hidden cursor-none">
      {/* 16:9 Aspect Ratio Container for TV */}
      <div className="relative aspect-video h-full max-h-[1080px] w-full max-w-[1920px] p-8 flex flex-col items-center justify-between">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10"><Trophy size={200} className="text-amber-500" /></div>
          <div className="absolute bottom-10 right-10"><Beer size={200} className="text-amber-600 rotate-12" /></div>
          <div className="absolute top-1/2 left-20 -translate-y-1/2 overflow-hidden opacity-20">
             <h1 className="text-[200px] font-black leading-none select-none">CHEERS</h1>
          </div>
        </div>

        {/* Header Section */}
        <div className="z-10 text-center flex flex-col items-center space-y-2">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center space-y-2 bg-gradient-to-r from-amber-600 to-amber-400 px-8 py-3 rounded-full shadow-[0_0_40px_rgba(217,119,6,0.3)] border-2 border-white/20"
          >
            <MapPin className="mr-3 text-white fill-white" size={24}/>
            <span className="text-white font-black text-3xl tracking-tighter uppercase italic">CHEERS O BAR</span>
          </motion.div>
          
          {/* Rules / Promo Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-black/60 border border-white/10 rounded-xl px-6 py-2"
          >
            <p className="text-white font-bold text-lg uppercase tracking-wider">
              <span className="text-amber-400">RÉGUA</span> = 1 GIRO <span className="mx-4 text-white/20">|</span> <span className="text-amber-400">METRO</span> = 2 GIROS
            </p>
          </motion.div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <RouletteWheel prizes={PRIZES} rotation={rotation} />
          
          {/* Spin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={spin}
            disabled={isSpinning}
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40
              w-32 h-32 rounded-full font-black text-xl uppercase tracking-tighter
              flex items-center justify-center transition-all duration-300
              ${isSpinning ? 'opacity-50 cursor-not-allowed scale-90' : 'cursor-pointer hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]'}
              bg-white text-black border-8 border-black/10 shadow-2xl
            `}
          >
            {isSpinning ? (
              <span className="animate-pulse">Sorte...</span>
            ) : (
              "GIRAR"
            )}
          </motion.button>
        </div>

        {/* Footer Brand Info */}
        <div className="z-10 w-full flex justify-between items-end opacity-60">
           <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Official Partner</span>
                <span className="text-2xl font-black italic tracking-tighter text-white">SAGRES</span>
              </div>
           </div>
           
           <div className="flex flex-col items-center">
              <ShieldCheck className="text-amber-500 mb-1" size={24} />
              <p className="text-[8px] font-medium uppercase tracking-[0.2em]">Beba com moderação</p>
           </div>

           <div className="flex items-center space-x-6 text-right">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Global Sponsor</span>
                <span className="text-2xl font-black italic tracking-tighter text-white">HEINEKEN</span>
              </div>
           </div>
        </div>

        {/* Winner Overlay Modal */}
        <AnimatePresence>
          {showOverlay && winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/95"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`
                  relative p-12 rounded-[3rem] border-4 flex flex-col items-center text-center max-w-2xl
                  ${winner.isWin ? 'bg-amber-600 border-white' : 'bg-zinc-900 border-zinc-700'}
                `}
              >
                {/* Close Button UI or Auto-hide */}
                <div className="absolute top-6 right-6">
                   <button 
                     onClick={() => setShowOverlay(false)}
                     className="text-white/20 hover:text-white transition-colors"
                   >
                     Continuar
                   </button>
                </div>

                {winner.isWin ? (
                  <>
                    <div className="mb-6 flex space-x-4">
                       <motion.div 
                         animate={{ y: [0, -10, 0] }}
                         transition={{ repeat: Infinity, duration: 1 }}
                       >
                         <Beer size={64} className="text-white fill-white" />
                       </motion.div>
                       <motion.div 
                         animate={{ y: [0, -10, 0] }}
                         transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                       >
                         <Beer size={64} className="text-white fill-white" />
                       </motion.div>
                    </div>
                    <img src={winner.flag} alt="" className="w-32 h-20 object-cover rounded-xl shadow-2xl mb-6 border-2 border-white/50" />
                    <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">
                      {winner.country} GANHOU!
                    </h3>
                    <div className="bg-white text-amber-600 px-6 py-3 rounded-2xl font-black text-4xl mb-4 shadow-xl">
                      {winner.award}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-8 opacity-40">
                       <Star size={80} className="text-white" />
                    </div>
                    <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">
                      AZAR!
                    </h3>
                    <p className="text-2xl font-bold text-zinc-500 uppercase tracking-widest">
                      Tenta outra vez no Cheers O Bar
                    </p>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOverlay(false)}
                  className="mt-10 bg-white text-black px-12 py-4 rounded-full font-black text-xl uppercase tracking-widest shadow-xl hover:bg-zinc-100 transition-all"
                >
                  OK
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

