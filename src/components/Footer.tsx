import React from 'react';
import { ArrowUpRight, Heart, Sparkles, Github, Instagram, ShieldCheck, Zap } from 'lucide-react';
import { Marquee } from './react-bits/Marquee';
import { useTheme } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const row1Items = [
    'AI RECEIPT SCANNER',
    'MINIMUM TRANSACTION GRAPH',
    'ITEM-BASED ASSIGNMENT',
    'PERCENTAGE SPLIT',
    'SQUAD SAVER',
    'EXPENSE LOGS',
    'ZERO MATHEMATICAL ERROR',
  ];

  const row2Items = [
    'SMART SETTLEMENTS',
    'CAMERA & DRAG-DROP PARSE',
    'REACT 19 + VITE',
    'TAILWIND CSS V4',
    'LOCAL STORAGE SYNC',
    'CONFETTI CELEBRATION',
    'LIGHT & DARK READY',
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)] pt-16 pb-28 md:pb-12 mt-20 transition-colors duration-300">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#FE5101]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Flowing Marquee Row 1 */}
      <div className="mb-4">
        <Marquee speed={32} pauseOnHover>
          <div className="flex items-center gap-8 py-2">
            {row1Items.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-[0.25em] text-[var(--text-muted)] hover:text-[#FE5101] transition-colors"
              >
                <span>{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FE5101]/50" />
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Flowing Marquee Row 2 (Reverse) */}
      <div className="mb-14 border-y border-[var(--border-color)] py-2 bg-black/[0.02] dark:bg-white/[0.02]">
        <Marquee speed={36} reverse pauseOnHover>
          <div className="flex items-center gap-8 py-1">
            {row2Items.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-[var(--text-muted)] hover:text-[#FF2A6D] transition-colors"
              >
                <span>{item}</span>
                <Sparkles className="w-3 h-3 text-[#FF2A6D]" />
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Main Large Typography Showcase */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-14">
        <div className="relative inline-block select-none group">
          <h2 className="font-serif italic text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none tracking-tight font-normal text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--text-muted)] opacity-90 transition-all duration-500 group-hover:scale-[1.01]">
            SplitItUp<span className="text-[#FE5101]">.</span>
          </h2>
          <p className="mt-3 text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Effortless Fair Settlements, Powered by AI
          </p>
        </div>
      </div>

      {/* Bottom Grid: Details & Credits */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-[var(--border-color)] items-center">
          {/* Col 1: Tech stack badges */}
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full glass border border-[var(--border-color)] text-[var(--text-muted)]">
              <Zap className="w-3 h-3 text-[#FE5101]" /> React 19
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full glass border border-[var(--border-color)] text-[var(--text-muted)]">
              <ShieldCheck className="w-3 h-3 text-[#FF2A6D]" /> Production Ready
            </span>
          </div>

          {/* Col 2: Author Credit */}
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Conceived & Crafted with <Heart className="w-3.5 h-3.5 inline text-[#FE5101] fill-[#FE5101]/20 -mt-0.5 mx-0.5" /> by
            </p>
            <a
              href="https://github.com/chaturveditejas00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text-primary)] hover:text-[#FE5101] transition-colors mt-1 group"
            >
              <span>Tejas Chaturvedi</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Col 3: Social & GitHub Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            <a
              href="https://www.instagram.com/tejas_chaturvedii27/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full glass border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#FF2A6D]/60 hover:text-[#FF2A6D] transition-all cursor-pointer shadow-sm group"
            >
              <Instagram className="w-3.5 h-3.5 text-[#FF2A6D] group-hover:scale-110 transition-transform" />
              <span>@tejas_chaturvedii27</span>
            </a>

            <a
              href="https://github.com/chaturveditejas00/SplitItUp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full glass border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[#FE5101]/50 hover:text-[#FE5101] transition-all cursor-pointer shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>SplitItUp</span>
            </a>
          </div>
        </div>

        {/* Legal / copyright line */}
        <div className="text-center pt-4 border-t border-[var(--border-color)]/50">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">
            © {new Date().getFullYear()} SplitItUp • All rights reserved • Designed for seamless bill splitting
          </p>
        </div>
      </div>
    </footer>
  );
};
