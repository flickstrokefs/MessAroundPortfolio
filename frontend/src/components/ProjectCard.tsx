import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Determine category accent color classes
  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'embedded':
        return {
          text: 'text-[#ff5c00]',
          bg: 'bg-[#ff5c00]/10',
          glowHex: 'rgba(255, 92, 0, 0.12)',
          gradient: 'linear-gradient(135deg, rgba(255,92,0,0.2), rgba(255,45,120,0.15))',
        };
      case 'iot':
        return {
          text: 'text-[#00e5ff]',
          bg: 'bg-[#00e5ff]/10',
          glowHex: 'rgba(0, 229, 255, 0.12)',
          gradient: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(184,255,0,0.1))',
        };
      case 'hardware':
        return {
          text: 'text-[#b8ff00]',
          bg: 'bg-[#b8ff00]/10',
          glowHex: 'rgba(184, 255, 0, 0.12)',
          gradient: 'linear-gradient(135deg, rgba(184,255,0,0.15), rgba(0,229,255,0.1))',
        };
      case 'software':
        return {
          text: 'text-[#ff2d78]',
          bg: 'bg-[#ff2d78]/10',
          glowHex: 'rgba(255, 45, 120, 0.12)',
          gradient: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(255,92,0,0.1))',
        };
      default:
        return {
          text: 'text-[#ff5c00]',
          bg: 'bg-[#ff5c00]/10',
          glowHex: 'rgba(255, 92, 0, 0.12)',
          gradient: 'linear-gradient(135deg, rgba(255,92,0,0.2), rgba(255,45,120,0.15))',
        };
    }
  };

  const style = getCategoryStyles(project.category);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col justify-between overflow-hidden bg-[#12121a] border border-white/[0.07] rounded-[4px] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
    >
      {/* Radial Hover Glow Background Mask */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 280px at ${coords.x}px ${coords.y}px, ${style.glowHex}, transparent 80%)`,
          }}
        />
      )}

      {/* CARD CONTENT */}
      <div className="z-10 relative">
        {/* Gradient Thumbnail Area (180px tall) */}
        <div 
          className="h-[180px] w-full flex items-center justify-center relative overflow-hidden border-b border-white/[0.07]"
          style={{
            background: style.gradient
          }}
        >
          <div className="text-6xl select-none group-hover:scale-110 transition-transform duration-500 ease-out z-10">
            {project.heroEmoji}
          </div>
          
          {/* Subtle grid background inside thumbnail */}
          <div className="absolute inset-0 bg-grid-animated opacity-15 pointer-events-none" />
          
          {/* Top-right slug details */}
          <span className="absolute top-3 right-3 font-mono text-[9px] text-[#666680] uppercase tracking-wider">
            {project.year}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Category Tag */}
          <span className={`font-mono text-[0.68rem] uppercase tracking-wider block mb-2 ${style.text}`}>
            // {project.category}
          </span>

          {/* Project Title */}
          <h3 className="text-[1.15rem] font-bold font-syne text-[#f0f0f0] group-hover:text-white mb-2 leading-snug">
            <Link to={`/projects/${project.slug}`} className="hover:underline">
              {project.title}
            </Link>
          </h3>

          {/* Description Text */}
          <p className="font-mono text-[0.8rem] text-[#666680] mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] text-[#666680] bg-[#0a0a0f] border border-white/[0.05] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER LINKS ROW */}
      <div className="px-6 pb-6 pt-2 border-t border-white/[0.05] flex items-center justify-between z-10 relative">
        <Link 
          to={`/projects/${project.slug}`} 
          className="font-mono text-[10px] uppercase tracking-wider text-[#00e5ff] hover:text-[#b8ff00] transition-colors"
        >
          Details →
        </Link>
        <div className="flex items-center gap-4">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.72rem] text-[#666680] hover:text-[#00e5ff] transition-colors flex items-center gap-1"
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
