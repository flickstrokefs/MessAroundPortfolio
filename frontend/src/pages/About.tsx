import React from 'react';
import { motion } from 'framer-motion';
import { DESIGNER_INFO } from '../data/designer';
import { SKILL_GROUPS } from '../data/skills';
import { StatCard } from '../components/StatCard';
import { SkillGroup } from '../components/SkillGroup';
import { Quote } from 'lucide-react';
import CircuitBackground from '../components/three/CircuitBackground';
import useReveal from '../hooks/useReveal';

export const About: React.FC = () => {
  const bioReveal = useReveal(0.05);
  const skillsReveal = useReveal(0.05);
  // Animation configurations (0.6s ease, 80ms stagger)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
  };

  return (
    <div className="w-full relative">
      <CircuitBackground />
      {/* 1. BIO & PROFILE SECTION (#0a0a0f) */}
      <section 
        ref={bioReveal.ref}
        className={`py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] bg-transparent border-b border-white/[0.05] relative z-10 section-enter ${bioReveal.isRevealed ? 'visible' : ''}`}
      >
        <div className="max-w-[1280px] mx-auto w-full">
          {/* HEADER */}
          <div className="border-b border-white/[0.05] pb-8 mb-12">
            <span className="font-mono text-xs text-[#666680] uppercase tracking-widest block mb-2">
              // 02 — Profile
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-syne text-[#f0f0f0]">
              Software & Embedded Systems Engineer
            </h1>
          </div>

          {/* TWO-COLUMN BIO AND STATS */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Bio Text (Left Column) */}
            <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-between">
              <div className="font-mono text-sm md:text-base text-[#666680] leading-relaxed space-y-6">
                <p>
                  I'm <strong className="text-[#f0f0f0] font-bold">Sudhanshu Verma</strong>, a Software Engineer and Embedded Systems Engineer with a focus on building things end-to-end — from low-level firmware and custom PCB hardware to full-stack web platforms.
                </p>
                <p>
                  I work across the full depth of the stack: writing C firmware for microcontrollers, designing PCBs in KiCad, and shipping production React + Node.js applications. I care about systems that are fast, reliable, and close to the metal.
                </p>
                <p>
                  Currently based in Seattle, WA. Open to freelance, contracts, and interesting engineering problems.
                </p>
              </div>

              {/* Testimonial Quote Card */}
              <div className="hidden lg:block mt-10 p-6 bg-[#12121a] border border-white/[0.07] rounded-[4px] relative overflow-hidden">
                <Quote size={40} className="absolute -top-3 -right-3 text-[#666680]/10 rotate-180" />
                <p className="font-syne italic text-sm text-[#f0f0f0] leading-relaxed mb-4">
                  "{DESIGNER_INFO.testimonial.quote}"
                </p>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#ff5c00]">
                  — {DESIGNER_INFO.testimonial.author}
                  <span className="text-[#666680] block text-[9px] normal-case mt-0.5">{DESIGNER_INFO.testimonial.role}</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid (Right Column) */}
            <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                {DESIGNER_INFO.stats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    number={stat.number}
                    label={stat.label}
                    color={stat.color}
                  />
                ))}
              </div>

              {/* Faint graphic layout underneath stats */}
              <div className="mt-8 border border-white/[0.07] p-5 rounded-[4px] font-mono text-[9px] text-[#666680] bg-[#12121a] relative overflow-hidden select-none">
                <div className="absolute top-2 right-2 text-[#00e5ff] uppercase animate-pulse">// SYSTEM_ONLINE</div>
                <div className="text-[#ff5c00] mb-1">=== COGNITIVE LOG MATRIX ===</div>
                <div>FLEET_NODES_ACTIVE:  2,048</div>
                <div>CPU_INTEGRITY_PEAK: 99.4%</div>
                <div>BANDWIDTH_OUTFLOW:  1.2 GB/S</div>
                <div>DB_REPLICATION_LAG: 1.2MS</div>
                <div className="mt-2 text-lime">GATEWAY CONNECTED [OK] // NET: 192.168.1.1 // GPS: 45.3921° N, 122.3812° W</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. MOBILE TESTIMONIAL (Only visible on mobile/tablet) */}
      <section className="block lg:hidden py-[2rem] px-[2rem] bg-[#12121a]/60 border-b border-white/[0.05] relative z-10">
        <div className="p-6 bg-[#0a0a0f] border border-white/[0.07] rounded-[4px] relative overflow-hidden">
          <Quote size={30} className="absolute -top-2 -right-2 text-[#666680]/10 rotate-180" />
          <p className="font-syne italic text-xs sm:text-sm text-[#f0f0f0] leading-relaxed mb-4">
            "{DESIGNER_INFO.testimonial.quote}"
          </p>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#ff5c00]">
            — {DESIGNER_INFO.testimonial.author}
            <span className="text-[#666680] block text-[9px] normal-case mt-0.5">{DESIGNER_INFO.testimonial.role}</span>
          </div>
        </div>
      </section>

      {/* 3. SKILLS SECTION (#12121a) */}
      <section 
        ref={skillsReveal.ref}
        className={`py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] bg-[#12121a]/70 border-b border-white/[0.05] relative z-10 section-enter ${skillsReveal.isRevealed ? 'visible' : ''}`}
      >
        <div className="max-w-[1280px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-xs text-[#666680] uppercase tracking-widest block mb-2">
              // Capabilities
            </span>
            <h2 className="text-3xl font-extrabold font-syne text-[#f0f0f0] mb-12">
              Specialized Skillsets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SKILL_GROUPS.map((group) => (
                <SkillGroup key={group.id} group={group} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
