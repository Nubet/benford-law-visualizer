import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useApp } from '../store/useApp';
import { useNavigate } from 'react-router-dom';
import {
  Warning,
  CheckCircle,
  Info,
  ArrowUpRight,
  Database,
  Funnel,
  CaretRight,
  CaretLeft,
  X,
  Target,
  Rows
} from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { getSensitivityDeviation } from '../utils/sensitivity';

const DistributionChart = lazy(() => import('../components/charts/DistributionChart'));

export const DashboardPage: React.FC = () => {
  const { analysisResult, currentDataset, sensitivityLevel } = useApp();
  const navigate = useNavigate();
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const sensitivityDeviation = getSensitivityDeviation(sensitivityLevel);
  const sensitivityThresholdPercent = sensitivityDeviation * 100;

  const chartData = useMemo(() => {
    if (!analysisResult) return [];
    return analysisResult.results.map(r => ({
      digit: r.digit,
      observed: Number((r.observedFreq * 100).toFixed(2)),
      theoretical: Number((r.theoreticalFreq * 100).toFixed(2)),
      diff: Number((Math.abs(r.difference) * 100).toFixed(2))
    }));
  }, [analysisResult]);

  const drilldownData = useMemo(() => {
    if (!selectedDigit || !currentDataset || !analysisResult) return [];
    return currentDataset.data.filter(row => {
      const val = Math.abs(parseFloat(String(row[analysisResult.columnName])));
      if (isNaN(val) || val === 0) return false;
      const firstDigit = parseInt(String(val).replace(/^0\.?/, '')[0]);
      return firstDigit === selectedDigit;
    });
  }, [selectedDigit, currentDataset, analysisResult]);

  if (!analysisResult) {
    return <DashboardEmptyState onUpload={() => navigate('/upload')} />;
  }

  const totalPages = Math.ceil(drilldownData.length / rowsPerPage);
  const pagedData = drilldownData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleBarClick = (data: unknown) => {
    if (!data || typeof data !== 'object') return;
    if (!('activePayload' in data)) return;
    const payload = (data as { activePayload?: Array<{ payload: { digit: number } }> }).activePayload;
    if (!payload || payload.length === 0) return;
    const digit = payload[0].payload.digit;
    setSelectedDigit(digit === selectedDigit ? null : digit);
    setPage(0);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-10">
        <DashboardHeader />
        <StatsGrid analysisResult={analysisResult} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Suspense fallback={<div className="lg:col-span-8 glass-panel p-10" /> }>
            <DistributionChart
              chartData={chartData}
              selectedDigit={selectedDigit}
              onBarClick={handleBarClick}
              results={analysisResult.results}
              sensitivityThresholdPercent={sensitivityThresholdPercent}
              sensitivityDeviation={sensitivityDeviation}
            />
          </Suspense>
          <BreakdownPanel
            results={analysisResult.results}
            selectedDigit={selectedDigit}
            sensitivityDeviation={sensitivityDeviation}
            onSelectDigit={(digit) => setSelectedDigit(digit === selectedDigit ? null : digit)}
          />
        </div>
        <DrilldownSection
          selectedDigit={selectedDigit}
          drilldownData={drilldownData}
          totalPages={totalPages}
          page={page}
          onClose={() => setSelectedDigit(null)}
          onPageChange={setPage}
          columns={currentDataset?.columns ?? []}
          rows={pagedData}
          highlightColumn={analysisResult.columnName}
        />
      </div>
    </LazyMotion>
  );
};

const DashboardEmptyState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <div className="flex flex-col items-start justify-center min-h-[70vh] px-10">
    <m.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="max-w-2xl"
    >
      <div className="w-20 h-20 bg-[var(--brand-primary)]/10 rounded-3xl flex items-center justify-center mb-10 border border-[var(--brand-primary)]/20">
        <Database size={40} weight="duotone" className="text-[var(--brand-primary)]" />
      </div>
      <h2 className="text-large font-bold text-[var(--text-primary)] mb-6 tracking-tighter leading-none">
        No active <br />
        <span className="text-[var(--brand-primary)]">analysis data.</span>
      </h2>
      <p className="text-secondary text-(--text-secondary) max-w-md mb-10 leading-relaxed">
        Upload a dataset to start inspecting for anomalies using Benford's Law Algorithm.
      </p>
      <m.button
        whileHover={{ scale: 1.05, x: 10 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUpload}
        className="group flex items-center gap-4 px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-base)] rounded-2xl font-semibold transition-all shadow-premium"
      >
        <span>Analyze File</span>
        <ArrowUpRight size={24} weight="bold" className="group-hover:rotate-45 transition-transform" />
      </m.button>
    </m.div>
  </div>
);

