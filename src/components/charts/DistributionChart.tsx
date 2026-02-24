import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell
} from 'recharts';
import { AnimatePresence, m } from 'framer-motion';
import type { BenfordResult } from '../../types';
import { DeviationHeatmap } from '../ui/DeviationHeatmap';

interface DistributionChartProps {
  chartData: Array<{ digit: number; observed: number; theoretical: number; diff: number }>;
  selectedDigit: number | null;
  onBarClick: (data: unknown) => void;
  results: BenfordResult[];
  sensitivityThresholdPercent: number;
  sensitivityDeviation: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  chartData,
  selectedDigit,
  onBarClick,
  results,
  sensitivityThresholdPercent,
  sensitivityDeviation
}) => (
  <div className="lg:col-span-8 glass-panel p-10 relative group overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-(--brand-primary)/5 rounded-full blur-[100px] pointer-events-none" />
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
      <div>
        <h3 className="text-header font-bold text-(--text-primary) flex items-center gap-3 tracking-tight">
          Distribution Pattern
          <AnimatePresence>
            {selectedDigit && (
              <m.span
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="text-tiny bg-(--brand-primary) text-(--brand-text) px-2.5 py-1 rounded-lg font-bold uppercase"
              >
                Digit {selectedDigit} Focus
              </m.span>
            )}
          </AnimatePresence>
        </h3>
        <p className="text-caption text-(--text-tertiary) mt-1">Empirical data vs. logarithmic theoretical frequency.</p>
      </div>
      <div className="flex items-center gap-6 px-4 py-2 bg-(--bg-base)/50 rounded-2xl border border-(--border-low)/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-(--brand-primary) rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-tiny font-bold text-(--text-secondary) uppercase tracking-tighter">Observed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-(--text-tertiary) rounded-full" />
          <span className="text-tiny font-bold text-(--text-secondary) uppercase tracking-tighter">Theoretical</span>
        </div>
      </div>
    </div>

    <div className="h-100 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} onClick={onBarClick} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-low)" vertical={false} />
          <XAxis dataKey="digit" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} fontFamily="var(--font-mono)" />
          <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} fontFamily="var(--font-mono)" />
          <Tooltip
            cursor={{ fill: 'var(--bg-overlay)', fillOpacity: 0.1 }}
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-low)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              padding: '16px'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}
            labelStyle={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
          />
          <Bar dataKey="observed" radius={[8, 8, 0, 0]} barSize={50} className="cursor-pointer">
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.digit}`}
                fill={selectedDigit === entry.digit ? 'var(--brand-primary)' : entry.diff > sensitivityThresholdPercent ? 'var(--color-anomaly-high)' : 'var(--border-high)'}
                stroke={selectedDigit === entry.digit ? 'var(--text-primary)' : 'none'}
                strokeWidth={2}
                fillOpacity={selectedDigit && selectedDigit !== entry.digit ? 0.2 : 0.9}
                className="transition-all duration-500"
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="theoretical"
            stroke="var(--text-tertiary)"
            strokeWidth={4}
            dot={{ fill: 'var(--bg-card)', r: 5, strokeWidth: 2, stroke: 'var(--brand-primary)' }}
            activeDot={{ r: 8, stroke: 'var(--text-primary)', strokeWidth: 3, fill: 'var(--brand-primary)' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-12 pt-8 border-t border-zinc-800/50">
      <h4 className="text-tiny font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Deviation Intensity Heatmap</h4>
      <DeviationHeatmap results={results} sensitivityDeviation={sensitivityDeviation} />
    </div>
  </div>
);

export default DistributionChart;
