import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { BenfordResult } from '../../types';

interface SparklineProps {
  data: BenfordResult[];
  color?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color = '#3b82f6' }) => {
  const chartData = data.map(d => ({
    value: d.observedFreq
  }));

  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
