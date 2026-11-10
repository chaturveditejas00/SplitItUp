import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Trash2, ChevronDown, History, ArrowRight, X, Sparkles } from 'lucide-react';
import { Group, Person } from '../types';
import { SpotlightCard } from './react-bits/SpotlightCard';
import { MagneticButton } from './react-bits/MagneticButton';
import { BlurText } from './react-bits/BlurText';

interface GroupsViewProps {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  loadGroup: (group: Group) => void;
  viewGroupHistory: (groupId: string) => void;
  setToast: (toast: string) => void;
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

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  setGroups,
  loadGroup,
  viewGroupHistory,
  setToast,
}) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPeopleRaw, setNewGroupPeopleRaw] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupPeopleRaw.trim()) return;

    const names = newGroupPeopleRaw
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length < 2) {
      setToast('Please add at least 2 people to the squad');
      return;
    }

    const newGroup: Group = {
      id: Math.random().toString(36).substring(7),
      name: newGroupName.trim(),
      people: names.map((name, idx) => ({
        id: Math.random().toString(36).substring(7),
        name,
        color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      })),
    };

    setGroups((prev) => [newGroup, ...prev]);
    setNewGroupName('');
    setNewGroupPeopleRaw('');
    setIsCreatingGroup(false);
    setToast(`Squad "${newGroup.name}" created! 🎉`);
  };

  const deleteGroup = (id: string, name: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setToast(`Squad "${name}" removed`);
  };

  const toggleExpand = (id: string) => {
    setExpandedGroupId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col gap-8 max-w-4xl mx-auto w-full"
    >
      {/* Header & Create Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-[var(--border-color)]">
        <div>
          <h2 className="font-serif italic text-4xl sm:text-5xl font-normal text-[var(--text-primary)]">
            <BlurText text="Saved Squads" />
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-medium">
            Save flatmates, travel buddies, or regular dining crews for instant splits.
          </p>
        </div>

        <MagneticButton
          onClick={() => setIsCreatingGroup(true)}
          className="bg-[#FE5101] hover:bg-[#FE5101]/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md shadow-[#FE5101]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Squad</span>
        </MagneticButton>
      </div>

      {/* Modal / Dialog to Create Squad */}
      <AnimatePresence>
        {isCreatingGroup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SpotlightCard className="p-6 sm:p-8 border-2 border-[#FE5101]/40">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FE5101]" />
                  <h3 className="font-bold text-base text-[var(--text-primary)]">
                    Create a New Squad
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-1.5">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Goa Trip, Apartment 4B, Friday Dinner"
                    className="w-full bg-[var(--chip-bg)] border border-[var(--border-color)] focus:border-[#FE5101] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-1.5">
                    Members (comma or line separated)
                  </label>
                  <textarea
                    value={newGroupPeopleRaw}
                    onChange={(e) => setNewGroupPeopleRaw(e.target.value)}
                    placeholder="Alex, Sarah, Tejas, Jordan..."
                    rows={3}
                    className="w-full bg-[var(--chip-bg)] border border-[var(--border-color)] focus:border-[#FE5101] rounded-xl p-3 text-sm text-[var(--text-primary)] outline-none resize-none font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingGroup(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <MagneticButton
                    type="submit"
                    disabled={!newGroupName.trim() || !newGroupPeopleRaw.trim()}
                    className="bg-[#FE5101] text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer disabled:opacity-40"
                  >
                    Save Squad
                  </MagneticButton>
                </div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Squad Cards Grid */}
      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-[2rem] border border-dashed border-[var(--border-color)] space-y-3">
            <Users className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <h3 className="font-bold text-base text-[var(--text-primary)]">No squads created yet</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Create a squad to save regular group members for quick 1-click splits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => {
              const isExpanded = expandedGroupId === group.id;

              return (
                <SpotlightCard key={group.id} className="p-5 flex flex-col justify-between gap-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#FE5101]/10 border border-[#FE5101]/20 flex items-center justify-center text-[#FE5101] flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-base text-[var(--text-primary)] truncate">
                          {group.name}
                        </h4>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                          {group.people.length} Members
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleExpand(group.id)}
                        className={`p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] transition-transform duration-200 cursor-pointer ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => loadGroup(group)}
                        className="bg-[#FE5101] hover:bg-[#FE5101]/90 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <span>Split</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Avatars Preview */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {group.people.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0`}
                        title={p.name}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {group.people.length > 6 && (
                      <span className="text-[10px] font-mono text-[var(--text-muted)] pl-1">
                        +{group.people.length - 6} more
                      </span>
                    )}
                  </div>

                  {/* Expandable details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-[var(--border-color)] space-y-3"
                      >
                        <div className="flex flex-wrap gap-2">
                          {group.people.map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full glass border border-[var(--border-color)] text-[var(--text-secondary)]"
                            >
                              <span className={`w-2 h-2 rounded-full ${p.color.split(' ')[0]}`} />
                              <span>{p.name}</span>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => viewGroupHistory(group.id)}
                            className="text-[11px] font-bold uppercase tracking-wider text-[#FE5101] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <History className="w-3 h-3" />
                            <span>View Past Bills</span>
                          </button>

                          <button
                            onClick={() => deleteGroup(group.id, group.name)}
                            className="text-[11px] font-bold uppercase tracking-wider text-rose-500/70 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
