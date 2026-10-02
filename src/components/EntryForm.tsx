import React, { useState, useEffect } from 'react';
import type { SheetEntry } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  PlusCircle, 
  Tag, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EntryFormProps {
  nextSuggestedNo: number;
  onAddEntry: (entry: Omit<SheetEntry, 'id'>) => void;
  isOpenDefault?: boolean;
}

const COMMON_SUBJECT_SUGGESTIONS = [
  'love Bar sound',
  'Display Combo + Glass',
  'C-Type Charging Jack',
  'Battery Replacement Org',
  'Mic & Ringer Sound Repair',
  'OCA Glass Lamination',
  'CPU Reballing Work',
  'Tempered & Back Cover Combo'
];

const BAKI_QUICK_TAGS = [
  'Clear',
  'Paid UPI',
  'Cash Paid',
  'Baki 200',
  'Baki 500',
  'Pending Delivery'
];

export const EntryForm: React.FC<EntryFormProps> = ({
  nextSuggestedNo,
  onAddEntry,
  isOpenDefault = true
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpenDefault);
  const [no, setNo] = useState<number>(nextSuggestedNo);
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState<string>('');
  const [pp, setPp] = useState<string>('');
  const [baki, setBaki] = useState('');
  const [date] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  // Sync with nextSuggestedNo when it changes
  useEffect(() => {
    setNo(nextSuggestedNo);
  }, [nextSuggestedNo]);

  const numCc = parseFloat(cc) || 0;
  const numPp = parseFloat(pp) || 0;
  const rowGrandTotal = numCc + numPp;

  const handleSubmit = (e?: React.FormEvent, keepFocus = false) => {
    if (e) e.preventDefault();
    setError(null);

    if (!subject.trim()) {
      setError('Please provide a Subject (e.g., "love Bar sound" or service description).');
      return;
    }

    const newEntry: Omit<SheetEntry, 'id'> = {
      no: Number(no) || nextSuggestedNo,
      subject: subject.trim(),
      cc: numCc,
      pp: numPp,
      baki: baki.trim(),
      date
    };

    onAddEntry(newEntry);

    // Subtle celebratory confetti
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#dc2626']
      });
    } catch {
      // ignore
    }

    // Reset form for next entry
    setSubject('');
    setCc('');
    setPp('');
    setBaki('');
    setNo((prev) => prev + 1);

    if (keepFocus) {
      const subjectInput = document.getElementById('entry-subject-input');
      subjectInput?.focus();
    }
  };

  const handleReset = () => {
    setNo(nextSuggestedNo);
    setSubject('');
    setCc('');
    setPp('');
    setBaki('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-hidden transition-all">
      {/* Header bar / Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-gradient-to-r from-amber-50/60 via-orange-50/30 to-white border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
              Add New Sheet Entry
              <span className="text-[11px] font-normal text-slate-500 font-mono">
                (Row #{no})
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 m-0">
              Input No, Subject, CC, PP, and Baki status. Auto-adds to live totals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-slate-500 hidden sm:inline">
            Press <kbd className="bg-slate-100 border border-slate-300 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to submit
          </span>
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Form Content */}
      {isExpanded && (
        <form onSubmit={(e) => handleSubmit(e, true)} className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* 1. Row No. (Editable & Auto-incremented) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>No.</span>
                <span className="text-[10px] text-slate-400 font-mono">Auto / Edit</span>
              </label>
              <input
                type="number"
                value={no}
                onChange={(e) => setNo(parseInt(e.target.value, 10) || 1)}
                min="1"
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden font-mono font-semibold text-slate-800"
              />
            </div>

            {/* 2. Subject (Text field, e.g. "love Bar sound") */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Subject / Work Description</span>
                <span className="text-[10px] text-amber-700 font-medium">e.g. "love Bar sound"</span>
              </label>
              <input
                id="entry-subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. love Bar sound, Display replacement..."
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* 3. CC (Numeric entry - Defined green accent) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-emerald-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  CC (₹)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Col C</span>
              </label>
              <input
                type="number"
                step="any"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-emerald-50/40 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden font-mono font-bold text-emerald-900 placeholder:text-emerald-300"
              />
            </div>

            {/* 4. PP (Numeric entry - Defined contrasting accent) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-orange-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                  PP (₹)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Col D</span>
              </label>
              <input
                type="number"
                step="any"
                value={pp}
                onChange={(e) => setPp(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-orange-50/40 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-hidden font-mono font-bold text-orange-900 placeholder:text-orange-300"
              />
            </div>

            {/* 5. Baki (Text or numeric notes field) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Baki / Notes</span>
                <span className="text-[10px] text-slate-400 font-mono">Col E</span>
              </label>
              <input
                type="text"
                value={baki}
                onChange={(e) => setBaki(e.target.value)}
                placeholder="Paid / Baki 200..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
              />
            </div>

          </div>

          {/* Quick suggestions & Live Row Total Calculation Banner */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            
            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Tag className="w-3 h-3" /> Quick fill:
              </span>
              {COMMON_SUBJECT_SUGGESTIONS.slice(0, 4).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSubject(item)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Live Calculation preview for this row */}
            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="flex items-center gap-1.5 font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                <span className="text-slate-500">Row Total (CC+PP):</span>
                <strong className={`font-bold ${rowGrandTotal > 0 ? 'text-red-700' : 'text-slate-700'}`}>
                  {formatINR(rowGrandTotal)}
                </strong>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 active:scale-95 transition-all shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add Entry
                </button>
              </div>
            </div>

          </div>

          {/* Baki quick status pills */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px]">Baki presets:</span>
            {BAKI_QUICK_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setBaki(tag)}
                className="px-2 py-0.5 rounded-full border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-[11px] text-slate-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </form>
      )}
    </div>
  );
};
