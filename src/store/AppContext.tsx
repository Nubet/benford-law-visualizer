import React, { useReducer, useEffect } from 'react';
import type { AppState, Dataset, AnalysisSummary, SensitivityLevel, NegativeValueHandling } from '../types';
import { DEFAULT_NEGATIVE_HANDLING, NEGATIVE_HANDLING_OPTIONS } from '../utils/dataHandling';
import { DEFAULT_SENSITIVITY_LEVEL, SENSITIVITY_LEVELS } from '../utils/sensitivity';
import { AppContext } from './appContextStore';

type AppAction =
  | { type: 'setDataset'; dataset: Dataset | null }
  | { type: 'setAnalysisResult'; result: AnalysisSummary | null }
  | { type: 'addToHistory'; result: AnalysisSummary }
  | { type: 'removeFromHistory'; id: string }
  | { type: 'clearHistory' }
  | { type: 'setSensitivityLevel'; level: SensitivityLevel }
  | { type: 'setNegativeValueHandling'; mode: NegativeValueHandling };

const initState = (): AppState => {
  const savedHistory = localStorage.getItem('benford_history');
  const savedSensitivity = localStorage.getItem('benford_sensitivity');
  const savedNegativeHandling = localStorage.getItem('benford_negative_handling');

  return {
    currentDataset: null,
    analysisResult: null,
    history: savedHistory ? JSON.parse(savedHistory) : [],
    sensitivityLevel: savedSensitivity && savedSensitivity in SENSITIVITY_LEVELS
      ? (savedSensitivity as SensitivityLevel)
      : DEFAULT_SENSITIVITY_LEVEL,
    negativeValueHandling: savedNegativeHandling && savedNegativeHandling in NEGATIVE_HANDLING_OPTIONS
      ? (savedNegativeHandling as NegativeValueHandling)
      : DEFAULT_NEGATIVE_HANDLING
  };
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'setDataset':
      return { ...state, currentDataset: action.dataset };
    case 'setAnalysisResult':
      return { ...state, analysisResult: action.result };
    case 'addToHistory':
      return { ...state, history: [action.result, ...state.history].slice(0, 50) };
    case 'removeFromHistory':
      return { ...state, history: state.history.filter(item => item.id !== action.id) };
    case 'clearHistory':
      return { ...state, history: [] };
    case 'setSensitivityLevel':
      return { ...state, sensitivityLevel: action.level };
    case 'setNegativeValueHandling':
      return { ...state, negativeValueHandling: action.mode };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    localStorage.setItem('benford_history', JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    localStorage.setItem('benford_sensitivity', state.sensitivityLevel);
  }, [state.sensitivityLevel]);

  useEffect(() => {
    localStorage.setItem('benford_negative_handling', state.negativeValueHandling);
  }, [state.negativeValueHandling]);

  const setDataset = (dataset: Dataset | null) => dispatch({ type: 'setDataset', dataset });
  const setAnalysisResult = (result: AnalysisSummary | null) => dispatch({ type: 'setAnalysisResult', result });
  const addToHistory = (result: AnalysisSummary) => dispatch({ type: 'addToHistory', result });
  const removeFromHistory = (id: string) => dispatch({ type: 'removeFromHistory', id });
  const clearHistory = () => dispatch({ type: 'clearHistory' });
  const setSensitivityLevel = (level: SensitivityLevel) => dispatch({ type: 'setSensitivityLevel', level });
  const setNegativeValueHandling = (mode: NegativeValueHandling) => dispatch({ type: 'setNegativeValueHandling', mode });

  return (
    <AppContext.Provider value={{
      currentDataset: state.currentDataset,
      analysisResult: state.analysisResult,
      history: state.history,
      sensitivityLevel: state.sensitivityLevel,
      negativeValueHandling: state.negativeValueHandling,
      setDataset,
      setAnalysisResult,
      addToHistory,
      removeFromHistory,
      clearHistory,
      setSensitivityLevel,
      setNegativeValueHandling
    }}>
      {children}
    </AppContext.Provider>
  );
};
