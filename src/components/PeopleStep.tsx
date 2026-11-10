import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Trash2, ArrowLeft, ArrowRight, Sparkles, FolderDown } from 'lucide-react';
import { Person, Group } from '../types';
import { SpotlightCard } from './react-bits/SpotlightCard';
import { MagneticButton } from './react-bits/MagneticButton';
import { BlurText } from './react-bits/BlurText';

interface PeopleStepProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  groups: Group[];
  loadGroup: (group: Group) => void;
  onNext: () => void;
  onBack: () => void;
}

const AVATAR_COLORS = [
  'bg-emerald-500 text-slate-950',
  'bg-rose-500 text-white',
  'bg-amber-500 text-slate-950',
  'bg-cyan-500 text-slate-950',
  'bg-purple-500 text-white',
  'bg-blue-500 text-white',
  'bg-pink-500 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-500 text-slate-950',
  'bg-orange-500 text-slate-950',
];

export const PeopleStep: React.FC<PeopleStepProps> = ({
  people,
  setPeople,
  groups,
  loadGroup,
  onNext,
  onBack,
}) => {
  const [newName, setNewName] = useState('');

  const addPerson = () => {
    if (!newName.trim()) return;
    const color = AVATAR_COLORS[people.length % AVATAR_COLORS.length];
    const newPerson: Person = {
      id: Math.random().toString(36).substring(7),
      name: newName.trim(),
      color,
    };
    setPeople((prev) => [...prev, newPerson]);
    setNewName('');
  };

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col max-w-2xl mx-auto w-full gap-8"
    >
      {/* Editorial Header */}
      <div className="text-center space-y-2">
        <h2 className="font-serif italic text-4xl sm:text-5xl font-normal text-[var(--text-primary)]">
          <BlurText text="Who's sharing this bill?" />
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Add the people involved or quickly import a saved squad.
        </p>
      </div>

      {/* Quick Load Squads */}
      {groups.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 px-1">
            <FolderDown className="w-3.5 h-3.5 text-[#FE5101]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              Quick Load Squad
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => loadGroup(group)}
                className="px-3.5 py-2 rounded-full glass border border-[var(--border-color)] hover:border-[#FE5101]/50 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#FE5101]" />
                <span>{group.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] bg-[var(--chip-bg)] px-1.5 py-0.5 rounded-full font-mono">
                  {group.people.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Person Input Card */}
      <SpotlightCard className="p-5 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addPerson();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name (e.g., Alex, Priya, Sam)..."
              className="w-full bg-[var(--chip-bg)] border border-[var(--border-color)] focus:border-[#FE5101] text-[var(--text-primary)] text-sm sm:text-base rounded-xl px-4 py-3 placeholder:text-[var(--text-muted)]/50 outline-none transition-colors"
            />
          </div>
          <MagneticButton
            type="submit"
            disabled={!newName.trim()}
            className="bg-[#FE5101] hover:bg-[#FE5101]/90 text-white font-bold px-6 rounded-xl flex items-center gap-2 text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </MagneticButton>
        </form>
      </SpotlightCard>

      {/* People Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-black">
            Participants ({people.length})
          </span>
          {people.length > 0 && (
            <span className="text-[11px] text-[var(--text-muted)]">
              Minimum 2 required to split
            </span>
          )}
        </div>

        {people.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-xs">
            No people added yet. Type a name above or select a squad.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {people.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-3.5 glass-card rounded-2xl group hover:border-[#FE5101]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${person.color} flex items-center justify-center font-bold text-xs shadow-sm`}
                    >
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-[var(--text-primary)]">
                      {person.name}
                    </span>
                  </div>

                  <button
                    onClick={() => removePerson(person.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
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
          disabled={people.length < 2}
          className="flex-[2] bg-[var(--text-primary)] text-[var(--bg-main)] font-black text-xs uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Continue to Split Setup</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    </motion.div>
  );
};
