import React from 'react';
import type { SheetTotals } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';
import { 
  Layers, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';

interface SummaryCardsProps {
  totals: SheetTotals;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totals }) => {
  return (
    <section className="mb-3 sm:mb-6">
      {/* ABHR Section Visual Anchor Title (Compact on mobile) */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 pb-1.5 sm:pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-white font-black text-xs sm:text-base tracking-wider rounded shadow-2xs">
            ABHR
          </div>
          <div>
            <h2 className="text-xs sm:text-lg font-bold text-slate-800 m-0 leading-tight">
              Live Sheet Totals
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 m-0 hidden sm:block">
              Real-time formula simulation (Rows 8 : 1004)
            </p>
          </div>
        </div>

        {/* Rows & Baki Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-slate-600 font-mono">
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-slate-200">
            <Layers className="w-3 h-3 text-slate-500" />
            <span className="hidden xs:inline">Rows:</span> <strong>{formatNumber(totals.totalEntries)}</strong>
          </span>
          {totals.pendingBakiCount > 0 && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span className="hidden xs:inline">Baki:</span> <strong>{totals.pendingBakiCount}</strong>
            </span>
          )}
        </div>
      </div>

      {/* 3 Summary Cards - Ultra-compact on mobile (1 row of 3 columns), standard on desktop */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 lg:gap-6">
        
        {/* 1. CC Total Card (Orange Theme) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50/50 rounded-xl sm:rounded-2xl border border-amber-300 sm:border-2 p-2 sm:p-5 shadow-2xs group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-md bg-amber-500 text-white font-bold text-[10px] sm:text-xs shadow-2xs">
                CC
              </span>
              <span className="text-[10px] sm:text-sm font-bold text-slate-700 uppercase tracking-tight sm:tracking-wide">
                CC Total
              </span>
            </div>

            {/* Formula Badge (Hidden or ultra-tiny on mobile) */}
            <span className="hidden md:inline-flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-amber-800 bg-amber-100/90 border border-amber-300/80 px-1.5 py-0.2 rounded-full">
              =SUM(C8:C1004)
            </span>
          </div>

          <div className="mt-1 sm:mt-4">
            <div className="text-sm sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-950 font-mono truncate">
              {formatINR(totals.ccTotal)}
            </div>
          </div>

          <div className="hidden sm:flex mt-3 pt-2.5 border-t border-amber-200/60 items-center justify-between text-xs text-slate-600">
            <span className="truncate">Col C (CC)</span>
            <span className="font-mono text-amber-900 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded text-[11px]">
              =SUM(C)
            </span>
          </div>
          {/* Micro mobile formula label */}
          <div className="sm:hidden text-[9px] font-mono text-amber-800/80 mt-0.5 truncate">
            =SUM(C8:C1004)
          </div>
        </div>

        {/* 2. PP Total Card (Orange Theme) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50/50 rounded-xl sm:rounded-2xl border border-orange-300 sm:border-2 p-2 sm:p-5 shadow-2xs group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-md bg-orange-500 text-white font-bold text-[10px] sm:text-xs shadow-2xs">
                PP
              </span>
              <span className="text-[10px] sm:text-sm font-bold text-slate-700 uppercase tracking-tight sm:tracking-wide">
                PP Total
              </span>
            </div>

            {/* Formula Badge */}
            <span className="hidden md:inline-flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-orange-800 bg-orange-100/90 border border-orange-300/80 px-1.5 py-0.2 rounded-full">
              =SUM(D8:D1004)
            </span>
          </div>

          <div className="mt-1 sm:mt-4">
            <div className="text-sm sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-orange-950 font-mono truncate">
              {formatINR(totals.ppTotal)}
            </div>
          </div>

          <div className="hidden sm:flex mt-3 pt-2.5 border-t border-orange-200/60 items-center justify-between text-xs text-slate-600">
            <span className="truncate">Col D (PP)</span>
            <span className="font-mono text-orange-900 font-semibold bg-orange-100/70 px-1.5 py-0.5 rounded text-[11px]">
              =SUM(D)
            </span>
          </div>
          {/* Micro mobile formula label */}
          <div className="sm:hidden text-[9px] font-mono text-orange-800/80 mt-0.5 truncate">
            =SUM(D8:D1004)
          </div>
        </div>

        {/* 3. Grand Total Card (Red Theme - Visual Anchor) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-xl sm:rounded-2xl border border-red-500 sm:border-2 p-2 sm:p-5 shadow-xs group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-md bg-white/20 text-white font-bold text-[10px] sm:text-xs">
                Σ
              </span>
              <span className="text-[10px] sm:text-sm font-bold text-red-100 uppercase tracking-tight sm:tracking-wide">
                Grand
              </span>
            </div>

            {/* Formula Badge */}
            <span className="hidden md:inline-flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-white bg-red-900/50 border border-white/25 px-1.5 py-0.2 rounded-full">
              =E4+F4
            </span>
          </div>

          <div className="mt-1 sm:mt-4">
            <div className="text-sm sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono truncate drop-shadow-2xs">
              {formatINR(totals.grandTotal)}
            </div>
          </div>

          <div className="hidden sm:flex mt-3 pt-2.5 border-t border-white/20 items-center justify-between text-xs text-red-100">
            <span className="flex items-center gap-1 font-medium truncate">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              Avg: {formatINR(totals.averageGrandTotal)}
            </span>
            <span className="font-mono bg-black/20 text-white px-1.5 py-0.5 rounded text-[11px]">
              E4+F4
            </span>
          </div>
          {/* Micro mobile formula label */}
          <div className="sm:hidden text-[9px] font-mono text-red-200 mt-0.5 truncate">
            =E4+F4
          </div>
        </div>

      </div>
    </section>
  );
};
