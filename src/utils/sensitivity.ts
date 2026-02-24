import type { SensitivityLevel } from '../types';

export const DEFAULT_SENSITIVITY_LEVEL: SensitivityLevel = 'standard';

export const SENSITIVITY_LEVELS: Record<SensitivityLevel, { label: string; deviation: number; description: string }> = {
  strict: {
    label: 'Strict',
    deviation: 0.05,
    description: 'Flags even minor inconsistencies.'
  },
  standard: {
    label: 'Standard',
    deviation: 0.1,
    description: 'Recommended for most datasets.'
  },
  loose: {
    label: 'Loose',
    deviation: 0.15,
    description: 'Only flags major outliers.'
  }
};

export const getSensitivityDeviation = (level: SensitivityLevel) => SENSITIVITY_LEVELS[level].deviation;
