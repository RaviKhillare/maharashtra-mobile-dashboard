import React from 'react';
import { 
  Smartphone, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  RotateCcw, 
  HelpCircle,
  CheckCircle2,
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-100">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0">
                  Maharashtra Mobile
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  ABHR Ledger
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  Rows 8 : 1004
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lastSavedAt ? `Auto-saved at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Live Local Storage'}
                </span>
                <span>•</span>
                <span>{totalCount} active records</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onOpenAddRow}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-700 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 text-[10px] bg-orange-700/60 rounded text-orange-100 font-mono">
                N
              </kbd>
            </button>

            <button
              onClick={onOpenExportImport}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-2xs"
              title="Import or Export CSV / JSON data"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export / Import</span>
            </button>

            <button
              onClick={onPrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Print or save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onResetData}
              type="button"
              className="inline-flex items-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Reset to default sample entries"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenHelp}
              type="button"
              className="inline-flex items-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Help & Google Sheet Formula info"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
