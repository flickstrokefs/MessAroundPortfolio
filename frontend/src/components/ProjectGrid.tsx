import React from 'react';
import type { Project } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  // Container variants for staggered entrance (80ms stagger)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // Item variants (0.6s duration, easeOut)
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid gap-[1.5rem] w-full"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          variants={itemVariants}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
