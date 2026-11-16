import React, { useEffect, useState } from 'react';
import { ProjectGrid } from '../components/ProjectGrid';
import { DEFAULT_PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroParticles from '../components/three/HeroParticles';
import OrbitScene from '../components/three/OrbitScene';
import ProjectsParticles from '../components/three/ProjectsParticles';
import SystemReadout from '../components/SystemReadout';
import useReveal from '../hooks/useReveal';

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const heroReveal = useReveal(0.05);
  const projectsReveal = useReveal(0.08);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setProjects(data);
            return;
          }
        }
        setProjects(DEFAULT_PROJECTS);
      } catch (err) {
        console.warn('Backend server not running, using static fallback projects:', err);
        setProjects(DEFAULT_PROJECTS);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const heroBadgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.15, ease: "easeOut" as const }
    })
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section 
        ref={heroReveal.ref}
        className={`relative min-h-[calc(100vh-64px)] min-[900px]:min-h-screen flex items-center justify-between py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] overflow-hidden border-b border-[#666680]/10 bg-[#0a0a0f] section-enter ${heroReveal.isRevealed ? 'visible' : ''}`}
      >
        {/* Hero Background Three.js Particle Canvas */}
        <HeroParticles />

        {/* Faint Background Radial Glow */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff5c00]/5 blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] rounded-full bg-[#00e5ff]/5 blur-[100px] -z-10 pointer-events-none" />

        {/* Hero Left Content */}
        <div className="max-w-[850px] z-10 flex flex-col items-start text-left">
          {/* Availability Badge */}
          <motion.div
            variants={heroBadgeVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 border border-[#ff5c00]/40 bg-[#ff5c00]/5 text-[#ff5c00] px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff5c00] animate-pulse" />
            // Available for projects
          </motion.div>

          {/* Large Name */}
          <motion.h1
            custom={1}
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            className="text-[9vw] sm:text-[7vw] lg:text-[5.8vw] min-[1400px]:text-[88px] font-extrabold font-syne uppercase tracking-tighter leading-[0.88] mb-6 select-none"
          >
            <span className="text-[#f0f0f0]">Sudhanshu</span> <br />
            <span className="text-[#ff5c00]">Verma</span><span className="text-[#00e5ff]">.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            className="font-mono text-sm md:text-base text-[#666680] leading-relaxed max-w-[620px] mb-8"
          >
            Full-Stack Developer & Embedded Systems Engineer building production-grade software and custom hardware from the ground up — firmware to frontend.
          </motion.p>

          {/* Specialty Badge Row */}
          <motion.div
            custom={3}
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-[0.75rem] w-auto max-w-full justify-start items-center mb-10"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[1.5px] py-[0.4rem] px-[1rem] border border-[#ff5c00] bg-[#ff5c00]/8 text-[#ff5c00] rounded-full">
              &lt;SOFTWARE ENGINEER&gt;
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[1.5px] py-[0.4rem] px-[1rem] border border-[#00e5ff] bg-[#00e5ff]/8 text-[#00e5ff] rounded-full">
              [EMBEDDED SYSTEMS]
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={4}
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-[1.2rem] w-auto"
          >
            <button
              onClick={() => scrollToSection('work')}
              className="bg-[#ff5c00] hover:bg-[#ff7733] text-[#000000] font-mono text-[0.72rem] uppercase tracking-[1.5px] py-[0.8rem] px-[1.5rem] rounded-[2px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 text-center font-bold flex items-center justify-center gap-2 group cursor-pointer border-none inline-flex w-auto"
            >
              View Projects
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/contact"
              className="border border-[#00e5ff] bg-transparent hover:bg-[#00e5ff]/10 text-[#00e5ff] font-mono text-[0.72rem] uppercase tracking-[1.5px] py-[0.8rem] px-[1.5rem] rounded-[2px] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 text-center inline-flex items-center justify-center w-auto cursor-pointer no-underline"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>

        {/* Hero Right Graphics */}
        <OrbitScene />

        {/* Subtle Vertical Text on Hero Edge */}
        <div className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 select-none pointer-events-none hidden min-[900px]:block [writing-mode:vertical-rl] [text-orientation:mixed] font-mono text-[0.65rem] text-[#ff5c00]/25 tracking-[3px] uppercase">
          SUDHANSHU_VERMA.DEV // v2.0.26 // SW_AND_EMBEDDED
        </div>
      </section>

      {/* Live System Readout Strip */}
      <SystemReadout />

      {/* Currently Building Marquee Bar */}
      <div className="w-full h-10 bg-[#ff5c00] overflow-hidden flex items-center select-none z-10 relative">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="font-mono text-[0.72rem] font-bold text-black tracking-[2px] uppercase">
            ⚡ CURRENTLY BUILDING — NEURONODE STM32 MODULE  ·  SYNAPSE DISTRIBUTED ORCHESTRATOR  ·  THIS PORTFOLIO  ·  SOMETHING CLASSIFIED  ·  &nbsp;
          </span>
          <span className="font-mono text-[0.72rem] font-bold text-black tracking-[2px] uppercase">
            ⚡ CURRENTLY BUILDING — NEURONODE STM32 MODULE  ·  SYNAPSE DISTRIBUTED ORCHESTRATOR  ·  THIS PORTFOLIO  ·  SOMETHING CLASSIFIED  ·  &nbsp;
          </span>
        </div>
      </div>

      {/* 2. PROJECT GRID SECTION */}
      <section 
        id="work" 
        ref={projectsReveal.ref}
        className={`py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] border-b border-[#666680]/10 bg-[#12121a] relative overflow-hidden section-enter ${projectsReveal.isRevealed ? 'visible' : ''}`}
      >
        <ProjectsParticles />
        <div className="max-w-[1280px] mx-auto w-full relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="font-mono text-xs text-[#666680] uppercase tracking-widest block mb-2">
                // 03 — PROJECTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-[#f0f0f0]">
                Things I've Built
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'software', label: 'Software' },
                { id: 'iot', label: 'IoT' },
                { id: 'embedded', label: 'Embedded' },
                { id: 'hardware', label: 'Hardware' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`font-mono text-[0.72rem] uppercase tracking-[2px] py-[0.4rem] px-[1rem] rounded-[2px] cursor-pointer transition-all duration-250 ${activeCategory === cat.id
                    ? 'bg-[#ff5c00] text-[#000000] font-bold border-none'
                    : 'bg-transparent border border-white/10 text-[#666680] hover:text-[#00e5ff] hover:border-[#00e5ff]/50'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Project Grid */}
          <ProjectGrid projects={filteredProjects} />
        </div>
      </section>
    </div>
  );
};

export default Home;
