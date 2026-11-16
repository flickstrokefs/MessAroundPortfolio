import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DESIGNER_INFO } from '../../data/designer';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Work', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Submissions', path: '/submissions' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      url: DESIGNER_INFO.socials.github,
      label: 'GitHub'
    },
    {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764 0-.973.784-1.763 1.75-1.763s1.75.79 1.75 1.763c0 .974-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
      url: DESIGNER_INFO.socials.linkedin,
      label: 'LinkedIn'
    },
    {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: DESIGNER_INFO.socials.twitter,
      label: 'Twitter'
    },
    { icon: <FileText size={18} />, url: DESIGNER_INFO.socials.cv, label: 'CV' }
  ];



  return (
    <>
      {/* MOBILE HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#12121a] border-b border-[#666680]/30 flex items-center justify-between px-6 z-50 min-[900px]:hidden">
        <Link to="/" className="text-xl font-bold uppercase font-syne text-[#ff5c00] tracking-wide" onClick={closeMenu}>
          S. Verma
        </Link>
        <button
          onClick={toggleMenu}
          className="text-[#f0f0f0] hover:text-[#00e5ff] transition-colors p-1"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
 
      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 bg-[#0a0a0f] z-40 flex flex-col justify-between p-8 min-[900px]:hidden"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `font-mono text-lg uppercase tracking-widest transition-colors ${isActive ? 'text-[#ff5c00] font-bold active-nav-glow' : 'text-[#666680] hover:text-[#00e5ff]'
                    }`
                  }
                  end
                >
                  // {link.name}
                </NavLink>
              ))}

            </nav>
 
            <div className="flex flex-col gap-6 border-t border-[#666680]/20 pt-6">
              <div className="grid grid-cols-2 gap-[0.5rem] w-full">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#666680] hover:text-[#00e5ff] transition-all p-2 flex items-center justify-center border border-white/[0.05] hover:border-[#00e5ff]/30 rounded bg-[#12121a] h-10"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-center font-mono text-xs text-[#666680]">
                © {new Date().getFullYear()} Sudhanshu Verma
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed top-0 left-0 bottom-0 w-[180px] bg-[#12121a] border-r border-[#666680]/30 hidden min-[900px]:flex flex-col justify-between p-6 z-30">
        {/* LOGO */}
        <div className="pt-4">
          <Link to="/" className="block group">
            <span className="logo-font text-lg uppercase tracking-wider text-[#ff5c00] block leading-none">
              Sudhanshu
            </span>
            <span className="logo-font text-xl uppercase tracking-widest text-[#ff5c00] block mt-1.5 leading-none font-extrabold group-hover:text-[#00e5ff] transition-colors duration-300">
              Verma
            </span>
            <span className="font-mono text-[9px] text-[#666680] mt-2 block tracking-wider">
              // SW & EMBEDDED ENG
            </span>
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-4 my-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-mono text-[0.78rem] tracking-[2px] py-[0.3rem] uppercase transition-all duration-250 block ${isActive
                  ? 'text-[#ff5c00] font-bold active-nav-glow'
                  : 'text-[#666680] hover:text-[#00e5ff]'
                }`
              }
              end
            >
              {link.name}
            </NavLink>
          ))}

        </nav>

        {/* SOCIAL LINKS / FOOTER */}
        <div className="flex flex-col gap-4 border-t border-white/[0.05] pt-4 items-center w-full">
          <div className="grid grid-cols-2 gap-[0.5rem] w-full">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666680] hover:text-[#00e5ff] transition-all p-2 flex items-center justify-center border border-white/[0.05] hover:border-[#00e5ff]/30 rounded bg-[#0a0a0f] hover:translate-y-[-2px] duration-250 h-10 w-full"
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="font-mono text-[0.65rem] text-[#666680] text-center mt-2 leading-tight">
            © {new Date().getFullYear()} Sudhanshu Verma
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
