import React from 'react';

import type { SkillGroup as SkillGroupType } from '../data/skills';


interface SkillGroupProps {
  group: SkillGroupType;
}

export const SkillGroup: React.FC<SkillGroupProps> = ({ group }) => {
  // Map color name to Tailwind text, border, and background classes
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          title: 'text-[#ff5c00]',
          border: 'group-hover:border-[#ff5c00]/50',
          hoverText: 'hover:text-[#ff5c00]',
          bg: 'bg-[#ff5c00]/5',
          dot: 'bg-[#ff5c00]',
        };
      case 'cyan':
        return {
          title: 'text-[#00e5ff]',
          border: 'group-hover:border-[#00e5ff]/50',
          hoverText: 'hover:text-[#00e5ff]',
          bg: 'bg-[#00e5ff]/5',
          dot: 'bg-[#00e5ff]',
        };
      case 'lime':
        return {
          title: 'text-[#b8ff00]',
          border: 'group-hover:border-[#b8ff00]/50',
          hoverText: 'hover:text-[#b8ff00]',
          bg: 'bg-[#b8ff00]/5',
          dot: 'bg-[#b8ff00]',
        };
      case 'pink':
        return {
          title: 'text-[#ff2d78]',
          border: 'group-hover:border-[#ff2d78]/50',
          hoverText: 'hover:text-[#ff2d78]',
          bg: 'bg-[#ff2d78]/5',
          dot: 'bg-[#ff2d78]',
        };
      default:
        return {
          title: 'text-[#ff5c00]',
          border: 'group-hover:border-[#ff5c00]/50',
          hoverText: 'hover:text-[#ff5c00]',
          bg: 'bg-[#ff5c00]/5',
          dot: 'bg-[#ff5c00]',
        };
    }
  };

  const style = getColorClasses(group.accentColor);

  return (
    <div 
      className={`bg-[#12121a] border border-[#666680]/20 rounded-lg p-6 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition-all duration-300 group ${style.border}`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#666680]/15">
        <span className="text-3xl select-none" role="img" aria-label={group.title}>
          {group.emoji}
        </span>
        <h3 className={`text-lg font-bold font-syne uppercase tracking-wider ${style.title}`}>
          {group.title}
        </h3>
      </div>

      {/* SKILLS LIST */}
      <ul className="flex flex-col gap-2.5">
        {group.skills.map((skill) => (
          <li 
            key={skill}
            className={`font-mono text-xs text-[#f0f0f0]/70 flex items-center gap-2 transition-all duration-200 hover:translate-x-1 ${style.hoverText} cursor-default`}
          >
            <span className="text-xs select-none opacity-40">→</span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SkillGroup;
