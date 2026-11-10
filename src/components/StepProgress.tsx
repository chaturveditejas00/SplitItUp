import React from 'react';
import { motion } from 'motion/react';
import { Check, Receipt, Users, Sliders, CheckCircle2 } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  setStep: (step: number) => void;
  maxReachedStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  setStep,
  maxReachedStep,
}) => {
  const steps = [
    { number: 1, label: 'Bill Items', icon: Receipt },
    { number: 2, label: 'People', icon: Users },
    { number: 3, label: 'Split Config', icon: Sliders },
    { number: 4, label: 'Settlement', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-10 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--border-color)] z-0" />

        {/* Active Connecting Fill */}
        <motion.div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#FE5101] to-[#FF2A6D] z-0 origin-left"
          initial={false}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = step.number <= maxReachedStep;

          return (
            <button
              key={step.number}
              disabled={!isClickable}
              onClick={() => isClickable && setStep(step.number)}
              className={`relative z-10 flex flex-col items-center group ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <motion.div
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shadow-md ${
                  isCompleted
                    ? 'bg-[#FE5101] text-white shadow-[#FE5101]/30'
                    : isCurrent
                    ? 'bg-[var(--text-primary)] text-[var(--bg-main)] ring-4 ring-[#FE5101]/30 shadow-lg'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </motion.div>

              <span
                className={`mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 hidden sm:block ${
                  isCurrent
                    ? 'text-[var(--text-primary)]'
                    : isCompleted
                    ? 'text-[#FE5101]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
