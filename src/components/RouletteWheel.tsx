import React, { useMemo } from 'react';
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
          <g transform={`rotate(${segmentAngle / 2} 0 0) translate(0, -135)`}>
            {prize.flag ? (
              <>
                {/* Background border and flag for country slice */}
                <rect x="-24" y="-72" width="48" height="32" fill="white" rx="3" />
                <image href={prize.flag} x="-22" y="-70" width="44" height="28" preserveAspectRatio="none" />
                
                <text
                  fill="white"
                  fontSize="17"
                  fontWeight="900"
                  textAnchor="middle"
                  className="select-none font-sans uppercase tracking-wider"
                  y="-22"
                >
                  {prize.country}
                </text>
                
                <text
                  fill="#ffc400"
                  fontSize="12.5"
                  fontWeight="900"
                  textAnchor="middle"
                  className="select-none font-sans uppercase tracking-[0.05em]"
                  y="2"
                >
                  {prize.award}
                </text>
              </>
            ) : (
              <>
                {/* "Tenta outra vez" segment */}
                <text
                  fill="#9ca3af"
                  fontSize="16"
                  fontWeight="900"
                  textAnchor="middle"
                  className="select-none font-sans uppercase tracking-wider"
                  y="-30"
                >
                  TENTA
                </text>
                <text
                  fill="#9ca3af"
                  fontSize="13"
                  fontWeight="800"
                  textAnchor="middle"
                  className="select-none font-sans uppercase tracking-wider"
                  y="-10"
                >
                  OUTRA VEZ
                </text>
              </>
            )}
          </g>
        </g>
      );
    });
  }, [prizes, segmentAngle]);

  return (
    <div className="relative w-[440px] h-[440px] flex items-center justify-center">
      {/* Simplified Outer Border */}
      <div className="absolute inset-0 rounded-full border-[8px] border-amber-600 z-10 box-border" />
      
      {/* Pure CSS rotation for smoother TV performance */}
      <div
        className="relative w-full h-full"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 6s cubic-bezier(0.12, 1, 0.22, 1)',
          willChange: 'transform'
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
      </div>

      {/* Static Indicator Arrow (Top) */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-amber-500" />
      </div>
    </div>
  );
};

export default RouletteWheel;
