import React from 'react';
import { useApp } from '../store/useApp';
import { useNavigate } from 'react-router-dom';
import { 
  ClockCounterClockwise, 
  Trash, 
  ArrowSquareOut, 
  Database, 
  MagnifyingGlass,
  WarningCircle,
  Plus
} from '@phosphor-icons/react';
import { Sparkline } from '../components/ui/Sparkline';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export const HistoryPage: React.FC = () => {
  const { history, setAnalysisResult, removeFromHistory, clearHistory } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.columnName.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoad = (item: any) => {
    setAnalysisResult(item);
    navigate('/');
  };

  const riskColors = {
    low: 'text-[var(--color-anomaly-low)] bg-[var(--color-anomaly-low)]/10 border-[var(--color-anomaly-low)]/20',
    medium: 'text-[var(--color-anomaly-medium)] bg-[var(--color-anomaly-medium)]/10 border-[var(--color-anomaly-medium)]/20',
    high: 'text-[var(--color-anomaly-high)] bg-[var(--color-anomaly-high)]/10 border-[var(--color-anomaly-high)]/20'
  };

  if (history.length === 0) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="flex flex-col items-start justify-center min-h-[70vh] px-10">
          <m.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="max-w-2xl"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20">
              <ClockCounterClockwise size={40} weight="duotone" className="text-emerald-500" />
            </div>
            <h2 className="text-large font-bold text-(--text-primary) mb-6 tracking-tighter leading-none">
              Archive is <br />
              <span className="text-(--text-tertiary)">vacant.</span>
            </h2>
            <p className="text-secondary text-(--text-secondary) max-w-md mb-10 leading-relaxed">
              Your previous analysis results will be automatically indexed here for future reference.
            </p>
            <m.button
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="group flex items-center gap-4 px-10 py-5 bg-(--brand-primary) hover:bg-(--brand-hover) text-(--brand-text) rounded-full font-bold transition-all shadow-sm"
            >
              <span>Start First Analysis</span>
              <Plus size={24} weight="bold" />
            </m.button>
          </m.div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-7xl mx-auto py-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
        <m.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <span className="text-(--brand-primary) font-bold uppercase tracking-[0.3em] text-tiny mb-4 block">Engine Archive</span>
          <h1 className="text-large font-bold text-(--text-primary) tracking-tighter leading-none">Analysis History</h1>
          <p className="text-secondary text-(--text-secondary) mt-4 font-medium">Revisit and manage historical logarithmic distribution tests.</p>
        </m.div>
        
        <button
          onClick={clearHistory}
          className="flex items-center gap-3 px-6 py-3 text-anomaly-high hover:bg-anomaly-high/10 rounded-full transition-all text-caption font-bold uppercase tracking-widest border border-transparent hover:border-anomaly-high/20"
        >
          <Trash size={20} weight="bold" />
          Clear Registry
        </button>
      </header>

      <div className="relative mb-10 group">
        <MagnifyingGlass size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-(--text-tertiary) group-focus-within:text-(--brand-primary) transition-colors" />
        <input
          type="text"
          placeholder="Filter archive by dataset or vector name..."
          className="w-full bg-(--bg-base)/50 border border-(--border-low) rounded-3xl pl-14 pr-6 py-5 text-(--text-primary) text-secondary font-medium focus:outline-none focus:border-[var(--brand-primary)]/50 transition-all shadow-inner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-panel overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-(--bg-base)/40">
                <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em]">Dataset & Vector</th>
                <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em] text-center">Trendline</th>
                <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em]">Risk Context</th>
                <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em] text-right">Deviation</th>
                <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em] text-right">Timestamp</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-low)">
              {filteredHistory.map((item, idx) => (
                <m.tr 
                  key={item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-(--bg-surface)/20 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-(--bg-base) rounded-xl flex items-center justify-center border border-(--border-low) text-(--text-tertiary) group-hover:text-(--brand-primary) transition-colors">
                        <Database size={20} weight="duotone" />
                      </div>
                      <div>
                        <div className="font-bold text-(--text-primary) text-caption tracking-tight">{item.name}</div>
                        <div className="text-tiny text-(--text-tertiary) font-mono uppercase tracking-tighter">Vector: {item.columnName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <Sparkline 
                        data={item.results} 
                        color={item.risk === 'low' ? 'var(--color-anomaly-low)' : item.risk === 'medium' ? 'var(--color-anomaly-medium)' : 'var(--color-anomaly-high)'} 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={clsx(
                      "px-3 py-1 rounded-lg text-tiny font-bold uppercase tracking-widest border shadow-sm",
                      riskColors[item.risk]
                    )}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="font-mono font-bold text-(--text-secondary) text-caption tracking-tighter">{item.deviationScore.toFixed(1)}%</div>
                  </td>
                  <td className="px-8 py-6 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-caption font-bold text-(--text-secondary)">{format(item.timestamp, 'MMM d, yyyy')}</span>
                      <span className="text-tiny font-mono text-[var(--text-tertiary)]">{format(item.timestamp, 'HH:mm:ss')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <m.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLoad(item)}
                        className="p-3 bg-(--bg-overlay) text-(--text-secondary) hover:text-(--text-primary) transition-all rounded-xl border border-(--border-low)"
                        title="Load Analysis"
                      >
                        <ArrowSquareOut size={18} weight="bold" />
                      </m.button>
                      <m.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromHistory(item.id)}
                        className="p-3 bg-(--bg-overlay) text-(--text-secondary) hover:text-anomaly-high transition-all rounded-xl border border-(--border-low)"
                        title="Remove"
                      >
                        <Trash size={18} weight="bold" />
                      </m.button>
                    </div>
                  </td>
                </m.tr>
              ))}
            </tbody>
          </table>
          
          {filteredHistory.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                <WarningCircle size={32} weight="duotone" className="text-zinc-700" />
              </div>
              <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-tiny">No records match the current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </LazyMotion>
  );
};
