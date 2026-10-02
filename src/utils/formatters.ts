import type { SheetEntry, SheetTotals } from '../types';
import { INITIAL_ENTRIES } from '../data/initialData';

export const STORAGE_KEY = 'maharashtra_mobile_entries_v1';

export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

export function calculateTotals(entries: SheetEntry[]): SheetTotals {
  const ccTotal = entries.reduce((acc, row) => acc + (Number(row.cc) || 0), 0);
  const ppTotal = entries.reduce((acc, row) => acc + (Number(row.pp) || 0), 0);
  const grandTotal = ccTotal + ppTotal;
  
  const pendingBakiCount = entries.filter(
    (e) => e.baki && e.baki.trim().length > 0 && !e.baki.toLowerCase().includes('done') && !e.baki.toLowerCase().includes('clear') && !e.baki.toLowerCase().includes('paid')
  ).length;

  const averageGrandTotal = entries.length > 0 ? Math.round(grandTotal / entries.length) : 0;

  return {
    ccTotal,
    ppTotal,
    grandTotal,
    totalEntries: entries.length,
    pendingBakiCount,
    averageGrandTotal
  };
}

export function loadEntries(): SheetEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENTRIES));
      return INITIAL_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ENTRIES;
  } catch (err) {
    console.error('Failed to load local entries:', err);
    return INITIAL_ENTRIES;
  }
}

export function saveEntries(entries: SheetEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save entries to localStorage:', err);
  }
}

export function exportToCSV(entries: SheetEntry[], filename = 'maharashtra_mobile_abhr.csv'): void {
  const headers = ['No.', 'Subject', 'CC Amount', 'PP Amount', 'Total (CC+PP)', 'Baki / Remarks', 'Date'];
  const rows = entries.map((e) => [
    e.no,
    `"${(e.subject || '').replace(/"/g, '""')}"`,
    e.cc || 0,
    e.pp || 0,
    (Number(e.cc) || 0) + (Number(e.pp) || 0),
    `"${(e.baki || '').replace(/"/g, '""')}"`,
    `"${e.date || ''}"`
  ]);

  const totals = calculateTotals(entries);
  rows.push([]);
  rows.push(['TOTALS', '', totals.ccTotal, totals.ppTotal, totals.grandTotal, `Active rows: ${entries.length}`, '']);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(entries: SheetEntry[], filename = 'maharashtra_mobile_abhr.json'): void {
  const totals = calculateTotals(entries);
  const payload = {
    title: 'Maharashtra Mobile - ABHR Sheet Data',
    exportDate: new Date().toISOString(),
    totals: {
      ccTotal: totals.ccTotal,
      ppTotal: totals.ppTotal,
      grandTotal: totals.grandTotal,
      recordCount: totals.totalEntries
    },
    entries
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVContent(text: string): SheetEntry[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) return [];

  const result: SheetEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('TOTALS') || line.startsWith(',,,,')) continue;

    const parts: string[] = [];
    let insideQuotes = false;
    let current = '';

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        if (insideQuotes && line[c + 1] === '"') {
          current += '"';
          c++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current);

    if (parts.length >= 2) {
      const noVal = parseInt(parts[0], 10);
      const subject = parts[1] || '';
      const cc = parseFloat(parts[2]) || 0;
      const pp = parseFloat(parts[3]) || 0;
      const baki = parts[5] || parts[4] || '';
      const date = parts[6] || new Date().toISOString().split('T')[0];

      if (subject || cc || pp) {
        result.push({
          id: 'imported-' + Math.random().toString(36).substring(2, 9),
          no: isNaN(noVal) ? result.length + 1 : noVal,
          subject: subject.trim(),
          cc,
          pp,
          baki: baki.trim(),
          date
        });
      }
    }
  }

  return result;
}
