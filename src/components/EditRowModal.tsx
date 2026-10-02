import React, { useState, useEffect } from 'react';
import type { SheetEntry } from '../types';
import { formatINR } from '../utils/formatters';
import { X, Check, Calculator } from 'lucide-react';

interface EditRowModalProps {
  entry: SheetEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SheetEntry) => void;
}

export const EditRowModal: React.FC<EditRowModalProps> = ({
  entry,
  isOpen,
  onClose,
  onSave
}) => {
  const [no, setNo] = useState<number>(1);
  const [subject, setSubject] = useState('');
  const [cc, setCc] = useState<string>('0');
  const [pp, setPp] = useState<string>('0');
  const [baki, setBaki] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (entry) {
      setNo(entry.no);
      setSubject(entry.subject);
      setCc(String(entry.cc));
      setPp(String(entry.pp));
      setBaki(entry.baki || '');
      setDate(entry.date || new Date().toISOString().split('T')[0]);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const numCc = parseFloat(cc) || 0;
  const numPp = parseFloat(pp) || 0;
  const grandTotal = numCc + numPp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...entry,
      no: Number(no) || entry.no,
      subject: subject.trim(),
      cc: numCc,
      pp: numPp,
      baki: baki.trim(),
      date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800 m-0">
              Edit Sheet Entry #{entry.no}
            </h3>
            <p className="text-xs text-slate-500 m-0">
              Update subject, CC, PP, or Baki details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Row No.
              </label>
              <input
                type="number"
                value={no}
                onChange={(e) => setNo(parseInt(e.target.value, 10) || 1)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject / Description
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. love Bar sound"
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">
                CC Amount (₹)
              </label>
              <input
                type="number"
                step="any"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-emerald-50/40 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-orange-800 mb-1">
                PP Amount (₹)
              </label>
              <input
                type="number"
                step="any"
                value={pp}
                onChange={(e) => setPp(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-orange-50/40 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-bold text-orange-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Baki / Notes
            </label>
            <input
              type="text"
              value={baki}
              onChange={(e) => setBaki(e.target.value)}
              placeholder="e.g. Baki 200 / Paid UPI"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Formula calculation badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              Calculated Total (CC+PP):
            </span>
            <strong className="text-base text-red-700 font-extrabold">
              {formatINR(grandTotal)}
            </strong>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 shadow-2xs transition-colors"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
