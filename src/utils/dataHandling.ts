import type { NegativeValueHandling } from '../types';

export const DEFAULT_NEGATIVE_HANDLING: NegativeValueHandling = 'absolute';

export const NEGATIVE_HANDLING_OPTIONS: Record<NegativeValueHandling, { label: string; description: string; recommended?: boolean }> = {
  absolute: {
    label: 'Convert to Absolute',
    description: 'Useful for financial datasets with returns or losses.',
    recommended: true
  },
  exclude: {
    label: 'Exclude from analysis',
    description: 'Removes negative values entirely before analysis.'
  }
};
