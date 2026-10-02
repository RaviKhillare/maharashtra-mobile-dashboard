import React, { useState, useMemo } from 'react';
import type { SheetEntry, SheetTotals, SortField, SortDirection } from '../types';
import { formatINR } from '../utils/formatters';
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface DataTableProps {
  entries: SheetEntry[];
  totals: SheetTotals;
  onEditEntry: (entry: SheetEntry) => void;
  onDeleteEntry: (id: string) => void;
  onDuplicateEntry: (entry: SheetEntry) => void;
  onInlineUpdate: (id: string, updatedFields: Partial<SheetEntry>) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  entries,
  totals,
  onEditEntry,
  onDeleteEntry,
  onDuplicateEntry,
  onInlineUpdate
}) => {
  const [search, setSearch] = useState('');
  const [bakiFilter, setBakiFilter] = useState<'all' | 'has_baki' | 'settled'>('all');
  const [sortField, setSortField] = useState<SortField>('no');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Inline editing row state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<SheetEntry>>({});
  
  // Row selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter & Sort
  const filteredAndSortedEntries = useMemo(() => {
    return entries
      .filter((row) => {
        // Search filter
        const matchSearch =
          row.subject.toLowerCase().includes(search.toLowerCase()) ||
          row.baki.toLowerCase().includes(search.toLowerCase()) ||
          row.no.toString().includes(search);

        if (!matchSearch) return false;

        // Baki filter
        if (bakiFilter === 'has_baki') {
          return (
            row.baki &&
            row.baki.trim().length > 0 &&
            !row.baki.toLowerCase().includes('done') &&
            !row.baki.toLowerCase().includes('clear') &&
            !row.baki.toLowerCase().includes('paid')
          );
        }
        if (bakiFilter === 'settled') {
          return (
            !row.baki ||
            row.baki.trim().length === 0 ||
            row.baki.toLowerCase().includes('done') ||
            row.baki.toLowerCase().includes('clear') ||
            row.baki.toLowerCase().includes('paid')
          );
        }

        return true;
      })
      .sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        if (sortField === 'total') {
          valA = (Number(a.cc) || 0) + (Number(a.pp) || 0);
          valB = (Number(b.cc) || 0) + (Number(b.pp) || 0);
        } else {
          valA = a[sortField];
          valB = b[sortField];
        }

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (String(valB) || '').toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [entries, search, bakiFilter, sortField, sortDirection]);

  // Handle Sort Click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Start Inline Edit
  const handleStartInlineEdit = (entry: SheetEntry) => {
    setEditingId(entry.id);
    setEditValues({
      no: entry.no,
      subject: entry.subject,
      cc: entry.cc,
      pp: entry.pp,
      baki: entry.baki
    });
  };

  // Save Inline Edit
  const handleSaveInlineEdit = (id: string) => {
    onInlineUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  // Cancel Inline Edit
  const handleCancelInlineEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Select All Toggle
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredAndSortedEntries.map((row) => row.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected entries?`)) {
      selectedIds.forEach((id) => onDeleteEntry(id));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Controls / Filter & Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Subject (e.g. 'love Bar sound'), Baki, or No..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setBakiFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                bakiFilter === 'all'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({entries.length})
            </button>
            <button
              onClick={() => setBakiFilter('has_baki')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                bakiFilter === 'has_baki'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Baki ({totals.pendingBakiCount})
            </button>
            <button
              onClick={() => setBakiFilter('settled')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                bakiFilter === 'settled'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settled / Paid
            </button>
          </div>

          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedIds.size})
            </button>
          )}
        </div>

      </div>

      {/* Spreadsheet Inspired Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          
          {/* Header Row: Soft Yellow matching Google Sheet style */}
          <thead>
            <tr className="bg-amber-100/80 text-amber-950 font-bold border-b-2 border-amber-300 text-xs uppercase tracking-wider select-none">
              
              <th className="py-3 px-3 w-10 text-center border-r border-amber-200">
                <input
                  type="checkbox"
                  checked={
                    filteredAndSortedEntries.length > 0 &&
                    selectedIds.size === filteredAndSortedEntries.length
                  }
                  onChange={handleSelectAll}
                  className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </th>

              {/* No. */}
              <th 
                onClick={() => handleSort('no')}
                className="py-3 px-3 w-20 text-center border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>No.</span>
                  {sortField === 'no' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              {/* Subject */}
              <th 
                onClick={() => handleSort('subject')}
                className="py-3 px-4 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Subject / Work Details</span>
                  {sortField === 'subject' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              {/* CC (Numeric - Defined Green Accent Header) */}
              <th 
                onClick={() => handleSort('cc')}
                className="py-3 px-4 text-right w-36 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors bg-emerald-100/40"
              >
                <div className="flex items-center justify-end gap-1 text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>CC (Col C)</span>
                  {sortField === 'cc' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              {/* PP (Numeric - Defined Orange/Contrasting Accent Header) */}
              <th 
                onClick={() => handleSort('pp')}
                className="py-3 px-4 text-right w-36 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors bg-orange-100/40"
              >
                <div className="flex items-center justify-end gap-1 text-orange-950">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>PP (Col D)</span>
                  {sortField === 'pp' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              {/* Row Total (CC + PP) */}
              <th 
                onClick={() => handleSort('total')}
                className="py-3 px-4 text-right w-36 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors bg-rose-50/50"
              >
                <div className="flex items-center justify-end gap-1 text-rose-900">
                  <span>Total (CC+PP)</span>
                  {sortField === 'total' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              {/* Baki */}
              <th className="py-3 px-4 border-r border-amber-200">
                <span>Baki / Remarks</span>
              </th>

              {/* Actions */}
              <th className="py-3 px-3 w-32 text-center">
                <span>Actions</span>
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {filteredAndSortedEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No entries match your search criteria</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting search or add a new record above</p>
                </td>
              </tr>
            ) : (
              filteredAndSortedEntries.map((row, index) => {
                const isEditing = editingId === row.id;
                const isSelected = selectedIds.has(row.id);
                const rowSum = (Number(row.cc) || 0) + (Number(row.pp) || 0);
                const hasBakiNote =
                  row.baki &&
                  row.baki.trim().length > 0 &&
                  !row.baki.toLowerCase().includes('done') &&
                  !row.baki.toLowerCase().includes('clear') &&
                  !row.baki.toLowerCase().includes('paid');

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-amber-50/40 group ${
                      isSelected ? 'bg-amber-50/80' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row.id)}
                        className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>

                    {/* No. (Sheet row indicator) */}
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono text-xs font-semibold text-slate-600">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.no ?? row.no}
                          onChange={(e) =>
                            setEditValues({ ...editValues, no: parseInt(e.target.value, 10) || 1 })
                          }
                          className="w-14 px-1 py-1 text-center bg-white border border-amber-400 rounded text-xs font-mono font-bold"
                        />
                      ) : (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                          {row.no}
                        </span>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="py-2.5 px-4 border-r border-slate-100">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.subject ?? row.subject}
                          onChange={(e) =>
                            setEditValues({ ...editValues, subject: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-amber-400 rounded text-sm focus:outline-hidden"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-amber-900 transition-colors">
                            {row.subject}
                          </span>
                          {row.date && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              {row.date}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* CC (Defined Green Accent) */}
                    <td className="py-2.5 px-4 text-right border-r border-slate-100 font-mono bg-emerald-50/20">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.cc ?? row.cc}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              cc: parseFloat(e.target.value) || 0
                            })
                          }
                          className="w-24 px-2 py-1 text-right bg-white border border-emerald-400 rounded text-sm font-mono font-bold text-emerald-800"
                        />
                      ) : (
                        <span className="inline-flex items-center font-bold text-emerald-800 text-sm">
                          {formatINR(row.cc)}
                        </span>
                      )}
                    </td>

                    {/* PP (Defined Orange Accent) */}
                    <td className="py-2.5 px-4 text-right border-r border-slate-100 font-mono bg-orange-50/20">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.pp ?? row.pp}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              pp: parseFloat(e.target.value) || 0
                            })
                          }
                          className="w-24 px-2 py-1 text-right bg-white border border-orange-400 rounded text-sm font-mono font-bold text-orange-900"
                        />
                      ) : (
                        <span className="inline-flex items-center font-bold text-orange-900 text-sm">
                          {formatINR(row.pp)}
                        </span>
                      )}
                    </td>

                    {/* Row Total (CC + PP) */}
                    <td className="py-2.5 px-4 text-right border-r border-slate-100 font-mono bg-rose-50/20">
                      <span className="font-extrabold text-rose-800 text-sm">
                        {isEditing
                          ? formatINR(
                              (parseFloat(String(editValues.cc ?? row.cc)) || 0) +
                                (parseFloat(String(editValues.pp ?? row.pp)) || 0)
                            )
                          : formatINR(rowSum)}
                      </span>
                    </td>

                    {/* Baki */}
                    <td className="py-2.5 px-4 border-r border-slate-100">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.baki ?? row.baki}
                          onChange={(e) =>
                            setEditValues({ ...editValues, baki: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-amber-400 rounded text-xs"
                        />
                      ) : row.baki ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            hasBakiNote
                              ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {row.baki}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveInlineEdit(row.id)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelInlineEdit}
                            className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartInlineEdit(row)}
                            className="p-1 rounded text-slate-500 hover:text-amber-800 hover:bg-amber-100 transition-colors"
                            title="Quick Inline Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditEntry(row)}
                            className="p-1 rounded text-slate-500 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                            title="Open Detail Modal Edit"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateEntry(row)}
                            className="p-1 rounded text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                            title="Duplicate Entry"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEntry(row.id)}
                            className="p-1 rounded text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

          {/* Sticky Table Footer: Live Calculation Simulation (Rows 8 to 1004) */}
          <tfoot>
            <tr className="bg-amber-100/90 text-amber-950 font-bold border-t-2 border-amber-400 text-sm">
              <td colSpan={3} className="py-3 px-4 border-r border-amber-300 text-right">
                <div className="flex items-center justify-end gap-2 font-mono">
                  <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-wider">
                    ABHR FORMULAS
                  </span>
                  <span>TOTALS (Simulating Rows 8:1004):</span>
                </div>
              </td>

              {/* CC Total Column footer */}
              <td className="py-3 px-4 text-right border-r border-amber-300 font-mono bg-amber-200/60">
                <div className="flex flex-col items-end">
                  <span className="text-base font-extrabold text-amber-950">
                    {formatINR(totals.ccTotal)}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-800">
                    =SUM(C8:C1004)
                  </span>
                </div>
              </td>

              {/* PP Total Column footer */}
              <td className="py-3 px-4 text-right border-r border-amber-300 font-mono bg-orange-200/60">
                <div className="flex flex-col items-end">
                  <span className="text-base font-extrabold text-orange-950">
                    {formatINR(totals.ppTotal)}
                  </span>
                  <span className="text-[10px] font-semibold text-orange-800">
                    =SUM(D8:D1004)
                  </span>
                </div>
              </td>

              {/* Grand Total Column footer (Red theme) */}
              <td className="py-3 px-4 text-right border-r border-amber-300 font-mono bg-red-100 text-red-950">
                <div className="flex flex-col items-end">
                  <span className="text-base font-black text-red-700">
                    {formatINR(totals.grandTotal)}
                  </span>
                  <span className="text-[10px] font-bold text-red-700">
                    =E4+F4
                  </span>
                </div>
              </td>

              <td colSpan={2} className="py-3 px-4 text-xs text-slate-600 font-mono">
                {filteredAndSortedEntries.length} displayed / {totals.totalEntries} total
              </td>
            </tr>
          </tfoot>

        </table>
      </div>

    </div>
  );
};
