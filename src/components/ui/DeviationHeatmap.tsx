import React from 'react';
import type { BenfordResult } from '../../types';
import { clsx } from 'clsx';

interface DeviationHeatmapProps {
  results: BenfordResult[];
  sensitivityDeviation: number;
}

export const DeviationHeatmap: React.FC<DeviationHeatmapProps> = ({ results, sensitivityDeviation }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">Deviation Heatmap</span>
        <span className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">Digit 1-9</span>
      </div>
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-(--bg-base) border border-(--border-low)">
        {results.map((res) => {
          const absDiff = Math.abs(res.difference);
          const highThreshold = sensitivityDeviation;
          const mediumThreshold = sensitivityDeviation * 0.7;
          const infoThreshold = sensitivityDeviation * 0.4;
          let color = 'bg-[var(--color-anomaly-low)]';
          if (absDiff > highThreshold) color = 'bg-[var(--color-anomaly-high)]';
          else if (absDiff > mediumThreshold) color = 'bg-[var(--color-anomaly-medium)]';
          else if (absDiff > infoThreshold) color = 'bg-[var(--color-anomaly-info)]';

          return (
            <div 
              key={res.digit}
              className={clsx("flex-1 h-full transition-all hover:opacity-80 cursor-help border-r border-(--bg-base)/50 last:border-r-0", color)}
              title={`Digit ${res.digit}: ${(res.difference * 100).toFixed(1)}% deviation`}
            />
          );
        })}
      </div>
    </div>
  );
};
