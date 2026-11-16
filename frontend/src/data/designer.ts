export interface StatItem {
  id: string;
  number: string;
  label: string;
  color: 'orange' | 'cyan' | 'lime' | 'pink';
}

export interface DesignerInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    cv: string;
  };
  stats: StatItem[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export const DESIGNER_INFO: DesignerInfo = {
  name: "Sudhanshu Verma",
  title: "Software & Embedded Systems Engineer",
  bio: "I'm Sudhanshu Verma, a Software Engineer and Embedded Systems Engineer with a focus on building things end-to-end — from low-level firmware and custom PCB hardware to full-stack web platforms.\n\nI work across the full depth of the stack: writing C firmware for microcontrollers, designing PCBs in KiCad, and shipping production React + Node.js applications. I care about systems that are fast, reliable, and close to the metal.\n\nCurrently based in Seattle, WA. Open to freelance, contracts, and interesting engineering problems.",
  email: "Sudhanshu.Verma@stratos-code.io",
  socials: {
    github: "https://github.com/example-Sudhanshu",
    linkedin: "https://linkedin.com/in/example-Sudhanshu",
    twitter: "https://twitter.com/example-Sudhanshu",
    cv: "/cv.pdf"
  },
  stats: [
    {
      id: "stat-projects",
      number: "12+",
      label: "Projects Shipped",
      color: "orange"
    },
    {
      id: "stat-exp",
      number: "3+",
      label: "Years Experience",
      color: "cyan"
    },
    {
      id: "stat-pcbs",
      number: "8+",
      label: "PCBs Designed",
      color: "lime"
    },
    {
      id: "stat-prob",
      number: "∞",
      label: "Problems to Solve",
      color: "pink"
    }
  ],
  testimonial: {
    quote: "Sudhanshu has a rare, dual-brain capacity. He can design a high-frequency PCB stackup, write the interrupt handlers in C, and then spin up a beautiful real-time telemetry dashboard in React. His systems-first approach is incredibly rare.",
    author: "Dr. Marcus Vance",
    role: "Director of Embedded Systems Lab"
  }
};
