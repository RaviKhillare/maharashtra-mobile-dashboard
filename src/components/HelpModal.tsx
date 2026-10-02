import React from 'react';
import { X, HelpCircle, Calculator, Keyboard, Database, FileSpreadsheet } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 m-0">
                Maharashtra Mobile - ABHR Guide & Formulas
              </h3>
              <p className="text-xs text-slate-500 m-0">
                Google Sheets formula mapping and keyboard shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Formula Mappings */}
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4 text-orange-600" />
              Live Calculations & Sheet Formulas (Rows 8 : 1004)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <strong className="text-amber-900">CC Total</strong>
                  <div className="text-slate-500">Customer charge / credit column sum</div>
                </div>
                <code className="font-mono bg-white px-2 py-1 rounded border border-amber-300 font-bold text-amber-800">
                  =SUM(C8:C1004)
                </code>
              </div>

              <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-between">
                <div>
                  <strong className="text-orange-950">PP Total</strong>
                  <div className="text-slate-500">Parts price / purchase column sum</div>
                </div>
                <code className="font-mono bg-white px-2 py-1 rounded border border-orange-300 font-bold text-orange-900">
                  =SUM(D8:D1004)
                </code>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 flex items-center justify-between">
                <div>
                  <strong className="text-rose-900">Grand Total</strong>
                  <div className="text-slate-500">Consolidated sum of CC Total + PP Total</div>
                </div>
                <code className="font-mono bg-white px-2 py-1 rounded border border-rose-300 font-bold text-rose-800">
                  =E4+F4
                </code>
              </div>
            </div>
          </div>

          {/* Fields description */}
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Data Fields Reference
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
              <li><strong>No.:</strong> Row serial number (auto-incremented or editable).</li>
              <li><strong>Subject:</strong> Service or item description (e.g., <em>"love Bar sound"</em>).</li>
              <li><strong>CC:</strong> Numeric amount under CC (highlighted with soft green accents).</li>
              <li><strong>PP:</strong> Numeric amount under PP (highlighted with soft orange accents).</li>
              <li><strong>Baki:</strong> Status or pending notes (e.g. <em>"Advance 300 / Baki 150"</em>).</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider mb-2">
              <Keyboard className="w-4 h-4 text-indigo-600" />
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">New Entry</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-bold">N</kbd>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Submit Form</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-bold">Enter</kbd>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Close Modals</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-bold">Esc</kbd>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">Print / PDF</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-bold">Ctrl+P</kbd>
              </div>
            </div>
          </div>

          {/* Storage & Headless CMS */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Database className="w-3.5 h-3.5 text-orange-600" />
              Seamless Data Storage & CMS Ready
            </div>
            <p className="text-slate-500 m-0">
              All data is saved in real-time to your browser's persistent LocalStorage. You can also export as JSON or CSV to commit straight to a GitHub repository or synchronize with any headless database API.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
