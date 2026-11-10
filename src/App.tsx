import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Waves } from './components/react-bits/Waves';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StepProgress } from './components/StepProgress';
import { BillInputStep } from './components/BillInputStep';
import { PeopleStep } from './components/PeopleStep';
import { SplitConfigStep } from './components/SplitConfigStep';
import { SettlementStep } from './components/SettlementStep';
import { GroupsView } from './components/GroupsView';
import { HistoryView } from './components/HistoryView';
import { BillItem, Person, SplitMode, Assignment, Group, HistoryItem, Settlement } from './types';
import { calculateSettlements } from './utils/algorithm';

const INITIAL_PEOPLE: Person[] = [
  { id: '1', name: 'You', color: 'bg-emerald-500 text-slate-950' },
  { id: '2', name: 'Alex', color: 'bg-rose-500 text-white' },
];

function MainApp() {
  const { theme } = useTheme();

  // Navigation state
  const [activeTab, setActiveTab] = useState<'split' | 'groups' | 'history'>('split');
  const [step, setStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  // Split state
  const [items, setItems] = useState<BillItem[]>([]);
  const [rawText, setRawText] = useState('');
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  const [payerId, setPayerId] = useState<string | null>('1');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Saved entities (persisted to localStorage)
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const saved = localStorage.getItem('splititup_groups') || localStorage.getItem('split_smart_groups');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('splititup_history') || localStorage.getItem('split_smart_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [historyFilter, setHistoryFilter] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('splititup_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('splititup_history', JSON.stringify(history));
  }, [history]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Total bill calculation
  const totalAmount = useMemo(
    () => items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0),
    [items]
  );

  // Default payerId fallback
  useEffect(() => {
    if (people.length > 0 && (!payerId || !people.some((p) => p.id === payerId))) {
      setPayerId(people[0].id);
    }
  }, [people, payerId]);

  // Default percentages initialization
  useEffect(() => {
    if (people.length === 0) return;
    const basePct = Number((100 / people.length).toFixed(1));
    const init: Record<string, number> = {};
    people.forEach((p) => {
      init[p.id] = percentages[p.id] !== undefined ? percentages[p.id] : basePct;
    });
    setPercentages(init);
  }, [people.length]);

  // Step advancement helpers
  const goToStep = (newStep: number) => {
    setStep(newStep);
    setMaxReachedStep((prev) => Math.max(prev, newStep));
  };

  const handleNextFromBill = () => {
    if (items.length === 0 || totalAmount <= 0) {
      setToast('Please add at least one line item with a positive amount');
      return;
    }
    goToStep(2);
  };

  const handleNextFromPeople = () => {
    if (people.length < 2) {
      setToast('Please add at least 2 people to split the bill');
      return;
    }
    goToStep(3);
  };

  const handleNextFromConfig = () => {
    goToStep(4);
  };

  // Toggle item assignment in Item mode
  const toggleAssignment = (itemId: string, personId: string) => {
    setAssignments((prev) => {
      const existing = prev.find((a) => a.itemId === itemId);
      if (!existing) {
        return [...prev, { itemId, personIds: [personId] }];
      }
      const isAssigned = existing.personIds.includes(personId);
      const newPersonIds = isAssigned
        ? existing.personIds.filter((id) => id !== personId)
        : [...existing.personIds, personId];

      return prev.map((a) => (a.itemId === itemId ? { ...a, personIds: newPersonIds } : a));
    });
  };

  const updatePercentage = (personId: string, val: number) => {
    setPercentages((prev) => ({ ...prev, [personId]: val }));
  };

  // Settle calculations
  const settlementResults: Settlement[] = useMemo(() => {
    if (people.length < 2 || totalAmount <= 0) return [];

    const balances = people.map((person) => {
      let consumed = 0;

      if (splitMode === 'equal') {
        consumed = totalAmount / people.length;
      } else if (splitMode === 'item') {
        items.forEach((item) => {
          const assignment = assignments.find((a) => a.itemId === item.id);
          const assignedCount = assignment ? assignment.personIds.length : 0;
          if (assignedCount > 0 && assignment?.personIds.includes(person.id)) {
            consumed += item.amount / assignedCount;
          }
        });
      } else if (splitMode === 'percentage') {
        const pct = percentages[person.id] || 0;
        consumed = (totalAmount * pct) / 100;
      }

      const paid = person.id === payerId ? totalAmount : 0;
      return {
        personId: person.id,
        balance: paid - consumed,
      };
    });

    return calculateSettlements(balances);
  }, [people, totalAmount, splitMode, items, assignments, percentages, payerId]);

  // Save history action
  const handleSaveHistory = (results: Settlement[]) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      groupId: activeGroupId || undefined,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      total: totalAmount,
      peopleCount: people.length,
      mode: splitMode,
      settlements: results.map((s) => ({ ...s, isPaid: false })),
      people: [...people],
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  // Save as group action
  const handleSaveGroup = () => {
    const defaultName = `Squad ${groups.length + 1}`;
    const name = window.prompt('Enter squad name:', defaultName);
    if (!name?.trim()) return;

    const newGroup: Group = {
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      people: [...people],
    };
    setGroups((prev) => [newGroup, ...prev]);
    setActiveGroupId(newGroup.id);
    setToast(`Squad "${newGroup.name}" saved!`);
  };

  // Load squad
  const handleLoadGroup = (group: Group) => {
    setPeople(group.people);
    setActiveGroupId(group.id);
    setActiveTab('split');
    goToStep(1);
    setToast(`Loaded squad "${group.name}"`);
  };

  // View past history of squad
  const handleViewGroupHistory = (groupId: string) => {
    setHistoryFilter(groupId);
    setActiveTab('history');
  };

  // Reset entire flow
  const resetAll = () => {
    setItems([]);
    setRawText('');
    setStep(1);
    setMaxReachedStep(1);
    setAssignments([]);
    setToast('Split reset. Ready for a new bill.');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] relative flex flex-col selection:bg-[#FE5101]/25">
      {/* React Bits Waves animated canvas background */}
      <Waves waveCount={3} />

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Navigation & Brand Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setHistoryFilter={setHistoryFilter}
          step={step}
          resetAll={resetAll}
        />

        {/* Dynamic Toast banner */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[#FE5101]/40 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#FE5101] animate-ping" />
              <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Views */}
        <main className="flex-1 flex flex-col w-full">
          {activeTab === 'split' && (
            <div className="flex-1 flex flex-col">
              <StepProgress
                currentStep={step}
                setStep={goToStep}
                maxReachedStep={maxReachedStep}
              />

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <BillInputStep
                    items={items}
                    setItems={setItems}
                    onNext={handleNextFromBill}
                    rawText={rawText}
                    setRawText={setRawText}
                    setToast={setToast}
                  />
                )}

                {step === 2 && (
                  <PeopleStep
                    people={people}
                    setPeople={setPeople}
                    groups={groups}
                    loadGroup={handleLoadGroup}
                    onNext={handleNextFromPeople}
                    onBack={() => setStep(1)}
                  />
                )}

                {step === 3 && (
                  <SplitConfigStep
                    items={items}
                    people={people}
                    splitMode={splitMode}
                    setSplitMode={setSplitMode}
                    payerId={payerId}
                    setPayerId={setPayerId}
                    assignments={assignments}
                    toggleAssignment={toggleAssignment}
                    percentages={percentages}
                    updatePercentage={updatePercentage}
                    totalAmount={totalAmount}
                    onNext={handleNextFromConfig}
                    onBack={() => setStep(2)}
                  />
                )}

                {step === 4 && (
                  <SettlementStep
                    people={people}
                    results={settlementResults}
                    reset={resetAll}
                    total={totalAmount}
                    payerId={payerId}
                    onSaveHistory={handleSaveHistory}
                    onSaveGroup={handleSaveGroup}
                    setToast={setToast}
                  />
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'groups' && (
            <GroupsView
              groups={groups}
              setGroups={setGroups}
              loadGroup={handleLoadGroup}
              viewGroupHistory={handleViewGroupHistory}
              setToast={setToast}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              history={history}
              setHistory={setHistory}
              groups={groups}
              historyFilter={historyFilter}
              setHistoryFilter={setHistoryFilter}
              onStartNew={() => {
                setActiveTab('split');
                setStep(1);
              }}
              setToast={setToast}
            />
          )}
        </main>
      </div>

      {/* Large Typography & Marquee Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
