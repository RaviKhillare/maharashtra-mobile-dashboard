import React from 'react';
import type { SheetTotals } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';
import { 
  Calculator, 
  TrendingUp, 
  Wallet, 
  Layers, 
  Clock, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface SummaryCardsProps {
  totals: SheetTotals;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totals }) => {
  return (
    <section className="mb-6">
      {/* ABHR Section Visual Anchor Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 bg-amber-500 text-white font-extrabold text-base tracking-wider rounded-md shadow-xs">
            ABHR
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 m-0 leading-tight">
              Summary & Live Sheet Calculations
            </h2>
            <p className="text-xs text-slate-500 m-0">
              Real-time formula simulation based on Google Sheet structure (Rows 8 : 1004)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 font-mono">
          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Total Rows: <strong className="text-slate-800">{formatNumber(totals.totalEntries)}</strong>
          </span>
          {totals.pendingBakiCount > 0 && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Baki/Pending: <strong>{totals.pendingBakiCount}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main 3 Visual Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        
        {/* 1. CC Total Card (Orange Theme) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50/40 rounded-2xl border-2 border-amber-300 p-5 shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs shadow-2xs">
                  CC
                </span>
                <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  CC Total
                </span>
              </div>
              <p className="text-xs text-amber-800/80 mt-1 font-medium">
                Customer Charges / Credit
              </p>
            </div>

            {/* Formula Badge */}
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-amber-800 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-full shadow-2xs">
              <Calculator className="w-3 h-3 text-amber-600" />
              =SUM(C8:C1004)
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-950 font-mono">
              {formatINR(totals.ccTotal)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              Live cumulative sum
            </span>
            <span className="font-mono text-amber-900 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">
              Col C (CC)
            </span>
          </div>
        </div>

        {/* 2. PP Total Card (Orange Theme) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50/40 rounded-2xl border-2 border-orange-300 p-5 shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500 text-white font-bold text-xs shadow-2xs">
                  PP
                </span>
                <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                  PP Total
                </span>
              </div>
              <p className="text-xs text-orange-800/80 mt-1 font-medium">
                Parts Price / Purchase
              </p>
            </div>

            {/* Formula Badge */}
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-orange-800 bg-orange-100/90 border border-orange-300/80 px-2 py-0.5 rounded-full shadow-2xs">
              <Calculator className="w-3 h-3 text-orange-600" />
              =SUM(D8:D1004)
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-orange-950 font-mono">
              {formatINR(totals.ppTotal)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-orange-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
              Live cumulative sum
            </span>
            <span className="font-mono text-orange-900 font-semibold bg-orange-100/70 px-1.5 py-0.5 rounded">
              Col D (PP)
            </span>
          </div>
        </div>

        {/* 3. Grand Total Card (Red Theme - Visual Anchor) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl border-2 border-red-500 p-5 shadow-md hover:shadow-lg transition-all group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 text-white font-bold text-xs backdrop-blur-xs">
                  <Wallet className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold tracking-wide uppercase text-red-100">
                  Grand Total
                </span>
              </div>
              <p className="text-xs text-red-200 mt-1 font-medium">
                Consolidated CC + PP Total
              </p>
            </div>

            {/* Formula Badge */}
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-white bg-red-900/50 border border-white/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              =E4+F4
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between relative z-10">
            <div className="text-3xl lg:text-4xl font-black tracking-tight text-white font-mono drop-shadow-xs">
              {formatINR(totals.grandTotal)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-red-100 relative z-10">
            <span className="flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
              Avg / Entry: {formatINR(totals.averageGrandTotal)}
            </span>
            <span className="font-mono bg-black/20 text-white px-2 py-0.5 rounded text-[11px]">
              E4(CC) + F4(PP)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
