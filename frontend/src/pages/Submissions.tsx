import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, Clock, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        throw new Error('Failed to fetch from backend');
      }
    } catch (err: any) {
      console.warn('Backend server not running, using local storage/mock submissions:', err);
      setError('Backend database server offline. Showing mock telemetry data.');
      // Seed with some mock data for demo visual correctness
      setSubmissions([
        {
          id: "sub_demo_1",
          name: "Dr. Elizabeth Vance",
          email: "e.vance@blackmesa.org",
          subject: "Embedded Sensor Integration",
          message: "Loved your NeuroNode sensor module! Let me know if you are open to consulting on a custom STM32-based telemetry node array for our upcoming sensor network installation.",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "sub_demo_2",
          name: "Cade Yeager",
          email: "cade@yeager-innovations.io",
          subject: "ESP32 Mesh Networking Query",
          message: "Saw your IoT dashboard project. How are you dealing with packet loss during low-power ESP-NOW sleep states? Let's chat over email.",
          createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <div className="w-full">
      {/* 1. HEADER & OVERVIEW SECTION (#0a0a0f) */}
      <section className="py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] bg-[#0a0a0f] border-b border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-8 border-b border-white/[0.05]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-[#666680] uppercase tracking-widest">
                  // Admin Panel
                </span>
                <span className="flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-[#b8ff00]/30 bg-[#b8ff00]/5 text-[#b8ff00]">
                  <ShieldCheck size={10} /> Local Db Locked
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold font-syne text-[#f0f0f0]">
                Database Logs
              </h1>
            </div>

            {/* REFRESH ACTION */}
            <button
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="flex items-center gap-2 border border-[#b8ff00] hover:bg-[#b8ff00]/10 text-[#b8ff00] font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-[2px] transition-all duration-300 hover:shadow-[0_0_12px_rgba(184,255,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 cursor-pointer w-fit"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Syncing...' : 'Sync Logs'}
            </button>
          </div>

          {/* ERROR NOTICE (If backend is offline) */}
          {error && (
            <div className="mt-8 p-4 bg-[#ff2d78]/10 border border-[#ff2d78]/30 rounded text-[#ff2d78] text-xs font-mono flex items-center gap-2.5">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#12121a] border border-white/[0.07] p-4 rounded-[4px] flex flex-col">
              <span className="font-mono text-[10px] text-[#666680] uppercase">Total Logs Recv</span>
              <span className="font-syne text-2xl font-bold text-[#ff5c00] mt-1">{submissions.length}</span>
            </div>
            <div className="bg-[#12121a] border border-white/[0.07] p-4 rounded-[4px] flex flex-col">
              <span className="font-mono text-[10px] text-[#666680] uppercase">DB File Target</span>
              <span className="font-mono text-xs text-[#00e5ff] mt-2 truncate">backend/data.json</span>
            </div>
            <div className="bg-[#12121a] border border-white/[0.07] p-4 rounded-[4px] flex flex-col">
              <span className="font-mono text-[10px] text-[#666680] uppercase">Connection Status</span>
              <span className={`font-mono text-xs mt-2 uppercase ${error ? 'text-[#ff2d78]' : 'text-[#b8ff00]'}`}>
                ● {error ? 'Offline (Simulated Mode)' : 'Online (Active)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DATA LOG LIST (#12121a) */}
      <section className="py-[4rem] px-[2rem] md:py-[6rem] md:px-[4rem] bg-[#12121a] border-b border-white/[0.05]">
        <div className="max-w-[1280px] mx-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 font-mono text-sm text-[#666680] gap-3">
              <RefreshCw size={24} className="animate-spin text-[#ff5c00]" />
              <span>Decrypting database nodes...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="border border-white/[0.07] bg-[#0a0a0f] rounded-[4px] p-12 text-center flex flex-col items-center justify-center">
              <Terminal size={40} className="text-[#666680] mb-4" />
              <p className="font-mono text-sm text-[#666680] mb-2">No contact submissions found in database.</p>
              <p className="font-mono text-xs text-[#666680]/60">Submit a transmission on the contact form to write logs to data.json.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {submissions.map((sub, idx) => (
                <motion.div
                  key={sub.id}
                  variants={cardVariants}
                  className="bg-[#0a0a0f] border border-white/[0.07] hover:border-[#00e5ff]/30 p-6 rounded-[4px] transition-colors flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Console overlay */}
                  <div className="absolute top-0 right-0 w-24 h-6 bg-[#00e5ff]/5 border-l border-b border-white/[0.07] flex items-center justify-center select-none pointer-events-none">
                    <span className="font-mono text-[8px] text-[#00e5ff]/60 tracking-widest">LOG #{submissions.length - idx}</span>
                  </div>

                  {/* Sub Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.07] pb-4 mb-4 gap-2">
                    <div>
                      <h3 className="font-syne text-lg font-bold text-[#00e5ff]">
                        {sub.name}
                      </h3>
                      <a
                        href={`mailto:${sub.email}`}
                        className="font-mono text-xs text-[#ff5c00] hover:text-[#b8ff00] flex items-center gap-1.5 mt-1 transition-colors w-fit"
                      >
                        <Mail size={12} />
                        {sub.email}
                      </a>
                    </div>
                    <div className="font-mono text-[10px] text-[#666680] flex items-center gap-1.5 self-start sm:self-center">
                      <Clock size={12} />
                      {formatDate(sub.createdAt)}
                    </div>
                  </div>

                  {/* Sub Subject & Message */}
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#666680] uppercase tracking-wider block">Subject:</span>
                      <span className="font-mono text-sm text-[#f0f0f0] font-bold">{sub.subject}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#666680] uppercase tracking-wider block mb-1">Message:</span>
                      <div className="bg-[#12121a] border border-white/[0.05] p-4 rounded-[4px] font-mono text-xs text-[#f0f0f0]/90 leading-relaxed whitespace-pre-wrap">
                        {sub.message}
                      </div>
                    </div>
                  </div>

                  {/* Log hash ID */}
                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between font-mono text-[8px] text-[#666680]">
                    <span>LOG_ID: {sub.id}</span>
                    <span>CIPHER: AES-256-TELEMETRY</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Submissions;
