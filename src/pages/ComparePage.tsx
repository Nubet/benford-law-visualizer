import React, { useState, useId, lazy, Suspense } from 'react';
import { useApp } from '../store/useApp';
import {
  ArrowsLeftRight,
  CheckCircle,
  WarningCircle,
  Rows,
  TrendUp
} from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import type { AnalysisSummary } from '../types';
import type { ComparisonChartDatum } from '../components/charts/ComparisonChart';

const ComparisonChart = lazy(() => import('../components/charts/ComparisonChart'));

export const ComparePage: React.FC = () => {
  const { history } = useApp();
  const [leftId, setLeftId] = useState<string>('');
  const [rightId, setRightId] = useState<string>('');

  const leftResult = history.find(h => h.id === leftId);
  const rightResult = history.find(h => h.id === rightId);

  const chartData: ComparisonChartDatum[] = leftResult && rightResult ? leftResult.results.map((res, i) => ({
    digit: res.digit,
    [leftResult.name]: Number((res.observedFreq * 100).toFixed(2)),
    [rightResult.name]: Number((rightResult.results[i].observedFreq * 100).toFixed(2)),
    benford: Number((res.theoreticalFreq * 100).toFixed(2))
  })) : [];

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-7xl mx-auto py-10">
        <CompareHeader />
        <ComparisonSelectors
          history={history}
          leftId={leftId}
          rightId={rightId}
          onSelectLeft={setLeftId}
          onSelectRight={setRightId}
        />

        {leftResult && rightResult ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <ComparisonStats leftResult={leftResult} rightResult={rightResult} />
            <Suspense fallback={<div className="glass-panel p-10" />}>
              <ComparisonChart leftResult={leftResult} rightResult={rightResult} chartData={chartData} />
            </Suspense>
            <DeltaTable leftResult={leftResult} rightResult={rightResult} />
          </div>
        ) : (
          <ComparisonEmptyState hasEnoughHistory={history.length >= 2} />
        )}
      </div>
    </LazyMotion>
  );
};

const CompareHeader = () => (
  <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
    <m.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <span className="text-(--brand-primary) font-bold uppercase tracking-[0.3em] text-tiny mb-4 block">Compare Two Datasets</span>
      <h1 className="text-large font-bold text-(--text-primary) tracking-tighter leading-none">Compare Datasets</h1>
      <p className="text-secondary text-(--text-secondary) mt-4 font-medium">See how two different files stack up against each other.</p>
    </m.div>
  </header>
);

