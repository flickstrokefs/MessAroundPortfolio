import React, { useEffect, useState } from 'react';

const STACK_STRINGS = [
  'SW + EMBEDDED',
  'REACT / NODE',
  'C / C++ / STM32',
  'KICAD + FIRMWARE'
];

export const SystemReadout: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(STACK_STRINGS[0]);
  const [opacity, setOpacity] = useState(1);

  // Swap cycle timeout & flicker effect
  useEffect(() => {
    const nextWordTimeout = setTimeout(() => {
      let flashes = 0;
      const flickerInterval = setInterval(() => {
        setOpacity(prev => (prev === 1 ? 0 : 1));
        flashes++;
        if (flashes >= 6) {
          clearInterval(flickerInterval);
          setOpacity(1);
          setIndex(prev => (prev + 1) % STACK_STRINGS.length);
        }
      }, 33);
    }, 3000);

    return () => clearTimeout(nextWordTimeout);
  }, [index]);

  // Typewriter effect
  useEffect(() => {
    const targetStr = STACK_STRINGS[index];
    let charIdx = 0;
    setDisplayText('');

    const typeInterval = setInterval(() => {
      setDisplayText(targetStr.slice(0, charIdx + 1));
      charIdx++;
      if (charIdx >= targetStr.length) {
        clearInterval(typeInterval);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [index]);

  const statBlocks = [
    {
      label: 'SYS_STATUS',
      value: (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse-green shadow-[0_0_8px_#00ff88]" />
          <span className="text-white font-mono">ONLINE</span>
        </div>
      )
    },
    {
      label: 'STACK',
      value: (
        <div 
          className="font-mono text-white transition-opacity duration-75"
          style={{ opacity }}
        >
          {displayText}
          <span className="animate-pulse">_</span>
        </div>
      )
    },
    {
      label: 'UPTIME',
      value: <span className="text-white font-mono">3+ YRS ACTIVE</span>
    },
    {
      label: 'LOCATION',
      value: <span className="text-white font-mono">LUDHIANA, IN</span>
    },
    {
      label: 'FOCUS',
      value: <span className="text-[#ff5c00] font-mono font-bold">OPEN TO WORK</span>
    }
  ];

  return (
    <div className="relative w-full bg-[#0d0d14] border-t border-b border-[#ff5c00]/15 py-8 md:py-10 px-6 md:px-16 overflow-hidden select-none font-mono">
      {/* Sweeping scanline */}
      <div className="absolute top-0 bottom-0 w-[150px] bg-gradient-to-r from-transparent via-[#00e5ff]/8 to-transparent pointer-events-none animate-scanline" />

      {/* Grid container */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-col min-[900px]:flex-row justify-between items-stretch gap-6 md:gap-0">
        {statBlocks.map((block, idx) => (
          <React.Fragment key={block.label}>
            {/* Stat Block */}
            <div className="flex-1 flex flex-col justify-center items-start text-left md:px-6">
              <span className="text-[0.65rem] tracking-[3px] text-[#666680] uppercase mb-2">
                [ {block.label} ]
              </span>
              <div className="text-[0.85rem] h-6 flex items-center">
                {block.value}
              </div>
            </div>

            {/* Vertical divider on desktop, omitted after last item */}
            {idx < statBlocks.length - 1 && (
              <div className="hidden min-[900px]:block w-[1px] bg-white/8 self-stretch my-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SystemReadout;
