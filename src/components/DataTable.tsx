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
  ExternalLink,
  LayoutList,
  Table as TableIcon
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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Inline editing row state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<SheetEntry>>({});
  
  // Row selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter & Sort
  const filteredAndSortedEntries = useMemo(() => {
    return entries
      .filter((row) => {
        const matchSearch =
          row.subject.toLowerCase().includes(search.toLowerCase()) ||
          row.baki.toLowerCase().includes(search.toLowerCase()) ||
          row.no.toString().includes(search);

        if (!matchSearch) return false;

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const handleSaveInlineEdit = (id: string) => {
    onInlineUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleCancelInlineEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

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
    if (window.confirm(`Delete ${selectedIds.size} selected entries?`)) {
      selectedIds.forEach((id) => onDeleteEntry(id));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      
      {/* Table Controls / Filter & Search Bar */}
      <div className="p-2.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Search Input */}
        <div className="flex items-center gap-1.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="main-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject, Baki, or No..."
              className="w-full pl-8 pr-7 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Toggle on Mobile */}
          <div className="sm:hidden flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-amber-100 text-amber-900' : 'text-slate-400'}`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded ${viewMode === 'cards' ? 'bg-amber-100 text-amber-900' : 'text-slate-400'}`}
              title="Card View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills with Tiny Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs justify-between sm:justify-end">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setBakiFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                bakiFilter === 'all'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({entries.length})
            </button>
            <button
              onClick={() => setBakiFilter('has_baki')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                bakiFilter === 'has_baki'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baki ({totals.pendingBakiCount})
            </button>
            <button
              onClick={() => setBakiFilter('settled')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                bakiFilter === 'settled'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paid
            </button>
          </div>

          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-[11px] font-semibold transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Del ({selectedIds.size})</span>
            </button>
          )}
        </div>

      </div>

      {/* MOBILE CARDS VIEW (Optional view on small screens) */}
      {viewMode === 'cards' ? (
        <div className="p-2 space-y-2 sm:hidden divide-y divide-slate-100">
          {filteredAndSortedEntries.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No entries found.
            </div>
          ) : (
            filteredAndSortedEntries.map((row) => {
              const rowSum = (Number(row.cc) || 0) + (Number(row.pp) || 0);
              const isSelected = selectedIds.has(row.id);
              return (
                <div 
                  key={row.id} 
                  className={`p-2.5 rounded-xl border border-slate-200 transition-colors ${
                    isSelected ? 'bg-amber-50/80' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        #{row.no}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs m-0">
                        {row.subject}
                      </h4>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartInlineEdit(row)}
                        className="p-1 rounded text-slate-500 hover:text-amber-800 hover:bg-amber-50"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateEntry(row)}
                        className="p-1 rounded text-slate-500 hover:text-blue-800 hover:bg-blue-50"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(row.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-slate-100 text-center font-mono">
                    <div className="bg-emerald-50/60 p-1 rounded border border-emerald-200">
                      <span className="text-[9px] text-emerald-700 block">CC</span>
                      <span className="text-xs font-bold text-emerald-900">{formatINR(row.cc)}</span>
                    </div>
                    <div className="bg-orange-50/60 p-1 rounded border border-orange-200">
                      <span className="text-[9px] text-orange-700 block">PP</span>
                      <span className="text-xs font-bold text-orange-950">{formatINR(row.pp)}</span>
                    </div>
                    <div className="bg-rose-50/60 p-1 rounded border border-rose-200">
                      <span className="text-[9px] text-rose-700 block">Total</span>
                      <span className="text-xs font-black text-rose-900">{formatINR(rowSum)}</span>
                    </div>
                  </div>

                  {/* Baki */}
                  {row.baki && (
                    <div className="mt-1.5 text-[10px] text-slate-600 bg-slate-50 p-1 rounded flex items-center justify-between">
                      <span className="text-slate-400">Baki:</span>
                      <span className="font-semibold text-amber-900">{row.baki}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* SPREADSHEET TABLE VIEW */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px] sm:min-w-full">
            
            {/* Soft Yellow Header Row */}
            <thead>
              <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300 text-[11px] sm:text-xs uppercase tracking-wider select-none">
                
                <th className="py-2 px-2 w-8 text-center border-r border-amber-200">
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
                  className="py-2 px-2 w-14 sm:w-20 text-center border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors"
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <span>No.</span>
                    {sortField === 'no' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
                    )}
                  </div>
                </th>

                {/* Subject */}
                <th 
                  onClick={() => handleSort('subject')}
                  className="py-2 px-3 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Subject / Work</span>
                    {sortField === 'subject' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
                    )}
                  </div>
                </th>

                {/* CC (Green Header) */}
                <th 
                  onClick={() => handleSort('cc')}
                  className="py-2 px-2.5 text-right w-24 sm:w-32 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors bg-emerald-100/40"
                >
                  <div className="flex items-center justify-end gap-1 text-emerald-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>CC</span>
                    {sortField === 'cc' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
                    )}
                  </div>
                </th>

                {/* PP (Orange Header) */}
                <th 
                  onClick={() => handleSort('pp')}
                  className="py-2 px-2.5 text-right w-24 sm:w-32 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors bg-orange-100/40"
                >
                  <div className="flex items-center justify-end gap-1 text-orange-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>PP</span>
                    {sortField === 'pp' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
                    )}
                  </div>
                </th>

                {/* Row Total (CC + PP) */}
                <th 
                  onClick={() => handleSort('total')}
                  className="py-2 px-2.5 text-right w-24 sm:w-32 border-r border-amber-200 cursor-pointer hover:bg-amber-200/70 transition-colors bg-rose-50/50"
                >
                  <div className="flex items-center justify-end gap-1 text-rose-900">
                    <span>Total</span>
                    {sortField === 'total' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
                    )}
                  </div>
                </th>

                {/* Baki */}
                <th className="py-2 px-3 border-r border-amber-200">
                  <span>Baki / Remarks</span>
                </th>

                {/* Actions */}
                <th className="py-2 px-2 w-24 sm:w-28 text-center">
                  <span>Actions</span>
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredAndSortedEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                    <p className="font-medium text-xs text-slate-600">No matching entries</p>
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
                      <td className="py-2 px-2 text-center border-r border-slate-100">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.id)}
                          className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>

                      {/* No. */}
                      <td className="py-2 px-2 text-center border-r border-slate-100 font-mono text-xs font-semibold text-slate-600">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.no ?? row.no}
                            onChange={(e) =>
                              setEditValues({ ...editValues, no: parseInt(e.target.value, 10) || 1 })
                            }
                            className="w-12 px-1 py-0.5 text-center bg-white border border-amber-400 rounded text-xs font-mono font-bold"
                          />
                        ) : (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                            {row.no}
                          </span>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="py-2 px-3 border-r border-slate-100">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.subject ?? row.subject}
                            onChange={(e) =>
                              setEditValues({ ...editValues, subject: e.target.value })
                            }
                            className="w-full px-2 py-0.5 bg-white border border-amber-400 rounded text-xs focus:outline-hidden"
                          />
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 group-hover:text-amber-900 transition-colors text-xs">
                              {row.subject}
                            </span>
                            {row.date && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {row.date}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* CC */}
                      <td className="py-2 px-2.5 text-right border-r border-slate-100 font-mono bg-emerald-50/20">
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
                            className="w-20 px-1 py-0.5 text-right bg-white border border-emerald-400 rounded text-xs font-mono font-bold text-emerald-800"
                          />
                        ) : (
                          <span className="inline-flex items-center font-bold text-emerald-800 text-xs">
                            {formatINR(row.cc)}
                          </span>
                        )}
                      </td>

                      {/* PP */}
                      <td className="py-2 px-2.5 text-right border-r border-slate-100 font-mono bg-orange-50/20">
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
                            className="w-20 px-1 py-0.5 text-right bg-white border border-orange-400 rounded text-xs font-mono font-bold text-orange-900"
                          />
                        ) : (
                          <span className="inline-flex items-center font-bold text-orange-900 text-xs">
                            {formatINR(row.pp)}
                          </span>
                        )}
                      </td>

                      {/* Row Total (CC + PP) */}
                      <td className="py-2 px-2.5 text-right border-r border-slate-100 font-mono bg-rose-50/20">
                        <span className="font-extrabold text-rose-800 text-xs">
                          {isEditing
                            ? formatINR(
                                (parseFloat(String(editValues.cc ?? row.cc)) || 0) +
                                  (parseFloat(String(editValues.pp ?? row.pp)) || 0)
                              )
                            : formatINR(rowSum)}
                        </span>
                      </td>

                      {/* Baki */}
                      <td className="py-2 px-3 border-r border-slate-100">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.baki ?? row.baki}
                            onChange={(e) =>
                              setEditValues({ ...editValues, baki: e.target.value })
                            }
                            className="w-full px-1.5 py-0.5 bg-white border border-amber-400 rounded text-xs"
                          />
                        ) : row.baki ? (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-medium border ${
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

                      {/* Actions: Small and Tiny Buttons with Maximum Icons */}
                      <td className="py-2 px-2 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveInlineEdit(row.id)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                              title="Save"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={handleCancelInlineEdit}
                              className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => handleStartInlineEdit(row)}
                              className="p-1 rounded text-slate-500 hover:text-amber-800 hover:bg-amber-100 transition-colors"
                              title="Quick Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditEntry(row)}
                              className="p-1 rounded text-slate-500 hover:text-blue-800 hover:bg-blue-50 transition-colors hidden sm:inline-block"
                              title="Detail Edit"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDuplicateEntry(row)}
                              className="p-1 rounded text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteEntry(row.id)}
                              className="p-1 rounded text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete"
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

            {/* Table Footer */}
            <tfoot>
              <tr className="bg-amber-100/90 text-amber-950 font-bold border-t-2 border-amber-400 text-xs">
                <td colSpan={3} className="py-2 px-3 border-r border-amber-300 text-right">
                  <span className="font-mono text-[11px] font-bold">TOTALS (Rows 8:1004):</span>
                </td>

                <td className="py-2 px-2.5 text-right border-r border-amber-300 font-mono bg-amber-200/60 font-extrabold text-amber-950 text-xs">
                  {formatINR(totals.ccTotal)}
                </td>

                <td className="py-2 px-2.5 text-right border-r border-amber-300 font-mono bg-orange-200/60 font-extrabold text-orange-950 text-xs">
                  {formatINR(totals.ppTotal)}
                </td>

                <td className="py-2 px-2.5 text-right border-r border-amber-300 font-mono bg-red-100 text-red-700 font-black text-xs">
                  {formatINR(totals.grandTotal)}
                </td>

                <td colSpan={2} className="py-2 px-3 text-[10px] text-slate-600 font-mono">
                  {filteredAndSortedEntries.length} / {totals.totalEntries} entries
                </td>
              </tr>
            </tfoot>

          </table>
        </div>
      )}

    </div>
  );
};
