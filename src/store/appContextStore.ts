import { createContext } from 'react';
import type { AppState, Dataset, AnalysisSummary, SensitivityLevel, NegativeValueHandling } from '../types';

export interface AppContextType extends AppState {
  setDataset: (dataset: Dataset | null) => void;
  setAnalysisResult: (result: AnalysisSummary | null) => void;
  addToHistory: (result: AnalysisSummary) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  setSensitivityLevel: (level: SensitivityLevel) => void;
  setNegativeValueHandling: (mode: NegativeValueHandling) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
