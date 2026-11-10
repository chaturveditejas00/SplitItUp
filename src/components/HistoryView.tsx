import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Trash2, CheckCircle2, Clock, Calendar, ArrowRight, Filter, X } from 'lucide-react';
import { HistoryItem, Group } from '../types';
import { SpotlightCard } from './react-bits/SpotlightCard';
import { BlurText } from './react-bits/BlurText';

interface HistoryViewProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  groups: Group[];
  historyFilter: string | null;
  setHistoryFilter: (id: string | null) => void;
  onStartNew: () => void;
  setToast: (toast: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  setHistory,
  groups,
  historyFilter,
  setHistoryFilter,
  onStartNew,
  setToast,
}) => {
  const filteredHistory = historyFilter
    ? history.filter((item) => item.groupId === historyFilter)
    : history;

  const stats = React.useMemo(() => {
    let settled = 0;
    let pending = 0;

    history.forEach((h) => {
      h.settlements.forEach((s) => {
        if (s.isPaid) settled += s.amount;
        else pending += s.amount;
      });
    });

    return { settled, pending, totalBills: history.length };
  }, [history]);

  const toggleSettlementPaid = (historyId: string, settlementIdx: number) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item.id !== historyId) return item;
        const updatedSettlements = [...item.settlements];
        const current = updatedSettlements[settlementIdx];
        updatedSettlements[settlementIdx] = {
          ...current,
          isPaid: !current.isPaid,
        };
        return { ...item, settlements: updatedSettlements };
      })
    );
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    setToast('History entry deleted');
  };

  const activeGroup = groups.find((g) => g.id === historyFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col gap-8 max-w-4xl mx-auto w-full"
    >
      {/* Header & Filter Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-[var(--border-color)]">
        <div>
          <h2 className="font-serif italic text-4xl sm:text-5xl font-normal text-[var(--text-primary)]">
            <BlurText text="Settlement History" />
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {activeGroup
                ? `Filtered by squad: "${activeGroup.name}"`
                : 'All recorded past settlements'}
            </p>
            {historyFilter && (
              <button
                onClick={() => setHistoryFilter(null)}
                className="text-[10px] font-bold uppercase tracking-wider text-[#FE5101] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="glass-card px-4 py-2.5 rounded-xl border border-[var(--border-color)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block">
              Settled
            </span>
            <span className="font-mono font-bold text-base text-emerald-500">
              ₹{stats.settled.toFixed(0)}
            </span>
          </div>

          <div className="glass-card px-4 py-2.5 rounded-xl border border-[var(--border-color)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block">
              Pending
            </span>
            <span className="font-mono font-bold text-base text-[#FE5101]">
              ₹{stats.pending.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-[2rem] border border-dashed border-[var(--border-color)] space-y-4">
            <History className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              No settlements logged yet
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Whenever you settle a bill on the Split tab, click &ldquo;Save History&rdquo; to keep track of payments.
            </p>
            <button
              onClick={onStartNew}
              className="bg-[#FE5101] hover:bg-[#FE5101]/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Split a Bill Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHistory.map((item) => (
              <SpotlightCard key={item.id} className="p-5 flex flex-col justify-between gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="font-bold text-[#FE5101]">{item.mode} split</span>
                    </div>
                    <div className="font-serif italic text-3xl font-normal text-[var(--text-primary)] mt-1">
                      ₹{item.total.toFixed(0)}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--chip-bg)] px-2 py-0.5 rounded-full">
                    {item.peopleCount} People
                  </span>
                </div>

                {/* Settlements checklist */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                  {item.settlements.map((s, idx) => {
                    const fromPerson = item.people?.find((p) => p.id === s.from);
                    const toPerson = item.people?.find((p) => p.id === s.to);

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          s.isPaid
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-[var(--text-muted)]'
                            : 'bg-[var(--chip-bg)] border-[var(--border-color)] text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={s.isPaid ? 'line-through' : 'font-bold'}>
                            {fromPerson?.name || 'Someone'} → {toPerson?.name || 'Someone'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono font-bold ${
                              s.isPaid ? 'text-emerald-500' : 'text-[#FE5101]'
                            }`}
                          >
                            ₹{s.amount}
                          </span>

                          <button
                            onClick={() => toggleSettlementPaid(item.id, idx)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                              s.isPaid
                                ? 'bg-emerald-500/20 text-emerald-500'
                                : 'bg-[var(--chip-bg)] text-[var(--text-muted)] hover:text-[#FE5101]'
                            }`}
                          >
                            {s.isPaid ? 'Paid' : 'Mark Paid'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delete history record */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Entry</span>
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
