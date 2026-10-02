import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SheetEntry } from './types';
import { INITIAL_ENTRIES } from './data/initialData';
import { loadEntries, saveEntries, calculateTotals } from './utils/formatters';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { EntryForm } from './components/EntryForm';
import { DataTable } from './components/DataTable';
import { ImportExportModal } from './components/ImportExportModal';
import { EditRowModal } from './components/EditRowModal';
import { HelpModal } from './components/HelpModal';
import { PrintView } from './components/PrintView';

export function App() {
  const [entries, setEntries] = useState<SheetEntry[]>(() => loadEntries());
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(() => new Date());
  
  // Modals state
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SheetEntry | null>(null);

  // Live Formula Calculations
  const totals = useMemo(() => calculateTotals(entries), [entries]);

  // Next suggested row number
  const nextSuggestedNo = useMemo(() => {
    if (entries.length === 0) return 1;
    const maxNo = Math.max(...entries.map((e) => e.no || 0));
    return maxNo + 1;
  }, [entries]);

  // Persist entries to localStorage whenever they change
  useEffect(() => {
    saveEntries(entries);
    setLastSavedAt(new Date());
  }, [entries]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing inside an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'Escape') {
        setIsExportImportOpen(false);
        setIsHelpOpen(false);
        setEditingEntry(null);
      } else if ((e.key === 'n' || e.key === 'N') && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const input = document.getElementById('entry-subject-input');
        input?.focus();
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add new row entry
  const handleAddEntry = useCallback((newRow: Omit<SheetEntry, 'id'>) => {
    const entry: SheetEntry = {
      ...newRow,
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
    };
    setEntries((prev) => [...prev, entry]);
  }, []);

  // Inline update
  const handleInlineUpdate = useCallback((id: string, updatedFields: Partial<SheetEntry>) => {
    setEntries((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...updatedFields } : row))
    );
  }, []);

  // Delete row
  const handleDeleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((row) => row.id !== id));
  }, []);

  // Duplicate row
  const handleDuplicateEntry = useCallback((entry: SheetEntry) => {
    const newNo = Math.max(...entries.map((e) => e.no || 0)) + 1;
    const duplicated: SheetEntry = {
      ...entry,
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      no: newNo,
      subject: `${entry.subject} (Copy)`
    };
    setEntries((prev) => [...prev, duplicated]);
  }, [entries]);

  // Save Modal Edit
  const handleSaveModalEdit = useCallback((updated: SheetEntry) => {
    setEntries((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
    setEditingEntry(null);
  }, []);

  // Reset to sample entries
  const handleResetData = useCallback(() => {
    if (window.confirm('Reset all entries back to default Maharashtra Mobile sample data?')) {
      setEntries(INITIAL_ENTRIES);
    }
  }, []);

  // Import handler
  const handleImportEntries = useCallback((imported: SheetEntry[], replace: boolean) => {
    if (replace) {
      setEntries(imported);
    } else {
      setEntries((prev) => [...prev, ...imported]);
    }
  }, []);

  // Print view trigger
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Printable Sheet (hidden during normal display) */}
      <PrintView entries={entries} totals={totals} />

      {/* Screen App Layout */}
      <div className="print:hidden flex flex-col min-h-screen">
        
        {/* Navigation & Branding Header */}
        <Header
          onOpenAddRow={() => {
            const input = document.getElementById('entry-subject-input');
            input?.focus();
          }}
          onOpenExportImport={() => setIsExportImportOpen(true)}
          onPrint={handlePrint}
          onResetData={handleResetData}
          onOpenHelp={() => setIsHelpOpen(true)}
          lastSavedAt={lastSavedAt}
          totalCount={entries.length}
        />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Top Visual Anchors: Prominent ABHR Header & Color-Coded Summary Cards */}
          <SummaryCards totals={totals} />

          {/* New Entry Row Form with auto-calculated row totals */}
          <EntryForm
            nextSuggestedNo={nextSuggestedNo}
            onAddEntry={handleAddEntry}
          />

          {/* Spreadsheet Data Table with Yellow Header, CC/PP Accents, Search, & Inline Edit */}
          <DataTable
            entries={entries}
            totals={totals}
            onEditEntry={(entry) => setEditingEntry(entry)}
            onDeleteEntry={handleDeleteEntry}
            onDuplicateEntry={handleDuplicateEntry}
            onInlineUpdate={handleInlineUpdate}
          />

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Maharashtra Mobile</span>
              <span>•</span>
              <span>Inspired by Google Sheet ABHR structure</span>
              <span>•</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Formula simulation: CC =SUM(C8:C1004) | PP =SUM(D8:D1004) | GT =E4+F4
              </span>
            </div>
            <div>
              Auto-persisted to Local Storage & Ready for GitHub / Headless CMS
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
      <ImportExportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        entries={entries}
        onImportEntries={handleImportEntries}
      />

      <EditRowModal
        isOpen={!!editingEntry}
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={handleSaveModalEdit}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
}

export default App;