const DashboardHeader = () => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-8 mt-4">
    <div>
      <h2 className="text-title font-bold text-[var(--text-primary)]">Smart spending alerts</h2>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-[var(--bg-card)] rounded-full text-caption border border-[var(--border-low)] focus:outline-none" />
        <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <select className="px-4 py-2 bg-[var(--bg-card)] rounded-full text-caption border border-[var(--border-low)] focus:outline-none">
        <option>Sort by: Urgency</option>
      </select>
    </div>
  </header>
);

const StatsGrid: React.FC<{ analysisResult: any }> = ({ analysisResult }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="Deviation Score"
      value={`${analysisResult.deviationScore.toFixed(1)}%`}
      subtitle={analysisResult.risk === 'low' ? 'Nominal' : analysisResult.risk === 'medium' ? 'Review' : 'Critical'}
      icon={analysisResult.risk === 'low' ? CheckCircle : Warning}
      color={analysisResult.risk === 'low' ? 'emerald' : analysisResult.risk === 'medium' ? 'amber' : 'red'}
      delay={0.1}
    />
    <StatCard
      title="Chi-Square Metric"
      value={analysisResult.chiSquare.toFixed(2)}
      subtitle="Stat. sig."
      icon={Target}
      color="blue"
      delay={0.2}
    />
    <StatCard
      title="Analyzed Records"
      value={analysisResult.totalCount.toLocaleString()}
      subtitle="Total rows"
      icon={Database}
      color="zinc"
      delay={0.3}
    />
    <StatCard
      title="System Confidence"
      value={analysisResult.risk === 'low' ? '98%' : '75%'}
      subtitle="Risk trend"
      icon={Info}
      color="emerald"
      delay={0.4}
    />
  </div>
);

