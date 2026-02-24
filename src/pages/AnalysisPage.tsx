import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/useApp';
import { analyzeBenford } from '../services/benfordEngine';
import { Table, MagnifyingGlass, ArrowRight, WarningCircle, Calculator, Database } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export const AnalysisPage: React.FC = () => {
  const { currentDataset, setAnalysisResult, addToHistory, negativeValueHandling } = useApp();
  const navigate = useNavigate();
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentDataset) {
    return <AnalysisEmptyState onUpload={() => navigate('/upload')} />;
  }

  const defaultColumn = currentDataset.numericColumns[0] ?? '';
  const effectiveSelectedColumn = selectedColumn || defaultColumn;

  const handleAnalyze = () => {
    if (!effectiveSelectedColumn) return;
    const result = analyzeBenford(currentDataset.data, effectiveSelectedColumn, currentDataset.name, {
      ignoreZeros: true,
      negativeHandling: negativeValueHandling
    });
    setAnalysisResult(result);
    addToHistory(result);
    navigate('/');
  };

  const filteredColumns = currentDataset.columns.filter(col =>
    col.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-7xl mx-auto py-10">
        <AnalysisHeader onAnalyze={handleAnalyze} disabled={!effectiveSelectedColumn} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <ColumnSelector
            filteredColumns={filteredColumns}
            numericColumns={currentDataset.numericColumns}
            selectedColumn={effectiveSelectedColumn}
            onSelectColumn={setSelectedColumn}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showNoNumeric={currentDataset.numericColumns.length === 0}
          />
          <DataPreview
            name={currentDataset.name}
            count={currentDataset.data.length}
            columns={currentDataset.columns}
            rows={currentDataset.data}
            selectedColumn={effectiveSelectedColumn}
          />
        </div>
      </div>
    </LazyMotion>
  );
};

const AnalysisEmptyState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <LazyMotion features={domAnimation}>
    <div className="flex flex-col items-start justify-center min-h-[70vh] px-10">
      <m.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="max-w-2xl"
      >
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20 text-emerald-500">
          <Calculator size={40} weight="duotone" />
        </div>
        <h2 className="text-large font-bold text-(--text-primary) mb-6 tracking-tighter leading-none">
          Analysis <br />
          <span className="text-(--brand-primary)">not configured.</span>
        </h2>
        <p className="text-secondary text-(--text-secondary) max-w-md mb-10 leading-relaxed">
          Please upload a dataset first to configure and run the Benford distribution analysis.
        </p>
        <m.button
          whileHover={{ scale: 1.05, x: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpload}
          className="group flex items-center gap-4 px-10 py-5 bg-(--brand-primary) hover:bg-(--brand-hover) text-(--brand-text) rounded-full font-bold transition-all shadow-sm"
        >
          <span>Go to Upload</span>
          <ArrowRight size={24} weight="bold" />
        </m.button>
      </m.div>
    </div>
  </LazyMotion>
);

const AnalysisHeader: React.FC<{ onAnalyze: () => void; disabled: boolean }> = ({ onAnalyze, disabled }) => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
    <m.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <span className="text-(--brand-primary) font-bold uppercase tracking-[0.3em] text-tiny mb-4 block">Analysis Configuration</span>
      <h1 className="text-large md:text-5xl font-bold text-(--text-primary) tracking-tighter leading-none italic">Select Data</h1>
      <p className="text-secondary text-(--text-secondary) mt-4 font-medium">Choose which column (vector) you want to analyze for Benford's Law compliance.</p>
    </m.div>

    <m.button
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAnalyze}
      disabled={disabled}
      className="flex items-center gap-4 px-10 py-5 bg-(--brand-primary) hover:bg-(--brand-hover) disabled:opacity-20 disabled:grayscale text-(--brand-text) rounded-full font-bold transition-all shadow-sm"
    >
      <Calculator size={24} weight="bold" />
      <span>Run Analysis</span>
      <ArrowRight size={24} weight="bold" />
    </m.button>
  </header>
);

