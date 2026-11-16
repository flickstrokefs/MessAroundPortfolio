import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
  color: 'orange' | 'cyan' | 'lime' | 'pink';
}

export const StatCard: React.FC<StatCardProps> = ({ number, label, color }) => {
  const getBorderColorClass = (c: string) => {
    switch (c) {
      case 'orange':
        return 'border-l-[#ff5c00] text-[#ff5c00] hover:shadow-[0_0_15px_rgba(255,92,0,0.15)] hover:border-[#ff5c00]/60';
      case 'cyan':
        return 'border-l-[#00e5ff] text-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:border-[#00e5ff]/60';
      case 'lime':
        return 'border-l-[#b8ff00] text-[#b8ff00] hover:shadow-[0_0_15px_rgba(184,255,0,0.15)] hover:border-[#b8ff00]/60';
      case 'pink':
        return 'border-l-[#ff2d78] text-[#ff2d78] hover:shadow-[0_0_15px_rgba(255,45,120,0.15)] hover:border-[#ff2d78]/60';
      default:
        return 'border-l-[#ff5c00] text-[#ff5c00]';
    }
  };

  const colorStyles = getBorderColorClass(color);

  return (
    <div 
      className={`bg-[#12121a] border border-[#666680]/15 border-l-4 p-5 rounded transition-all duration-300 ${colorStyles} group`}
    >
      <span className="font-syne text-2xl sm:text-3xl font-extrabold text-[#f0f0f0] block tracking-tight group-hover:scale-[1.02] transition-transform duration-300 origin-left">
        {number}
      </span>
      <span className="font-mono text-[10px] sm:text-xs text-[#666680] uppercase tracking-wider block mt-1">
        {label}
      </span>
    </div>
  );
};
export default StatCard;
