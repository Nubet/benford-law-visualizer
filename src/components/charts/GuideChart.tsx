import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell
} from 'recharts';

interface GuideChartProps {
  data: Array<{ digit: number; freq: number }>;
}

const GuideChart: React.FC<GuideChartProps> = ({ data }) => (
  <div className="h-75 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--border-low)" vertical={false} />
        <XAxis dataKey="digit" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} fontFamily="var(--font-mono)" />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: 'var(--bg-overlay)', fillOpacity: 0.1 }}
          contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-low)', borderRadius: '12px', padding: '12px' }}
          itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}
          formatter={(value) => [`${value ?? ''}%`, 'Frequency']}
          labelFormatter={(label) => `Leading Digit: ${label ?? ''}`}
        />
        <Bar dataKey="freq" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} barSize={35}>
          {data.map((entry) => (
            <Cell key={`cell-${entry.digit}`} fillOpacity={1 - (entry.digit - 1) * 0.08} />
          ))}
        </Bar>
        <Line type="monotone" dataKey="freq" stroke="var(--text-tertiary)" strokeWidth={3} dot={false} tooltipType="none" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export default GuideChart;
