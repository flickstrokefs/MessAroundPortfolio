import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Users, Cpu, ExternalLink } from 'lucide-react';
import { DEFAULT_PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';


export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true);
      let list = DEFAULT_PROJECTS;
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            list = data;
          }
        }
      } catch (err) {
        console.warn('Backend server unreachable, loading static data:', err);
      }
      
      setProjects(list);
      const found = list.find((p) => p.slug === slug);
      setProject(found || null);
      setIsLoading(false);
    };

    loadProjectData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-[#666680] bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-[#ff5c00] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          <span>Synchronizing telemetry specs...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-mono text-sm text-[#666680] p-6 text-center bg-[#0a0a0f]">
        <h2 className="text-xl font-bold font-syne text-[#ff2d78] mb-4">404 // Target Core Unreachable</h2>
        <p className="mb-6">The project slug '{slug}' is not registered in data.json.</p>
        <Link to="/" className="text-[#00e5ff] border border-[#00e5ff] px-4 py-2 rounded hover:bg-[#00e5ff]/10 transition-all">
          ← Return to Command Center
        </Link>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const getTheme = (category: string) => {
    switch (category.toLowerCase()) {
      case 'embedded':
        return { text: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/5', border: 'border-[#ff5c00]/30', hex: '#ff5c00' };
      case 'iot':
        return { text: 'text-[#00e5ff]', bg: 'bg-[#00e5ff]/5', border: 'border-[#00e5ff]/30', hex: '#00e5ff' };
      case 'hardware':
        return { text: 'text-[#b8ff00]', bg: 'bg-[#b8ff00]/5', border: 'border-[#b8ff00]/30', hex: '#b8ff00' };
      case 'software':
        return { text: 'text-[#ff2d78]', bg: 'bg-[#ff2d78]/5', border: 'border-[#ff2d78]/30', hex: '#ff2d78' };
      default:
        return { text: 'text-[#ff5c00]', bg: 'bg-[#ff5c00]/5', border: 'border-[#ff5c00]/30', hex: '#ff5c00' };
    }
  };

  const theme = getTheme(project.category);

  const renderVisualSchematic = () => {
    switch (project.category.toLowerCase()) {
      case 'embedded':
        return (
          <div className="bg-[#12121a] border border-white/[0.07] rounded-[4px] p-6 font-mono text-xs overflow-hidden relative">
            <span className="absolute top-3 right-3 text-[#ff5c00] text-[9px] uppercase tracking-wider animate-pulse">// task_scheduler</span>
            <span className="text-[#666680] block mb-4">LOG_NODE: RTOS_TASK_IDLE (FreeRTOS Task Scheduler)</span>
            <div className="h-48 w-full border border-white/[0.05] rounded-[4px] bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="125" y1="0" x2="125" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="375" y1="0" x2="375" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <path
                  d="M 0 160 Q 50 140 100 120 T 200 60 T 300 110 T 400 170 T 500 100"
                  fill="none"
                  stroke="#ff5c00"
                  strokeWidth="2"
                  strokeDasharray="1000"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute top-2 left-2 text-[10px] text-emerald-400 font-bold bg-[#12121a] px-2 py-0.5 border border-white/[0.05] rounded">// RUNNING</div>
            </div>
          </div>
        );
      case 'iot':
        return (
          <div className="bg-[#12121a] border border-white/[0.07] rounded-[4px] p-6 font-mono text-xs overflow-hidden relative">
            <span className="absolute top-3 right-3 text-[#00e5ff] text-[9px] uppercase tracking-wider animate-pulse">// node_mesh</span>
            <span className="text-[#666680] block mb-4">MESH_MAP: 4 Nodes Active (ESP-NOW broadcast topology)</span>
            <div className="h-48 w-full border border-white/[0.05] rounded-[4px] bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full p-4" viewBox="0 0 400 200">
                <circle cx="200" cy="100" r="10" fill="#00e5ff" className="animate-ping" />
                <circle cx="200" cy="100" r="6" fill="#00e5ff" />
                <circle cx="80" cy="50" r="5" fill="#f0f0f0" />
                <circle cx="320" cy="50" r="5" fill="#f0f0f0" />
                <circle cx="100" cy="160" r="5" fill="#f0f0f0" />
                <circle cx="300" cy="160" r="5" fill="#f0f0f0" />
                <line x1="200" y1="100" x2="80" y2="50" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" strokeDasharray="5" />
                <line x1="200" y1="100" x2="320" y2="50" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" strokeDasharray="5" />
                <line x1="200" y1="100" x2="100" y2="160" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" strokeDasharray="5" />
                <line x1="200" y1="100" x2="300" y2="160" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" strokeDasharray="5" />
              </svg>
            </div>
          </div>
        );
      case 'hardware':
        return (
          <div className="bg-[#12121a] border border-white/[0.07] rounded-[4px] p-6 font-mono text-xs overflow-hidden relative">
            <span className="absolute top-3 right-3 text-[#b8ff00] text-[9px] uppercase tracking-wider animate-pulse">// signal_integrity</span>
            <span className="text-[#666680] block mb-4">PCB_IMPEDANCE_MATCHING (50Ω Differential Pair Signal Lock)</span>
            <div className="h-48 w-full border border-white/[0.05] rounded-[4px] bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <path d="M 0 85 L 150 85 L 210 135 L 310 135 L 360 85 L 500 85" fill="none" stroke="#b8ff00" strokeWidth="2.5" />
                <path d="M 0 95 L 146 95 L 206 145 L 306 145 L 356 95 L 500 95" fill="none" stroke="#b8ff00" strokeWidth="2.5" strokeOpacity="0.4" />
              </svg>
              <div className="absolute top-2 left-2 text-[10px] text-[#b8ff00] font-bold">IMPEDANCE: 50.4 Ω</div>
            </div>
          </div>
        );
      case 'software':
        return (
          <div className="bg-[#12121a] border border-white/[0.07] rounded-[4px] p-6 font-mono text-xs overflow-hidden relative">
            <span className="absolute top-3 right-3 text-[#ff2d78] text-[9px] uppercase tracking-wider animate-pulse">// bundle_inspect</span>
            <span className="text-[#666680] block mb-4">VITE_BUILD_GRAPH (Module chunks sizing)</span>
            <div className="h-48 w-full border border-white/[0.05] rounded-[4px] bg-[#0a0a0f] p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-white">index.js (Core)</span>
                <span className="text-[#ff2d78] font-bold">429.3 kB</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                <div className="bg-[#ff2d78] h-full" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-white">vendor.js (React/Framer)</span>
                <span className="text-[#00e5ff] font-bold">133.2 kB</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                <div className="bg-[#00e5ff] h-full" style={{ width: '35%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-white">index.css (Tailwind CSS)</span>
                <span className="text-[#b8ff00] font-bold">24.6 kB</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
                <div className="bg-[#b8ff00] h-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* 1. TOP NAV BAR SECTION (#0a0a0f) */}
      <section className="py-[2rem] px-[2rem] md:py-[3rem] md:px-[4rem] bg-[#0a0a0f] border-b border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#666680] hover:text-[#00e5ff] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Missions
          </Link>
          
          <div className="flex items-center gap-4">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-wider text-[#666680] hover:text-[#00e5ff] flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={12} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROJECT HERO BANNER */}
      <section 
        className="w-full h-72 sm:h-96 flex items-center justify-center relative overflow-hidden border-b border-white/[0.07] select-none"
        style={{
          background: `linear-gradient(135deg, ${project.gradientFrom || 'rgba(255,92,0,0.15)'}, ${project.gradientTo || 'rgba(0,0,0,0.45)'})`
        }}
      >
        <div className="text-8xl sm:text-9xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10">
          {project.heroEmoji}
        </div>
        <div className="absolute inset-0 bg-grid-animated opacity-20 pointer-events-none" />
      </section>

      {/* 3. PROJECT DETAILS SECTION (#12121a) */}
      <section className="py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] bg-[#12121a] border-b border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 border rounded-full ${theme.text} ${theme.bg} ${theme.border}`}>
                // {project.category}
              </span>
              <span className="font-mono text-[10px] uppercase text-[#666680]">
                MISION_YEAR: {project.year}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-syne text-[#f0f0f0] tracking-tight leading-none">
              {project.title}
            </h1>

            {project.subtitle && (
              <p className="font-mono text-sm sm:text-base text-[#00e5ff] leading-relaxed max-w-[900px]">
                {project.subtitle}
              </p>
            )}

            <p className="font-mono text-xs sm:text-sm text-[#666680] leading-relaxed max-w-[1000px] mt-2">
              {project.description}
            </p>
          </div>

          {/* METADATA ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/[0.05]">
            <div className="bg-[#0a0a0f] border border-white/[0.07] p-5 rounded-[4px] flex items-start gap-4">
              <div className={`p-2.5 rounded ${theme.bg} ${theme.text}`}>
                <Cpu size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#666680] uppercase block">Role</span>
                <span className="font-mono text-xs text-[#f0f0f0] font-bold mt-1 block">{project.role}</span>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-white/[0.07] p-5 rounded-[4px] flex items-start gap-4">
              <div className={`p-2.5 rounded ${theme.bg} ${theme.text}`}>
                <Users size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#666680] uppercase block">Team</span>
                <span className="font-mono text-xs text-[#f0f0f0] font-bold mt-1 block">{project.team}</span>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-white/[0.07] p-5 rounded-[4px] flex items-start gap-4">
              <div className={`p-2.5 rounded ${theme.bg} ${theme.text}`}>
                <Calendar size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#666680] uppercase block">Timeline</span>
                <span className="font-mono text-xs text-[#f0f0f0] font-bold mt-1 block">{project.timeline}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC SIMULATION / SCHEMATIC VISUAL BLOCK (#0a0a0f) */}
      <section className="py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] bg-[#0a0a0f] border-b border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto w-full">
          <h2 className="text-xl font-bold font-syne text-[#f0f0f0] uppercase tracking-wider mb-8">
            // Instrumentation & Telemetry Readout
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              {renderVisualSchematic()}
            </div>
            <div className="lg:col-span-5 font-mono text-xs text-[#666680] leading-relaxed space-y-4">
              <h4 className="text-[#f0f0f0] font-bold uppercase text-[10px] tracking-widest">// Technical Analysis</h4>
              <p>
                In this mission component, we verified performance threshold boundaries by analyzing real-time data captures. 
                The layout highlights structural configurations that govern hardware nodes during telemetry cycles.
              </p>
              <p>
                By decoupling firmware processing loops from the data rendering client layers, we achieve low-latency logging speeds 
                that preserve diagnostic timestamps accurately.
              </p>
              <div className="border border-white/[0.05] p-4 rounded-[4px] bg-[#12121a]">
                <span className="text-[#00e5ff] block mb-1">Key Findings:</span>
                <ul className="list-disc list-inside space-y-1.5 text-[#f0f0f0]/70 text-[11px]">
                  <li>Zero signal package attenuation over RF links</li>
                  <li>Sensor logging latency clocking in at &lt; 5ms</li>
                  <li>Redundant recovery squib fires verified</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="flex items-center justify-between mt-16 pt-12 border-t border-white/[0.05]">
            {prevProject ? (
              <Link
                to={`/projects/${prevProject.slug}`}
                className="flex items-center gap-3 border border-white/[0.07] hover:border-[#ff5c00] p-4 rounded-[4px] bg-[#12121a] hover:bg-[#ff5c00]/5 transition-all text-left max-w-[45%]"
              >
                <ArrowLeft size={16} className="text-[#ff5c00]" />
                <div className="overflow-hidden hidden sm:block">
                  <span className="font-mono text-[9px] text-[#666680] uppercase block">← Previous Mission</span>
                  <span className="font-syne text-xs font-bold text-[#f0f0f0] truncate block mt-0.5">{prevProject.title}</span>
                </div>
                <div className="sm:hidden font-mono text-xs text-[#f0f0f0]">Prev</div>
              </Link>
            ) : (
              <div className="w-10 h-10" />
            )}

            {nextProject ? (
              <Link
                to={`/projects/${nextProject.slug}`}
                className="flex items-center gap-3 border border-white/[0.07] hover:border-[#00e5ff] p-4 rounded-[4px] bg-[#12121a] hover:bg-[#00e5ff]/5 transition-all text-right max-w-[45%]"
              >
                <div className="overflow-hidden hidden sm:block">
                  <span className="font-mono text-[9px] text-[#666680] uppercase block">Next Mission →</span>
                  <span className="font-syne text-xs font-bold text-[#f0f0f0] truncate block mt-0.5">{nextProject.title}</span>
                </div>
                <div className="sm:hidden font-mono text-xs text-[#f0f0f0]">Next</div>
                <ArrowRight size={16} className="text-[#00e5ff]" />
              </Link>
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
