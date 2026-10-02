import React, { useState } from 'react';
import type { SheetEntry } from '../types';
import { exportToCSV, exportToJSON, parseCSVContent } from '../utils/formatters';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  FileCode, 
  AlertCircle,
  Database
} from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: SheetEntry[];
  onImportEntries: (entries: SheetEntry[], replace: boolean) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  entries,
  onImportEntries
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(entries, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    setImportError(null);
    setImportSuccess(null);

    if (!importText.trim()) {
      setImportError('Please paste JSON/CSV text or choose a file to import.');
      return;
    }

    try {
      let parsedEntries: SheetEntry[] = [];
      const trimmed = importText.trim();

      if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.includes('"entries"'))) {
        // JSON format
        const json = JSON.parse(trimmed);
        const list = Array.isArray(json) ? json : json.entries;
        if (!Array.isArray(list)) {
          throw new Error('JSON does not contain a valid array of entries');
        }
        parsedEntries = list.map((item: any, idx: number) => ({
          id: item.id || 'imp-' + Math.random().toString(36).substring(2, 9),
          no: Number(item.no) || idx + 1,
          subject: item.subject || 'Imported Entry',
          cc: Number(item.cc) || 0,
          pp: Number(item.pp) || 0,
          baki: item.baki || '',
          date: item.date || new Date().toISOString().split('T')[0]
        }));
      } else {
        // CSV format
        parsedEntries = parseCSVContent(trimmed);
      }

      if (parsedEntries.length === 0) {
        throw new Error('No valid row entries found in the provided data.');
      }

      onImportEntries(parsedEntries, importMode === 'replace');
      setImportSuccess(`Successfully imported ${parsedEntries.length} entries!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse data. Ensure it is valid JSON or CSV.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 m-0">
                Data Persistence & Export/Import
              </h3>
              <p className="text-xs text-slate-500 m-0">
                Export to CSV/JSON or easily link data to GitHub / Headless CMS
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

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'export'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Data ({entries.length} rows)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'import'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import / Restore
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Choose your preferred export format. CSV files can be directly opened in Microsoft Excel or Google Sheets, while JSON provides structured schema for CMS and developers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CSV Export Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                      <FileSpreadsheetIcon className="w-5 h-5 text-emerald-600" />
                      Google Sheets / Excel (CSV)
                    </div>
                    <p className="text-xs text-slate-500">
                      Standard comma-separated format including header row and formula sum lines.
                    </p>
                  </div>
                  <button
                    onClick={() => exportToCSV(entries)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CSV (.csv)
                  </button>
                </div>

                {/* JSON Export Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-orange-400 hover:bg-orange-50/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
                      <FileCode className="w-5 h-5 text-indigo-600" />
                      Structured JSON Data
                    </div>
                    <p className="text-xs text-slate-500">
                      Clean JSON structure ready for GitHub repository storage, Firebase, or Headless CMS.
                    </p>
                  </div>
                  <button
                    onClick={() => exportToJSON(entries)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download JSON (.json)
                  </button>
                </div>
              </div>

              {/* Copy Raw JSON to Clipboard */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Direct JSON Payload (for GitHub commit / REST API):
                  </span>
                  <button
                    onClick={handleCopyJSON}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy JSON'}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono max-h-36 overflow-y-auto">
                  <pre>{JSON.stringify(entries.slice(0, 3), null, 2)}</pre>
                  {entries.length > 3 && (
                    <span className="text-slate-500">... and {entries.length - 3} more records</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Import Tab */
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Upload a CSV or JSON file, or paste your data text below to import records into the dashboard.
              </p>

              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              {/* File upload input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select CSV or JSON file from computer:
                </label>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer border border-slate-200 rounded-lg p-1"
                />
              </div>

              {/* Paste Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Or paste CSV or JSON content directly:
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste CSV rows or JSON array here..."
                  rows={5}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Import Options (Append vs Replace) */}
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Append to existing entries</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-red-700 font-semibold">Replace all existing entries</span>
                </label>
              </div>

              <button
                onClick={handleExecuteImport}
                className="w-full py-2.5 rounded-lg bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs"
              >
                Execute Import
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

// Helper icon
function FileSpreadsheetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M8 13h2"/>
      <path d="M14 13h2"/>
      <path d="M8 17h2"/>
      <path d="M14 17h2"/>
    </svg>
  );
}
