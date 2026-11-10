import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, Image as ImageIcon, Plus, Trash2, ArrowRight, RefreshCw, UploadCloud } from 'lucide-react';
import { BillItem } from '../types';
import { SpotlightCard } from './react-bits/SpotlightCard';
import { MagneticButton } from './react-bits/MagneticButton';
import { BlurText } from './react-bits/BlurText';
import { compressImage } from '../utils/image';
import { parseBillWithAI } from '../services/aiService';

interface BillInputStepProps {
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
  onNext: () => void;
  rawText: string;
  setRawText: (text: string) => void;
  setToast: (toast: string) => void;
}

export const BillInputStep: React.FC<BillInputStepProps> = ({
  items,
  setItems,
  onNext,
  rawText,
  setRawText,
  setToast,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const totalAmount = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);

  const handleParseAI = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    try {
      const parsedItems = await parseBillWithAI(rawText);
      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        setItems(
          parsedItems.map((item: any) => ({
            id: Math.random().toString(36).substring(7),
            name: item.name || 'Item',
            amount: Number(item.amount) || 0,
          }))
        );
        setToast(`Parsed ${parsedItems.length} items from your bill ✨`);
      } else {
        setToast('No items recognized. Try formatting as "Item Name: Amount"');
      }
    } catch (e: any) {
      setToast(e.message || 'Failed to parse text. Please enter items manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const processImageFile = async (file: File) => {
    setIsParsing(true);
    try {
      setToast('Optimizing & reading bill photo...');
      const { data, mimeType } = await compressImage(file);
      const parsed = await parseBillWithAI('', data, mimeType);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(
          parsed.map((item: any) => ({
            id: Math.random().toString(36).substring(7),
            name: item.name || 'Item',
            amount: Number(item.amount) || 0,
          }))
        );
        setToast(`AI found ${parsed.length} items in receipt 🎉`);
      } else {
        setToast('Could not detect distinct items. You can add them manually below.');
      }
    } catch (e: any) {
      setToast(e.message || 'Failed to scan image. Please enter items manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleBillDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const addItemManually = () => {
    const newItem: BillItem = {
      id: Math.random().toString(36).substring(7),
      name: '',
      amount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id: string, field: 'name' | 'amount', value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col max-w-2xl mx-auto w-full gap-8"
    >
      {/* Editorial Header */}
      <div className="text-center space-y-2">
        <h2 className="font-serif italic text-4xl sm:text-5xl font-normal text-[var(--text-primary)]">
          <BlurText text="What's on the bill?" />
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Paste the receipt text, drop a bill photo, or add line items manually.
        </p>
      </div>

      {/* Input Spotlight Card */}
      <SpotlightCard className="p-6 sm:p-8">
        <div
          className={`relative rounded-2xl transition-all duration-300 ${
            isDraggingFile ? 'ring-2 ring-[#FE5101] bg-[#FE5101]/5' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
          }}
          onDrop={handleBillDrop}
        >
          {isDraggingFile && (
            <div className="absolute inset-0 z-20 bg-[var(--bg-main)]/90 backdrop-blur-md rounded-2xl border-2 border-dashed border-[#FE5101] flex flex-col items-center justify-center pointer-events-none gap-2">
              <UploadCloud className="w-10 h-10 text-[#FE5101] animate-bounce" />
              <span className="font-bold text-xs uppercase tracking-widest text-[#FE5101]">
                Drop your receipt photo here
              </span>
            </div>
          )}

          <div className="relative">
            <textarea
              className="w-full h-32 sm:h-40 bg-transparent border-none focus:ring-0 text-base sm:text-lg resize-none placeholder:text-[var(--text-muted)]/50 font-mono text-[var(--text-primary)] outline-none"
              placeholder="Paste raw bill text, e.g.&#10;Margherita Pizza 450&#10;Garlic Bread 180&#10;Iced Tea 120"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />

            {isParsing && (
              <div className="absolute inset-0 bg-[var(--bg-card)]/90 backdrop-blur-md rounded-xl flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-[#FE5101] w-7 h-7" />
                  <span className="font-bold text-[#FE5101] uppercase tracking-widest text-xs">
                    Gemini AI analyzing receipt...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action triggers */}
          <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border-color)]">
            <MagneticButton
              onClick={handleParseAI}
              disabled={!rawText.trim() || isParsing}
              className="w-full bg-[#FE5101] hover:bg-[#FE5101]/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#FE5101]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Parse Text with AI</span>
            </MagneticButton>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex-1 bg-[var(--chip-bg)] border border-[var(--border-color)] hover:border-[#FE5101]/40 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                <Camera className="w-3.5 h-3.5 text-[#FE5101]" />
                <span>Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              <label className="flex-1 bg-[var(--chip-bg)] border border-[var(--border-color)] hover:border-[#FE5101]/40 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                <ImageIcon className="w-3.5 h-3.5 text-[#FF2A6D]" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Line Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-black">
              Line Items ({items.length})
            </h3>
            {totalAmount > 0 && (
              <span className="text-xs font-mono font-bold text-[#FE5101] bg-[#FE5101]/10 px-2 py-0.5 rounded-full">
                Total: ₹{totalAmount.toFixed(0)}
              </span>
            )}
          </div>

          <button
            onClick={addItemManually}
            className="text-xs font-bold flex items-center gap-1.5 text-[#FE5101] hover:text-[#FE5101]/80 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Manually
          </button>
        </div>

        <div className="space-y-2.5 max-h-[38vh] overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="text-center py-10 glass-card rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-xs">
              No items added yet. Parse a bill or click &ldquo;Add Manually&rdquo;.
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 p-3.5 glass-card rounded-xl group"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] group-focus-within:bg-[#FE5101] transition-colors" />

                  <input
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-base font-medium p-0 placeholder:text-[var(--text-muted)]/40 text-[var(--text-primary)] outline-none"
                    value={item.name}
                    placeholder="Item name"
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  />

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#FE5101]">₹</span>
                    <input
                      type="number"
                      className="w-24 bg-[var(--chip-bg)] rounded-lg border border-[var(--border-color)] focus:border-[#FE5101] text-right font-mono font-bold text-[var(--text-primary)] p-1.5 text-sm outline-none"
                      value={item.amount || ''}
                      placeholder="0"
                      onChange={(e) =>
                        updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)
                      }
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Next Step Action */}
      <div className="pt-4">
        <MagneticButton
          onClick={onNext}
          disabled={items.length === 0 || totalAmount <= 0}
          className="w-full bg-[var(--text-primary)] text-[var(--bg-main)] font-black text-sm uppercase tracking-widest h-14 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Continue to Participants</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    </motion.div>
  );
};
