import React, { useState, useEffect } from 'react';
import type { SheetEntry } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  PlusCircle, 
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EntryFormProps {
  nextSuggestedNo: number;
  onAddEntry: (entry: Omit<SheetEntry, 'id'>) => void;
  isOpenDefault?: boolean;
}

const COMMON_SUBJECT_SUGGESTIONS = [
  'love Bar sound',
  'Display Combo',
  'C-Type Pin',
  'Battery Org',
  'Mic & Ringer',
  'OCA Glass',
  'IC Reballing'
];

const BAKI_QUICK_TAGS = [
  'Clear',
  'Paid UPI',
  'Cash',
  'Baki 200',
  'Baki 500'
];

export const EntryForm: React.FC<EntryFormProps> = ({
  nextSuggestedNo,
  onAddEntry,
  isOpenDefault = true
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpenDefault);
  const [no, setNo] = useState<number>(nextSuggestedNo);
  const [isManualNo, setIsManualNo] = useState(false);
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState<string>('');
  const [pp, setPp] = useState<string>('');
  const [baki, setBaki] = useState('');
  const [date] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate and sync Sr. No. whenever nextSuggestedNo changes
  useEffect(() => {
    if (!isManualNo) {
      setNo(nextSuggestedNo);
    }
  }, [nextSuggestedNo, isManualNo]);

  const numCc = parseFloat(cc) || 0;
  const numPp = parseFloat(pp) || 0;
  const rowGrandTotal = numCc + numPp;

  const handleSubmit = (e?: React.FormEvent, keepFocus = true) => {
    if (e) e.preventDefault();
    setError(null);

    if (!subject.trim()) {
      setError('Please enter a Subject (e.g. "love Bar sound")');
      return;
    }

    const assignedNo = isManualNo ? (Number(no) || nextSuggestedNo) : nextSuggestedNo;

    const newEntry: Omit<SheetEntry, 'id'> = {
      no: assignedNo,
      subject: subject.trim(),
      cc: numCc,
      pp: numPp,
      baki: baki.trim(),
      date
    };

    onAddEntry(newEntry);

    try {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#dc2626']
      });
    } catch {
      // ignore
    }

    // Reset form for next entry & auto-increment Sr. No.
    setSubject('');
    setCc('');
    setPp('');
    setBaki('');
    setIsManualNo(false);
    setNo(assignedNo + 1);

    if (keepFocus) {
      setTimeout(() => {
        const subjectInput = document.getElementById('entry-subject-input');
        subjectInput?.focus();
      }, 50);
    }
  };

  const handleReset = () => {
    setIsManualNo(false);
    setNo(nextSuggestedNo);
    setSubject('');
    setCc('');
    setPp('');
    setBaki('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs mb-3 sm:mb-6 overflow-hidden transition-all">
      {/* Header bar / Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-50/70 via-orange-50/30 to-white border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <PlusCircle className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 m-0">
              New Entry
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Sr. #{no} Auto
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Press Enter ↵ to save
          </span>
          <button 
            type="button" 
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Form Content */}
      {isExpanded && (
        <form onSubmit={(e) => handleSubmit(e, true)} className="p-3 sm:p-5">
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4">
            
            {/* 1. Sr. No. (100% Auto-Generated) */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
                <span>Sr. No.</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                  {isManualNo ? 'MANUAL' : 'AUTO'}
                </span>
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  value={no}
                  readOnly={!isManualNo}
                  onChange={(e) => setNo(parseInt(e.target.value, 10) || 1)}
                  min="1"
                  required
                  className={`w-full pl-2.5 pr-6 py-1.5 text-xs sm:text-sm border rounded-lg font-mono font-bold transition-all ${
                    isManualNo 
                      ? 'bg-white border-amber-400 text-slate-900 focus:ring-2 focus:ring-amber-500' 
                      : 'bg-slate-100/90 border-slate-200 text-slate-700 cursor-default select-none'
                  }`}
                  title={isManualNo ? "Manual Sr. No. editing" : "Auto-generated Sr. No."}
                />
                
                <button
                  type="button"
                  onClick={() => setIsManualNo(!isManualNo)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                  title={isManualNo ? "Switch back to Auto" : "Click to manually edit Sr. No."}
                >
                  {isManualNo ? <Unlock className="w-3 h-3 text-amber-600" /> : <Lock className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* 2. Subject */}
            <div className="col-span-2 sm:col-span-4 order-last sm:order-none">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex justify-between">
                <span>Subject / Work</span>
                <span className="text-[10px] text-amber-700 font-normal">e.g. love Bar sound</span>
              </label>
              <input
                id="entry-subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Item / service description..."
                required
                autoFocus
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* 3. CC (Green Accent) */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[11px] font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>CC (₹)</span>
              </label>
              <input
                type="number"
                step="any"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-emerald-50/50 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-900"
              />
            </div>

            {/* 4. PP (Orange Accent) */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[11px] font-semibold text-orange-800 mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>PP (₹)</span>
              </label>
              <input
                type="number"
                step="any"
                value={pp}
                onChange={(e) => setPp(e.target.value)}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-orange-50/50 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-bold text-orange-900"
              />
            </div>

            {/* 5. Baki */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Baki / Notes
              </label>
              <input
                type="text"
                value={baki}
                onChange={(e) => setBaki(e.target.value)}
                placeholder="Status..."
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

          </div>

          {/* Micro Chips & Live Row Total Calculation Banner */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* Quick Fill suggestions */}
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="w-3 h-3 text-slate-400 shrink-0" />
              {COMMON_SUBJECT_SUGGESTIONS.slice(0, 3).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSubject(item)}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] transition-colors"
                >
                  {item}
                </button>
              ))}
              {BAKI_QUICK_TAGS.slice(0, 2).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setBaki(tag)}
                  className="px-1.5 py-0.5 rounded border border-slate-200 text-[10px] text-slate-600 hover:border-amber-400"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Calculation preview & Tiny buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
                <span className="text-[10px] text-slate-500">Total:</span>
                <strong className={`font-bold ${rowGrandTotal > 0 ? 'text-red-700' : 'text-slate-700'}`}>
                  {formatINR(rowGrandTotal)}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 active:scale-95 transition-all shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Add Entry</span>
              </button>
            </div>

          </div>

        </form>
      )}
    </div>
  );
};
