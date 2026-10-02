import React from 'react';
import type { SheetEntry, SheetTotals } from '../types';
import { formatINR } from '../utils/formatters';

interface PrintViewProps {
  entries: SheetEntry[];
  totals: SheetTotals;
}

export const PrintView: React.FC<PrintViewProps> = ({ entries, totals }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide m-0">Maharashtra Mobile</h1>
          <h2 className="text-lg font-semibold text-slate-700 m-0">ABHR Ledger & Accounts Sheet</h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulating Rows 8 to 1004 • Printed on {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Summary box */}
        <div className="border border-black p-3 rounded text-right min-w-[200px]">
          <div className="text-xs">CC Total: <strong>{formatINR(totals.ccTotal)}</strong></div>
          <div className="text-xs">PP Total: <strong>{formatINR(totals.ppTotal)}</strong></div>
          <div className="text-sm font-bold border-t border-black mt-1 pt-1">
            Grand Total: {formatINR(totals.grandTotal)}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left text-xs border-collapse border border-black">
        <thead>
          <tr className="bg-slate-100 border-b border-black font-bold">
            <th className="border border-black p-2 w-12 text-center">No.</th>
            <th className="border border-black p-2">Subject / Description</th>
            <th className="border border-black p-2 text-right w-28">CC Amount</th>
            <th className="border border-black p-2 text-right w-28">PP Amount</th>
            <th className="border border-black p-2 text-right w-28">Row Total</th>
            <th className="border border-black p-2">Baki / Remarks</th>
            <th className="border border-black p-2 w-24">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row) => {
            const sum = (Number(row.cc) || 0) + (Number(row.pp) || 0);
            return (
              <tr key={row.id} className="border-b border-black/40">
                <td className="border border-black p-1.5 text-center font-mono">{row.no}</td>
                <td className="border border-black p-1.5 font-medium">{row.subject}</td>
                <td className="border border-black p-1.5 text-right font-mono">{formatINR(row.cc)}</td>
                <td className="border border-black p-1.5 text-right font-mono">{formatINR(row.pp)}</td>
                <td className="border border-black p-1.5 text-right font-mono font-bold">{formatINR(sum)}</td>
                <td className="border border-black p-1.5">{row.baki || '-'}</td>
                <td className="border border-black p-1.5 text-slate-600">{row.date || ''}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-slate-200 font-bold border-t-2 border-black">
            <td colSpan={2} className="border border-black p-2 text-right">TOTALS (=SUM & =E4+F4):</td>
            <td className="border border-black p-2 text-right font-mono">{formatINR(totals.ccTotal)}</td>
            <td className="border border-black p-2 text-right font-mono">{formatINR(totals.ppTotal)}</td>
            <td className="border border-black p-2 text-right font-mono text-sm">{formatINR(totals.grandTotal)}</td>
            <td colSpan={2} className="border border-black p-2">{entries.length} Total Records</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
