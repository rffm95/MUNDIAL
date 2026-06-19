import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Prize } from '../types';

interface RouletteWheelProps {
  prizes: Prize[];
  rotation: number;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ prizes, rotation }) => {
  const segmentAngle = 360 / prizes.length;

  const segments = useMemo(() => {
    return prizes.map((prize, i) => {
      const angle = i * segmentAngle;
      
      return (
        <g key={prize.id} transform={`rotate(${angle})`}>
          {/* Main Segment Path */}
          <path
            d={`M 0 0 L 0 -250 A 250 250 0 0 1 ${250 * Math.sin(segmentAngle * Math.PI / 180)} ${-250 * Math.cos(segmentAngle * Math.PI / 180)} Z`}
            fill={prize.color}
            stroke="#ffffff22"
            strokeWidth="2"
          />
          
          {/* Text and Icon Container */}
          <g transform={`rotate(${segmentAngle / 2} 0 0) translate(0, -160)`}>
            <text
              fill="white"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              className="select-none font-sans uppercase tracking-widest drop-shadow-lg"
              transform="rotate(0)"
            >
              {prize.country || "Tenta"}
            </text>
            <text
              fill="white"
              fontSize="10"
              fontWeight="normal"
              textAnchor="middle"
              className="select-none font-sans opacity-80 drop-shadow-md"
              transform="translate(0, 15)"
            >
              {prize.award || "outra vez"}
            </text>
            
            {prize.flag && (
              <image
                href={prize.flag}
                x="-15"
                y="-50"
                width="30"
                height="20"
                preserveAspectRatio="xMidYMid slice"
                className="rounded-sm"
              />
            )}
          </g>
        </g>
      );
    });
  }, [prizes, segmentAngle]);

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
      {/* Simplified Outer Border */}
      <div className="absolute inset-0 rounded-full border-[8px] border-amber-600 z-10 box-border" />
      
      {/* The Spinning Core - Optimized for low-end hardware */}
      <motion.div
        className="relative w-full h-full"
        style={{ willChange: 'transform' }}
        animate={{ rotate: rotation }}
        transition={{ 
          duration: 6,
          ease: [0.12, 1, 0.22, 1] 
        }}
      >
        <svg viewBox="-260 -260 520 520" className="w-full h-full overflow-visible">
          <circle r="250" fill="#111" />
          
          {/* Segments */}
          {segments}
          
          {/* Center Hub - Simplified */}
          <circle r="35" fill="#1a1a1a" stroke="#d97706" strokeWidth="4" />
          <circle r="25" fill="#d97706" />
        </svg>
      </motion.div>

      {/* Static Indicator Arrow (Top) */}
      <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-30">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[35px] border-t-amber-500" />
      </div>
    </div>
  );
};

export default RouletteWheel;
