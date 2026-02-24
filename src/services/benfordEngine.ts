import type { Digit, BenfordResult, AnalysisSummary, AnomalyRisk } from '../types';

export const getFirstSignificantDigit = (val: number | string): Digit | null => {
  const numStr = String(val).replace(/[^0-9.]/g, '');
  const match = numStr.match(/[1-9]/);
  return match ? (parseInt(match[0], 10) as Digit) : null;
};


export const getTheoreticalFreq = (digit: Digit): number => {
  return Math.log10(1 + 1 / digit);
};

export const analyzeBenford = (
  data: Record<string, any>[],
  columnName: string,
  datasetName: string,
  options: { ignoreZeros: boolean; negativeHandling: 'absolute' | 'exclude' } = { ignoreZeros: true, negativeHandling: 'absolute' }
): AnalysisSummary => {
  const counts: Record<Digit, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  let validCount = 0;

  data.forEach(row => {
    const val = row[columnName];
    if (val === undefined || val === null) return;
    
    let num = typeof val === 'number' ? val : parseFloat(String(val));
    if (isNaN(num)) return;
    if (num < 0) {
      if (options.negativeHandling === 'exclude') return;
      num = Math.abs(num);
    }
    if (options.ignoreZeros && num === 0) return;

    const firstDigit = getFirstSignificantDigit(num);
    if (firstDigit) {
      counts[firstDigit]++;
      validCount++;
    }
  });

  const results: BenfordResult[] = (Object.keys(counts) as unknown as string[]).map(digitStr => {
    const digit = Number(digitStr) as Digit;
    const observedCount = counts[digit];
    const observedFreq = validCount > 0 ? observedCount / validCount : 0;
    const theoreticalFreq = getTheoreticalFreq(digit);
    
    return {
      digit,
      observedCount,
      observedFreq,
      theoreticalFreq,
      difference: observedFreq - theoreticalFreq
    };
  });

  let chiSquare = 0;
  results.forEach(res => {
    if (res.theoreticalFreq > 0) {
      const diff = res.observedFreq - res.theoreticalFreq;
      chiSquare += (Math.pow(diff, 2) / res.theoreticalFreq);
    }
  });
  chiSquare = chiSquare * validCount;

  const deviationScore = Math.min(100, (chiSquare / 25) * 100);
  
  let risk: AnomalyRisk = 'low';
  if (chiSquare > 20.1) risk = 'high';
  else if (chiSquare > 15.5) risk = 'medium';

  return {
    id: crypto.randomUUID(),
    name: datasetName,
    timestamp: Date.now(),
    totalCount: validCount,
    chiSquare,
    deviationScore,
    risk,
    results,
    columnName
  };
};
