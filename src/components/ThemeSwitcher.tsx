import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`relative inline-flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full glass border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
        isDark
          ? 'bg-white/5 border-white/10 text-white hover:border-[#FE5101]/50'
          : 'bg-black/5 border-black/10 text-slate-900 hover:border-[#E11D48]/50'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#FE5101]"
            >
              <Moon className="w-4 h-4 fill-[#FE5101]/20 stroke-[#FE5101]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#E11D48]"
            >
              <Sun className="w-4 h-4 fill-[#E11D48]/20 stroke-[#E11D48]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider select-none">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};
