import React from 'react';
import { 
  Smartphone, 
  Download, 
  Printer, 
  RotateCcw, 
  HelpCircle, 
  Plus
} from 'lucide-react';

interface HeaderProps {
  onOpenAddRow: () => void;
  onOpenExportImport: () => void;
  onPrint: () => void;
  onResetData: () => void;
  onOpenHelp: () => void;
  lastSavedAt: Date | null;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddRow,
  onOpenExportImport,
  onPrint,
  onResetData,
  onOpenHelp,
  lastSavedAt,
  totalCount
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3 gap-2">
          
          {/* Brand & Title (Sleek and compact) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-2xs shrink-0 ring-1 sm:ring-2 ring-amber-100">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-slate-900 m-0 truncate">
                  Maharashtra Mobile
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  ABHR
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>{lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Auto-saved'}</span>
                <span>•</span>
                <span>{totalCount} rows</span>
              </div>
            </div>
          </div>

          {/* Menubar with Tiny Buttons & Maximum Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* New Entry Primary Tiny Button */}
            <button
              onClick={onOpenAddRow}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 active:scale-95 transition-all shadow-2xs"
              title="Add New Row (N)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Entry</span>
              <kbd className="hidden md:inline-block ml-0.5 px-1 py-0.2 text-[9px] bg-orange-700/70 rounded font-mono">
                N
              </kbd>
            </button>

            {/* Export / Import Button */}
            <button
              onClick={onOpenExportImport}
              type="button"
              className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors shadow-2xs"
              title="Export to CSV/JSON or Import"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Data</span>
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              type="button"
              className="inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Print Sheet / Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline">Print</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              type="button"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Help / Formulas Button */}
            <button
              onClick={onOpenHelp}
              type="button"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Help & Formulas (?)"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
