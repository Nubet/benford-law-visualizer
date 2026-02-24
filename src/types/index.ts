export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface BenfordResult {
  digit: Digit;
  observedCount: number;
  observedFreq: number;
  theoreticalFreq: number;
  difference: number;
}

export type AnomalyRisk = 'low' | 'medium' | 'high';
export type SensitivityLevel = 'strict' | 'standard' | 'loose';
export type NegativeValueHandling = 'absolute' | 'exclude';

export interface AnalysisSummary {
  id: string;
  name: string;
  timestamp: number;
  totalCount: number;
  chiSquare: number;
  deviationScore: number;
  risk: AnomalyRisk;
  results: BenfordResult[];
  columnName: string;
}

export interface Dataset {
  name: string;
  data: Record<string, any>[];
  columns: string[];
  numericColumns: string[];
}

export interface AppState {
  currentDataset: Dataset | null;
  analysisResult: AnalysisSummary | null;
  history: AnalysisSummary[];
  sensitivityLevel: SensitivityLevel;
  negativeValueHandling: NegativeValueHandling;
}
