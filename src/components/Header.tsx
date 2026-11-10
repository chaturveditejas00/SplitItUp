import React from 'react';
import { Home, LayoutGrid, History, RefreshCw, Sparkles } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';
import { SplitText } from './react-bits/SplitText';

interface HeaderProps {
  activeTab: 'split' | 'groups' | 'history';
  setActiveTab: (tab: 'split' | 'groups' | 'history') => void;
  setHistoryFilter: (filter: string | null) => void;
  step: number;
  resetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  setHistoryFilter,
  step,
  resetAll,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'split' as const, icon: Home, label: 'Split' },
    { id: 'groups' as const, icon: LayoutGrid, label: 'Squads' },
    { id: 'history' as const, icon: History, label: 'History' },
  ];

  return (
    <header className="w-full mb-8 relative z-30">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center gap-6 py-2">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('split')}>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-serif italic text-4xl font-normal tracking-tight">
                <SplitText text="SplitItUp" delay={30} />
              </span>
              <span className="text-[#FE5101] dark:text-[#FE5101] text-3xl font-serif leading-none">.</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FE5101] animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                AI Expense Orchestrator
              </p>
            </div>
          </div>
        </div>

        {/* Center Nav Pills */}
        <nav className="glass p-1.5 rounded-full flex items-center gap-1 shadow-sm">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'history') setHistoryFilter(null);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-black text-white shadow-md shadow-black/10'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: Reset + Theme Switcher */}
        <div className="flex items-center gap-3">
          {activeTab === 'split' && step > 1 && (
            <button
              onClick={resetAll}
              className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[#FE5101] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full glass cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          )}

          <ThemeSwitcher />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center py-2">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('split')}>
          <h1 className="font-serif italic text-3xl font-normal tracking-tight">
            SplitItUp<span className="text-[#FE5101]">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'split' && step > 1 && (
            <button
              onClick={resetAll}
              className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 px-2.5 py-1 rounded-full glass"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