const ComparisonSelectors: React.FC<{
  history: AnalysisSummary[];
  leftId: string;
  rightId: string;
  onSelectLeft: (value: string) => void;
  onSelectRight: (value: string) => void;
}> = ({ history, leftId, rightId, onSelectLeft, onSelectRight }) => {
  const leftSelectId = useId();
  const rightSelectId = useId();
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    <div className="glass-panel p-8 relative overflow-hidden group transition-all duration-500 hover:border-(--brand-primary)/30">
      <label htmlFor={leftSelectId} className="block text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.3em] mb-4">Original File (A)</label>
      <div className="relative">
        <select
          id={leftSelectId}
          value={leftId}
          onChange={(e) => onSelectLeft(e.target.value)}
          className="w-full bg-(--bg-base)/50 border border-(--border-low) rounded-2xl px-6 py-4 text-(--text-primary) font-medium text-secondary focus:outline-none focus:border-(--brand-primary) appearance-none cursor-pointer transition-all"
        >
          <option value="" className="bg-(--bg-base)">Select baseline...</option>
          {history.map(h => (
            <option key={h.id} value={h.id} className="bg-(--bg-base)">{h.name} ({h.columnName})</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-tertiary)">
          <Rows size={20} weight="bold" />
        </div>
      </div>
    </div>

    <div className="glass-panel p-8 relative overflow-hidden group transition-all duration-500 hover:border-(--brand-primary)/30">
      <label htmlFor={rightSelectId} className="block text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.3em] mb-4">Comparison File (B)</label>
      <div className="relative">
        <select
          id={rightSelectId}
          value={rightId}
          onChange={(e) => onSelectRight(e.target.value)}
          className="w-full bg-(--bg-base)/50 border border-(--border-low) rounded-2xl px-6 py-4 text-(--text-primary) font-medium text-secondary focus:outline-none focus:border-(--brand-primary) appearance-none cursor-pointer transition-all"
        >
          <option value="" className="bg-(--bg-base)">Select comparison...</option>
          {history.map(h => (
            <option key={h.id} value={h.id} className="bg-(--bg-base)">{h.name} ({h.columnName})</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-(--text-tertiary)">
          <Rows size={20} weight="bold" />
        </div>
      </div>
    </div>
  </div>
  );
};

const ComparisonStats: React.FC<{ leftResult: AnalysisSummary; rightResult: AnalysisSummary }> = ({ leftResult, rightResult }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <ComparisonCard
      title="Metric Delta"
      value={`${Math.abs(leftResult.deviationScore - rightResult.deviationScore).toFixed(1)}%`}
      label={leftResult.deviationScore > rightResult.deviationScore ? 'A shows higher anomaly' : 'B shows higher anomaly'}
      icon={TrendUp}
    />
    <div className="glass-panel p-8 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-(--bg-base)/3 rounded-full blur-3xl pointer-events-none" />
      <div className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.3em] mb-6">Risk Profile Overlay</div>
      <div className="flex items-center gap-6">
        <RiskBadge risk={leftResult.risk} label="A" />
        <div className="h-px flex-1 bg-(--border-low)" />
        <RiskBadge risk={rightResult.risk} label="B" />
      </div>
    </div>
    <ComparisonCard
      title="Global Affinity"
      value={leftResult.risk === rightResult.risk ? 'Synchronized' : 'Divergent'}
      label="Cross-dataset consistency"
      icon={leftResult.risk === rightResult.risk ? CheckCircle : WarningCircle}
      color={leftResult.risk === rightResult.risk ? 'emerald' : 'amber'}
    />
  </div>
);

const DeltaTable: React.FC<{ leftResult: AnalysisSummary; rightResult: AnalysisSummary }> = ({ leftResult, rightResult }) => (
  <div className="glass-panel overflow-hidden">
    <div className="p-8 border-b border-(--border-low) bg-(--bg-base)/10 flex items-center justify-between">
      <h3 className="text-header font-bold text-(--text-primary) tracking-tight">Granular Delta Matrix</h3>
      <div className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">A vs B Variance</div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-caption">
        <thead>
          <tr className="bg-(--bg-base)/40">
            <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em]">Digit</th>
            <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em]">{leftResult.name} (%)</th>
            <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em]">{rightResult.name} (%)</th>
            <th className="px-8 py-5 text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.2em] text-right">Differential Variance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-low)">
          {leftResult.results.map((res: any, i: number) => {
            const leftVal = res.observedFreq * 100;
            const rightVal = rightResult.results[i].observedFreq * 100;
            const delta = Math.abs(leftVal - rightVal);
            return (
              <tr key={res.digit} className="hover:bg-(--bg-surface)/20 transition-colors group">
                <td className="px-8 py-6 font-bold text-(--text-primary) text-header">{res.digit}</td>
                <td className="px-8 py-6 text-(--text-secondary) font-mono text-caption">{leftVal.toFixed(2)}%</td>
                <td className="px-8 py-6 text-(--text-secondary) font-mono text-caption">{rightVal.toFixed(2)}%</td>
                <td className="px-8 py-6 text-right">
                  <span className={clsx(
                    'px-4 py-2 rounded-xl text-tiny font-bold uppercase tracking-widest border shadow-inner transition-all',
                    delta > 5 ? 'bg-anomaly-high/5 text-anomaly-high border-anomaly-high/10 shadow-(--color-anomaly-high)/[0.02]' : delta > 2 ? 'bg-anomaly-medium/5 text-anomaly-medium border-anomaly-medium/10 shadow-(--color-anomaly-medium)/[0.02]' : 'bg-anomaly-low/5 text-anomaly-low border-anomaly-low/10 shadow-(--color-anomaly-low)/[0.02]'
                  )}>
                    Δ {delta.toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const ComparisonEmptyState: React.FC<{ hasEnoughHistory: boolean }> = ({ hasEnoughHistory }) => (
  <m.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-[50vh] text-center glass-panel p-20 border-dashed border-2 border-[var(--border-low)]"
  >
    <div className="w-20 h-20 bg-(--bg-overlay) rounded-4xl flex items-center justify-center mb-10 border border-(--border-low) shadow-premium">
      <ArrowsLeftRight size={40} weight="duotone" className="text-(--text-tertiary)" />
    </div>
    <h3 className="text-title font-bold text-(--text-secondary) mb-4 tracking-tight leading-none">Awaiting Selection.</h3>
    <p className="text-secondary text-(--text-tertiary) max-w-sm font-medium leading-relaxed">Select two historical datasets from the registry above to initialize a differential distribution test.</p>
    {!hasEnoughHistory && (
      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-6 bg-anomaly-medium/5 border border-anomaly-medium/10 rounded-4xl text-anomaly-medium/80 text-tiny font-bold uppercase tracking-widest max-w-sm"
      >
        System requires a minimum of two records in archive to enable comparison mode.
      </m.div>
    )}
  </m.div>
);

const ComparisonCard = ({ title, value, label, icon: Icon, color = 'emerald' }: any) => (
  <div className="glass-panel p-8 flex items-center gap-8 relative overflow-hidden group">
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-(--bg-overlay)/2 rounded-full blur-2xl group-hover:bg-[var(--brand-primary)]/5 transition-colors" />
    <div className={clsx(
      'p-5 rounded-2xl border transition-all duration-500 group-hover:scale-110 shadow-lg',
      color === 'emerald' ? 'bg-anomaly-low/10 border-[var(--color-anomaly-low)]/20 text-[var(--color-anomaly-low)]' : 'bg-[var(--color-anomaly-medium)]/10 border-[var(--color-anomaly-medium)]/20 text-[var(--color-anomaly-medium)]'
    )}>
      <Icon size={32} weight="duotone" />
    </div>
    <div>
      <div className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.3em] mb-2">{title}</div>
      <div className="text-title font-bold text-(--text-primary) mb-1 tracking-tighter">{value}</div>
      <div className="text-caption font-bold text-(--text-secondary) uppercase tracking-tight opacity-70">{label}</div>
    </div>
  </div>
);

const RiskBadge = ({ risk, label }: any) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-[0.4em]">{label}</span>
    <div className={clsx(
      'px-4 py-2 rounded-xl text-tiny font-bold uppercase tracking-widest border shadow-inner',
      risk === 'low' ? 'bg-anomaly-low/10 text-anomaly-low border-anomaly-low/20' : risk === 'medium' ? 'bg-anomaly-medium/10 text-anomaly-medium border-anomaly-medium/20' : 'bg-anomaly-high/10 text-[var(--color-anomaly-high)] border-[var(--color-anomaly-high)]/20'
    )}>
      {risk}
    </div>
  </div>
);
