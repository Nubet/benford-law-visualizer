import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend
} from 'recharts';
import type { AnalysisSummary } from '../../types';

export type ComparisonChartDatum = { digit: number; benford: number } & Record<string, number>;

interface ComparisonChartProps {
  leftResult: AnalysisSummary;
  rightResult: AnalysisSummary;
  chartData: ComparisonChartDatum[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ leftResult, rightResult, chartData }) => (
  <div className="glass-panel p-10 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-100 h-100 bg-(--brand-primary)/2 rounded-full blur-[100px] pointer-events-none" />
    <h3 className="text-header font-bold text-(--text-primary) mb-10 tracking-tight">Pattern Overlay Analysis</h3>
    <div className="h-125">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-low)" vertical={false} />
          <XAxis dataKey="digit" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} fontFamily="var(--font-mono)" />
          <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} fontFamily="var(--font-mono)" />
          <Tooltip
            cursor={{ fill: 'var(--bg-overlay)', fillOpacity: 0.1 }}
            contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-low)', borderRadius: '20px', padding: '16px' }}
            itemStyle={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}
          />
          <Legend verticalAlign="top" height={60} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }} />
          <Bar dataKey={leftResult.name} fill="var(--brand-primary)" fillOpacity={0.4} radius={[6, 6, 0, 0]} barSize={40} />
          <Bar dataKey={rightResult.name} fill="var(--text-tertiary)" fillOpacity={0.6} radius={[6, 6, 0, 0]} barSize={40} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ComparisonChart;
