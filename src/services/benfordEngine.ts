import type { Digit, BenfordResult, AnalysisSummary, AnomalyRisk } from '../types';

const DIGITS: readonly Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const DEVIATION_SCALE_FACTOR = 1000;
const MAX_DEVIATION_SCORE = 100;

const SAMPLE_SIZE_THRESHOLD = {
  large: 10_000,
  medium: 1_000,
} as const;

const NORMALIZED_CHI_SQUARE_THRESHOLDS = {
  large:  { high: 0.003, medium: 0.002 },
  medium: { high: 0.025, medium: 0.020 },
} as const;

const CHI_SQUARE_CRITICAL_VALUES = {
  high: 20.09,
  medium: 15.51,
} as const;

export const getFirstSignificantDigit = (val: number | string): Digit | null => {
  const numStr = String(val).replace(/[^0-9.]/g, '');
  const match = numStr.match(/[1-9]/);
  return match ? (parseInt(match[0], 10) as Digit) : null;
};

export const getTheoreticalFreq = (digit: Digit): number => {
  return Math.log10(1 + 1 / digit);
};

const parseNumericValue = (
  val: unknown,
  negativeHandling: 'absolute' | 'exclude'
): number | null => {
  if (val === undefined || val === null) return null;

  const num = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(num) || num === 0) return null;

  if (num < 0) {
    if (negativeHandling === 'exclude') return null;
    return Math.abs(num);
  }

  return num;
};

const countLeadingDigits = (
  data: Record<string, unknown>[],
  columnName: string,
  negativeHandling: 'absolute' | 'exclude'
): { counts: Record<Digit, number>; validCount: number } => {
  const counts = Object.fromEntries(DIGITS.map(d => [d, 0])) as Record<Digit, number>;
  let validCount = 0;

  for (const row of data) {
    const num = parseNumericValue(row[columnName], negativeHandling);
    if (num === null) continue;

    const digit = getFirstSignificantDigit(num);
    if (digit) {
      counts[digit]++;
      validCount++;
    }
  }

  return { counts, validCount };
};

const buildResults = (counts: Record<Digit, number>, validCount: number): BenfordResult[] => {
  return DIGITS.map(digit => {
    const observedCount = counts[digit];
    const observedFreq = validCount > 0 ? observedCount / validCount : 0;
    const theoreticalFreq = getTheoreticalFreq(digit);

    return {
      digit,
      observedCount,
      observedFreq,
      theoreticalFreq,
      difference: observedFreq - theoreticalFreq,
    };
  });
};

const computeChiSquare = (results: BenfordResult[], sampleSize: number): number => {
  const sumOfSquaredDeviations = results.reduce((sum, r) => {
    if (r.theoreticalFreq === 0) return sum;
    return sum + (r.difference ** 2) / r.theoreticalFreq;
  }, 0);

  return sumOfSquaredDeviations * sampleSize;
};

const computeDeviationScore = (results: BenfordResult[]): number => {
  const avgAbsDeviation = results.reduce((sum, r) => sum + Math.abs(r.difference), 0) / results.length;
  return Math.min(MAX_DEVIATION_SCORE, avgAbsDeviation * DEVIATION_SCALE_FACTOR);
};

const assessRisk = (chiSquare: number, sampleSize: number): AnomalyRisk => {
  const normalizedChiSquare = chiSquare / sampleSize;

  if (sampleSize > SAMPLE_SIZE_THRESHOLD.large) {
    const thresholds = NORMALIZED_CHI_SQUARE_THRESHOLDS.large;
    if (normalizedChiSquare > thresholds.high) return 'high';
    if (normalizedChiSquare > thresholds.medium) return 'medium';
    return 'low';
  }

  if (sampleSize > SAMPLE_SIZE_THRESHOLD.medium) {
    const thresholds = NORMALIZED_CHI_SQUARE_THRESHOLDS.medium;
    if (normalizedChiSquare > thresholds.high) return 'high';
    if (normalizedChiSquare > thresholds.medium) return 'medium';
    return 'low';
  }

  if (chiSquare > CHI_SQUARE_CRITICAL_VALUES.high) return 'high';
  if (chiSquare > CHI_SQUARE_CRITICAL_VALUES.medium) return 'medium';
  return 'low';
};

interface AnalysisOptions {
  ignoreZeros: boolean;
  negativeHandling: 'absolute' | 'exclude';
}

const DEFAULT_OPTIONS: AnalysisOptions = {
  ignoreZeros: true,
  negativeHandling: 'absolute',
};

export const analyzeBenford = (
  data: Record<string, unknown>[],
  columnName: string,
  datasetName: string,
  options: AnalysisOptions = DEFAULT_OPTIONS
): AnalysisSummary => {
  const { counts, validCount } = countLeadingDigits(data, columnName, options.negativeHandling);
  const results = buildResults(counts, validCount);
  const chiSquare = computeChiSquare(results, validCount);
  const deviationScore = computeDeviationScore(results);
  const risk = assessRisk(chiSquare, validCount);

  return {
    id: crypto.randomUUID(),
    name: datasetName,
    timestamp: Date.now(),
    totalCount: validCount,
    chiSquare,
    deviationScore,
    risk,
    results,
    columnName,
  };
};