const BreakdownPanel: React.FC<{
  results: any[];
  selectedDigit: number | null;
  sensitivityDeviation: number;
  onSelectDigit: (digit: number) => void;
}> = ({ results, selectedDigit, sensitivityDeviation, onSelectDigit }) => (
  <div className="lg:col-span-4 flex flex-col gap-6">
    <div className="glass-panel p-8 flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-header font-bold text-[var(--text-primary)] tracking-tight">Digit Breakdown</h3>
        <Rows size={20} weight="duotone" className="text-[var(--text-tertiary)]" />
      </div>

      <div className="space-y-3 flex-1">
        {results.map((res) => (
          <m.button
            key={res.digit}
            whileHover={{ x: 4 }}
            onClick={() => onSelectDigit(res.digit)}
            className={clsx(
              "w-full group text-left transition-all p-3 rounded-2xl border flex items-center gap-4",
              selectedDigit === res.digit
                ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30"
                : "bg-[var(--bg-base)]/30 border-transparent hover:border-[var(--border-low)]"
            )}
          >
            <span className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-caption transition-all shadow-sm",
              selectedDigit === res.digit ? "bg-[var(--brand-primary)] text-[var(--brand-text)]" : "bg-[var(--bg-surface)] text-(--text-secondary) group-hover:text-[var(--text-primary)]"
            )}>
              {res.digit}
            </span>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-tiny font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">
                  {res.observedCount.toLocaleString()} Samples
                </span>
                <span className="text-caption font-bold text-[var(--text-primary)]">{(res.observedFreq * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1 bg-[var(--bg-base)]/50 rounded-full overflow-hidden">
                <m.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(res.observedFreq / 0.4) * 100}%` }}
                  className={clsx(
                    "h-full rounded-full",
                    Math.abs(res.difference) > sensitivityDeviation ? "bg-[var(--color-anomaly-high)]" : "bg-[var(--color-anomaly-low)]"
                  )}
                />
              </div>
            </div>

            <div className={clsx(
              "text-tiny font-bold w-12 text-right",
              res.difference > 0 ? "text-[var(--color-anomaly-high)]" : "text-[var(--color-anomaly-low)]"
            )}>
              {res.difference > 0 ? '+' : ''}{(res.difference * 100).toFixed(1)}%
            </div>
          </m.button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-tiny font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
        <Info size={14} weight="bold" />
        <span>Select digit for granular view</span>
      </div>
    </div>
  </div>
);

const DrilldownSection: React.FC<{
  selectedDigit: number | null;
  drilldownData: Array<Record<string, any>>;
  totalPages: number;
  page: number;
  onClose: () => void;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
  columns: string[];
  rows: Array<Record<string, any>>;
  highlightColumn: string;
}> = ({ selectedDigit, drilldownData, totalPages, page, onClose, onPageChange, columns, rows, highlightColumn }) => (
  <AnimatePresence>
    {selectedDigit && (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="glass-panel overflow-hidden relative"
      >
        <div className="p-10 border-b border-[var(--border-low)] bg-[var(--bg-base)]/50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[var(--brand-primary)] rounded-2xl flex items-center justify-center text-[var(--brand-text)] shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]">
              <Funnel size={28} weight="bold" />
            </div>
            <div>
              <h3 className="text-header font-bold text-[var(--text-primary)] tracking-tight">Granular Drilldown: Digit {selectedDigit}</h3>
              <p className="text-caption text-[var(--text-tertiary)] font-medium">Isolating {drilldownData.length} records matching the leading digit {selectedDigit}.</p>
            </div>
          </div>
          <m.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 bg-[var(--bg-overlay)] hover:bg-[var(--bg-surface)] rounded-2xl text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-low)]"
          >
            <X size={24} weight="bold" />
          </m.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-secondary">
            <thead>
              <tr className="bg-[var(--bg-base)]/40">
                {columns.slice(0, 8).map(col => (
                  <th key={col} className="px-8 py-5 font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] text-tiny">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-low)]">
              {rows.map((row) => {
                const rowKey = columns.slice(0, 8).map(col => String(row[col])).join('|');
                return (
                <tr key={rowKey} className="hover:bg-[var(--bg-surface)]/20 transition-colors group">
                  {columns.slice(0, 8).map(col => (
                    <td key={col} className={clsx(
                      "px-8 py-5 text-(--text-secondary) font-mono text-caption transition-colors",
                      col === highlightColumn && "text-[var(--text-primary)] font-bold bg-[var(--brand-primary)]/[0.02]"
                    )}>
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-10 py-6 border-t border-[var(--border-low)] flex items-center justify-between bg-[var(--bg-base)]/10">
            <span className="text-tiny text-[var(--text-tertiary)] font-bold uppercase tracking-[0.2em]">
              Fragment {page + 1} <span className="text-[var(--text-tertiary)]/50">/</span> {totalPages}
            </span>
            <div className="flex gap-3">
              <m.button
                whileHover={page !== 0 ? { scale: 1.05 } : {}}
                whileTap={page !== 0 ? { scale: 0.95 } : {}}
                disabled={page === 0}
                onClick={() => onPageChange(p => p - 1)}
                className="p-3 bg-[var(--bg-overlay)] hover:bg-[var(--bg-surface)] disabled:opacity-20 rounded-xl text-[var(--text-primary)] transition-all border border-[var(--border-low)] shadow-sm"
              >
                <CaretLeft size={20} weight="bold" />
              </m.button>
              <m.button
                whileHover={page !== totalPages - 1 ? { scale: 1.05 } : {}}
                whileTap={page !== totalPages - 1 ? { scale: 0.95 } : {}}
                disabled={page === totalPages - 1}
                onClick={() => onPageChange(p => p + 1)}
                className="p-3 bg-[var(--bg-overlay)] hover:bg-[var(--bg-surface)] disabled:opacity-20 rounded-xl text-[var(--text-primary)] transition-all border border-[var(--border-low)] shadow-sm"
              >
                <CaretRight size={20} weight="bold" />
              </m.button>
            </div>
          </div>
        )}
                </m.div>
    )}
  </AnimatePresence>
);

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: 'emerald' | 'amber' | 'red' | 'blue' | 'zinc' | 'indigo';
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => {
  const colorStyles = {
    emerald: 'text-[var(--color-anomaly-low)] bg-[var(--color-anomaly-low)]/10 border-[var(--color-anomaly-low)]/20',
    amber: 'text-[var(--color-anomaly-medium)] bg-[var(--color-anomaly-medium)]/10 border-[var(--color-anomaly-medium)]/20',
    red: 'text-[var(--color-anomaly-high)] bg-[var(--color-anomaly-high)]/10 border-[var(--color-anomaly-high)]/20',
    blue: 'text-[var(--color-anomaly-info)] bg-[var(--color-anomaly-info)]/10 border-[var(--color-anomaly-info)]/20',
    zinc: 'text-(--text-secondary) bg-[var(--bg-surface)] border-[var(--border-low)]',
    indigo: 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/20',
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay
      }}
      whileHover={{ y: -5 }}
      className="glass-panel p-6 relative group border-transparent hover:border-[var(--brand-primary)]/20 transition-all duration-500"
    >
      <div className="text-caption font-semibold text-(--text-secondary) mb-2">{title}</div>
      <div className="flex items-end justify-between mb-6">
        <div className="text-large font-bold text-[var(--text-primary)] tracking-tighter font-mono leading-none">{value}</div>
        <div className={clsx('flex items-center gap-1 text-tiny font-bold px-2 py-1 rounded-full', colorStyles[color])}>
          <Icon size={12} weight="bold" />
          <span>{subtitle}</span>
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-[var(--border-low)]">
        <span className="text-tiny font-bold text-[var(--text-primary)] flex items-center gap-2 group-hover:text-[var(--brand-primary)] transition-colors cursor-pointer">
          View details <ArrowUpRight size={14} weight="bold" />
        </span>
      </div>
      </m.div>
  );
};
