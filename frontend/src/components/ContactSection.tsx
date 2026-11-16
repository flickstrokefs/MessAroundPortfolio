import React, { useState } from 'react';
import { FileText, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { DESIGNER_INFO } from '../data/designer';
import ContactGrid from './three/ContactGrid';
import useReveal from '../hooks/useReveal';

export const ContactSection: React.FC = () => {
  const { ref, isRevealed } = useReveal(0.05);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Server error. Please try again.');
    }
  };

  const socialLinks = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      url: DESIGNER_INFO.socials.github,
      label: 'GitHub'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764 0-.973.784-1.763 1.75-1.763s1.75.79 1.75 1.763c0 .974-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
      url: DESIGNER_INFO.socials.linkedin,
      label: 'LinkedIn'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: DESIGNER_INFO.socials.twitter,
      label: 'Twitter'
    },
    { icon: <FileText size={20} />, url: DESIGNER_INFO.socials.cv, label: 'CV' }
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className={`py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] flex flex-col items-center justify-center border-t border-[#666680]/15 w-full bg-transparent relative overflow-hidden section-enter ${isRevealed ? 'visible' : ''}`}
    >
      <ContactGrid />
      <div className="w-full max-w-[650px] text-center relative z-10">
        {/* SECTION LABEL */}
        <span className="font-mono text-xs text-[#666680] uppercase tracking-widest block mb-4">
          // 03 — Get In Touch
        </span>

        {/* HEADING */}
        <h2 className="text-4xl sm:text-5xl font-extrabold font-syne text-[#f0f0f0] tracking-tight mb-6">
          Let's Build Something
        </h2>

        {/* CLICKABLE EMAIL */}
        <div className="mb-12">
          <a
            href={`mailto:${DESIGNER_INFO.email}`}
            className="text-lg sm:text-2xl font-mono text-[#ff5c00] hover:text-[#00e5ff] border-b-2 border-[#ff5c00] hover:border-[#00e5ff] pb-1 transition-all duration-300 inline-block tracking-tight"
          >
            {DESIGNER_INFO.email}
          </a>
        </div>

        {/* INTERACTIVE FORM */}
        <form onSubmit={handleSubmit} className="bg-[#12121a] border border-white/[0.07] p-6 sm:p-8 rounded-[4px] text-left mb-10 shadow-2xl">
          <h3 className="font-mono text-[0.7rem] tracking-[3px] text-[#666680] uppercase mb-6 pb-2 border-b border-white/[0.05] font-bold">
            // GET IN TOUCH
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* NAME */}
            <div>
              <label htmlFor="name" className="block font-mono text-[0.7rem] tracking-[3px] text-[#666680] uppercase mb-1.5">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Commander Shepard"
                className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[2px] px-3 py-2 text-xs font-mono text-[#f0f0f0] focus:outline-none focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]/15 transition-all"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block font-mono text-[0.7rem] tracking-[3px] text-[#666680] uppercase mb-1.5">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="shepard@alliance.mil"
                className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[2px] px-3 py-2 text-xs font-mono text-[#f0f0f0] focus:outline-none focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]/15 transition-all"
                required
              />
            </div>
          </div>

          {/* SUBJECT */}
          <div className="mb-4">
            <label htmlFor="subject" className="block font-mono text-[0.7rem] tracking-[3px] text-[#666680] uppercase mb-1.5">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Embedded device project"
              className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[2px] px-3 py-2 text-xs font-mono text-[#f0f0f0] focus:outline-none focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]/15 transition-all"
            />
          </div>

          {/* MESSAGE */}
          <div className="mb-6">
            <label htmlFor="message" className="block font-mono text-[0.7rem] tracking-[3px] text-[#666680] uppercase mb-1.5">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your project requirements..."
              className="w-full bg-white/[0.04] border border-white/[0.12] rounded-[2px] px-3 py-2 text-xs font-mono text-[#f0f0f0] focus:outline-none focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]/15 transition-all resize-none"
              required
            />
          </div>

          {/* FEEDBACK STATUS */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-[#b8ff00]/10 border border-[#b8ff00]/30 rounded text-[#b8ff00] text-xs font-mono flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Transmission sent! View database records on the Submissions route.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-[#ff2d78]/10 border border-[#ff2d78]/30 rounded text-[#ff2d78] text-xs font-mono flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#ff5c00] hover:bg-[#ff7733] text-[#000000] font-mono text-xs uppercase tracking-[2px] py-[0.9rem] rounded-[2px] border-none font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,92,0,0.4)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {status === 'loading' ? (
              'Transmitting Data...'
            ) : (
              <>
                <Send size={14} />
                SEND MESSAGE →
              </>
            )}
          </button>
        </form>

        {/* SOCIAL LINKS ROW */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-[10px] text-[#666680] uppercase tracking-widest mb-4">
            // External Channels
          </span>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded border border-[#666680]/30 hover:border-[#00e5ff] text-[#666680] hover:text-[#00e5ff] hover:shadow-[0_0_10px_rgba(0,229,255,0.2)] bg-[#12121a] flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