const ColumnSelector: React.FC<{
  filteredColumns: string[];
  numericColumns: string[];
  selectedColumn: string;
  onSelectColumn: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showNoNumeric: boolean;
}> = ({ filteredColumns, numericColumns, selectedColumn, onSelectColumn, searchQuery, onSearchChange, showNoNumeric }) => (
  <div className="lg:col-span-4 space-y-6">
    <div className="glass-panel p-8 relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-(--bg-base) rounded-2xl flex items-center justify-center border border-(--border-low) text-(--brand-primary)">
          <Table size={24} weight="duotone" />
        </div>
        <h3 className="text-header font-bold text-(--text-primary) tracking-tight">Available Columns</h3>
      </div>

      <div className="relative mb-6">
        <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-tertiary)" />
        <input
          type="text"
          placeholder="Search columns..."
          className="w-full bg-(--bg-base)/50 border border-(--border-low) rounded-2xl pl-12 pr-4 py-4 text-caption focus:outline-none focus:border-(--brand-primary)/50 transition-colors text-(--text-primary) font-medium"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-2 max-h-125 overflow-auto pr-2 custom-scrollbar">
        {filteredColumns.map(col => {
          const isNumeric = numericColumns.includes(col);
          return (
          <m.button
              key={col}
              whileHover={isNumeric ? { x: 4 } : {}}
              onClick={() => isNumeric && onSelectColumn(col)}
              className={clsx(
                'w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border',
                selectedColumn === col
                  ? 'bg-(--brand-surface) border-(--brand-primary)/30 text-(--brand-primary)'
                  : isNumeric
                    ? 'bg-transparent border-transparent text-(--text-secondary) hover:bg-(--bg-base)'
                    : 'bg-transparent border-transparent text-(--text-tertiary) cursor-not-allowed opacity-50'
              )}
            >
              <span className="text-caption font-bold truncate tracking-tight">{col}</span>
              {isNumeric ? (
                <div className="text-tiny font-bold uppercase tracking-widest bg-(--brand-primary) text-(--brand-text) px-2 py-0.5 rounded shadow-sm">
                  Num
                </div>
              ) : (
                <div className="text-tiny font-bold uppercase tracking-widest bg-(--bg-surface) text-(--text-tertiary) px-2 py-0.5 rounded">
                  Str
                </div>
              )}
          </m.button>
          );
        })}
      </div>

      {showNoNumeric && (
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-4 text-red-400"
        >
          <WarningCircle size={24} weight="bold" className="shrink-0" />
          <p className="text-tiny font-bold leading-relaxed tracking-tight">
            No numeric columns identified. Benford analysis requires numbers to work.
          </p>
        </m.div>
      )}
    </div>
  </div>
);

const DataPreview: React.FC<{
  name: string;
  count: number;
  columns: string[];
  rows: Array<Record<string, any>>;
  selectedColumn: string;
}> = ({ name, count, columns, rows, selectedColumn }) => (
  <div className="lg:col-span-8">
    <div className="glass-panel overflow-hidden h-full flex flex-col">
      <div className="p-8 border-b border-(--border-low) flex items-center justify-between bg-(--bg-base)/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-(--bg-overlay) rounded-xl flex items-center justify-center border border-(--border-low) text-(--text-tertiary)">
            <Database size={20} weight="duotone" />
          </div>
          <h3 className="font-bold text-(--text-primary) tracking-tight text-header">Raw Data Matrix Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">{count} Records</span>
          <span className="w-1 h-1 bg-(--border-low) rounded-full" />
          <span className="text-tiny font-mono text-(--text-tertiary) uppercase">{name}</span>
        </div>
      </div>
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-caption border-collapse">
          <thead className="sticky top-0 bg-(--bg-base) z-10">
            <tr>
              {columns.slice(0, 6).map(col => (
                <th
                  key={col}
                  className={clsx(
                    'px-8 py-5 font-bold text-(--text-tertiary) uppercase tracking-[0.2em] text-tiny border-b border-(--border-low) shadow-sm',
                    selectedColumn === col && 'text-(--brand-primary) bg-(--brand-primary)/3'
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-low)">
            {rows.slice(0, 20).map((row) => {
              const rowKey = columns.slice(0, 6).map(col => String(row[col])).join('|');
              return (
                <tr key={rowKey} className="hover:bg-(--bg-surface)/20 transition-colors group">
                  {columns.slice(0, 6).map(col => (
                    <td
                      key={col}
                      className={clsx(
                        'px-8 py-5 text-(--text-secondary) font-mono text-tiny transition-colors',
                        selectedColumn === col && 'bg-(--brand-primary)/2 font-bold text-(--text-primary)'
                      )}
                    >
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length > 20 && (
          <div className="p-8 text-center text-(--text-tertiary) text-tiny font-bold uppercase tracking-[0.3em] bg-(--bg-base)/10 italic">
            End of Preview Matrix — {rows.length - 20} Additional records truncated
          </div>
        )}
      </div>
    </div>
  </div>
);
