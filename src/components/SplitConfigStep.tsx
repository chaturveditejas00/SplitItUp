import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Scale, Percent, ListChecks } from 'lucide-react';
import { BillItem, Person, SplitMode, Assignment } from '../types';
import { SpotlightCard } from './react-bits/SpotlightCard';
import { MagneticButton } from './react-bits/MagneticButton';
import { BlurText } from './react-bits/BlurText';

interface SplitConfigStepProps {
  items: BillItem[];
  people: Person[];
  splitMode: SplitMode;
  setSplitMode: (mode: SplitMode) => void;
  payerId: string | null;
  setPayerId: (id: string) => void;
  assignments: Assignment[];
  toggleAssignment: (itemId: string, personId: string) => void;
  percentages: Record<string, number>;
  updatePercentage: (personId: string, val: number) => void;
  totalAmount: number;
  onNext: () => void;
  onBack: () => void;
}

export const SplitConfigStep: React.FC<SplitConfigStepProps> = ({
  items,
  people,
  splitMode,
  setSplitMode,
  payerId,
  setPayerId,
  assignments,
  toggleAssignment,
  percentages,
  updatePercentage,
  totalAmount,
  onNext,
  onBack,
}) => {
  const modes: { id: SplitMode; label: string; icon: any; desc: string }[] = [
    { id: 'equal', label: 'Equal Split', icon: Scale, desc: 'Evenly divide total among everyone' },
    { id: 'item', label: 'By Item', icon: ListChecks, desc: 'Assign each person to items they consumed' },
    { id: 'percentage', label: 'Percentage', icon: Percent, desc: 'Custom percentage per person' },
  ];

  const totalPercentage: number = (Object.values(percentages) as (number | undefined)[]).reduce<number>(
    (a, b) => a + (Number(b) || 0),
    0
  );
  const isPercentValid = Math.abs(totalPercentage - 100) < 0.1;

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col max-w-3xl mx-auto w-full gap-8"
    >
      {/* Editorial Header */}
      <div className="text-center space-y-2">
        <h2 className="font-serif italic text-4xl sm:text-5xl font-normal text-[var(--text-primary)]">
          <BlurText text="How should it be split?" />
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Choose a calculation strategy and confirm who paid upfront.
        </p>
      </div>

      {/* Mode Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => {
          const isSelected = splitMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSplitMode(m.id)}
              className={`p-4 rounded-2xl glass border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-[#FE5101] bg-[#FE5101]/10 ring-1 ring-[#FE5101] shadow-lg shadow-[#FE5101]/10'
                  : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <m.icon
                  className={`w-5 h-5 ${
                    isSelected ? 'text-[#FE5101]' : 'text-[var(--text-muted)]'
                  }`}
                />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#FE5101] shadow-sm shadow-[#FE5101]" />
                )}
              </div>
              <div>
                <span className="font-bold text-sm block text-[var(--text-primary)]">
                  {m.label}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block leading-tight">
                  {m.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Who Paid Card */}
      <SpotlightCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FE5101] block">
              Payer Selection
            </span>
            <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
              Who picked up the tab?
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Select the person who paid the upfront amount of ₹{totalAmount.toFixed(0)}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {people.map((p) => {
              const isPayer = payerId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPayerId(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isPayer
                      ? 'bg-[#FE5101] border-[#FE5101] text-white shadow-md shadow-[#FE5101]/20'
                      : 'glass border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPayer ? 'bg-white' : p.color.split(' ')[0]
                    }`}
                  />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </SpotlightCard>

      {/* Mode Details Section */}
      <div className="space-y-4">
        {splitMode === 'equal' && (
          <div className="space-y-4">
            <div className="text-center py-6 glass-card rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block">
                Total Bill Amount
              </span>
              <span className="font-serif italic text-5xl sm:text-6xl text-[var(--text-primary)] block mt-1">
                ₹{totalAmount.toFixed(0)}
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-1 block">
                Split equally among {people.length} people
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {people.map((p) => (
                <div
                  key={p.id}
                  className="glass-card p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center font-bold text-xs`}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-[var(--text-primary)]">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-base text-[#FE5101]">
                    ₹{(totalAmount / people.length).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {splitMode === 'item' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-black">
                Assign Line Items
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Click avatars to assign/unassign
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {items.map((item) => {
                const assignedIds =
                  assignments.find((a) => a.itemId === item.id)?.personIds || [];

                return (
                  <SpotlightCard key={item.id} className="p-4 flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-sm text-[#FE5101]">
                        ₹{item.amount}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {people.map((p) => {
                        const isActive = assignedIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => toggleAssignment(item.id, p.id)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                              isActive
                                ? `${p.color} ring-2 ring-[#FE5101] scale-105 shadow-sm`
                                : 'bg-[var(--chip-bg)] text-[var(--text-muted)] opacity-50 hover:opacity-100'
                            }`}
                            title={p.name}
                          >
                            {p.name.charAt(0).toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        )}

        {splitMode === 'percentage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-black">
                Custom Percentages
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  isPercentValid ? 'text-emerald-500' : 'text-[#FE5101]'
                }`}
              >
                Total: {totalPercentage.toFixed(0)}% / 100%
              </span>
            </div>

            <div className="space-y-3">
              {people.map((p) => {
                const pct = percentages[p.id] || 0;
                const owed = (totalAmount * pct) / 100;
                return (
                  <div key={p.id} className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center font-bold text-xs`}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={pct || ''}
                          onChange={(e) => updatePercentage(p.id, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-[var(--chip-bg)] border border-[var(--border-color)] focus:border-[#FE5101] rounded-lg text-right font-mono font-bold text-sm p-1.5 outline-none"
                        />
                        <span className="text-xs text-[var(--text-muted)] font-mono">%</span>
                        <span className="text-xs font-mono font-bold text-[#FE5101] w-20 text-right">
                          ₹{owed.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 glass border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <MagneticButton
          onClick={onNext}
          disabled={splitMode === 'percentage' && !isPercentValid}
          className="flex-[2] bg-[var(--text-primary)] text-[var(--bg-main)] font-black text-xs uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Calculate Settlements</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    </motion.div>
  );
};
