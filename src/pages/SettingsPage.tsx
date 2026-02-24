import React from 'react';
import { useApp } from '../store/useApp';
import { 
  Trash, 
  Database, 
  SlidersHorizontal,
  Info,
  GithubLogo,
  Funnel
} from '@phosphor-icons/react';
import { DEFAULT_SENSITIVITY_LEVEL, SENSITIVITY_LEVELS } from '../utils/sensitivity';
import type { SensitivityLevel, NegativeValueHandling } from '../types';
import { DEFAULT_NEGATIVE_HANDLING, NEGATIVE_HANDLING_OPTIONS } from '../utils/dataHandling';

export const SettingsPage: React.FC = () => {
  const { history, clearHistory, sensitivityLevel, setSensitivityLevel, negativeValueHandling, setNegativeValueHandling } = useApp();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-title font-bold text-(--text-primary) mb-2">Settings</h1>
        <p className="text-secondary text-(--text-secondary)">Manage application preferences and data storage.</p>
      </div>

      <div className="space-y-8">
        {/* Data Section */}
        <section className="glass-panel overflow-hidden border-(--border-low)">
          <div className="p-6 border-b border-(--border-low) bg-(--bg-surface)/30 flex items-center gap-3">
            <Database size={24} weight="duotone" className="text-(--brand-primary)" />
            <h2 className="text-header font-bold text-(--text-primary)">Data Management</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body font-bold text-(--text-primary) mb-1">Clear Analysis History</h3>
                <p className="text-caption text-(--text-tertiary)">Permanently delete all stored analysis results from local storage.</p>
              </div>
              <button
                onClick={clearHistory}
                disabled={history.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-anomaly-high/10 hover:bg-anomaly-high/20 text-anomaly-high rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-caption"
              >
                <Trash size={18} weight="bold" />
                Clear {history.length} items
              </button>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="glass-panel overflow-hidden border-(--border-low)">
          <div className="p-6 border-b border-(--border-low) bg-(--bg-surface)/30 flex items-center gap-3">
            <SlidersHorizontal size={24} weight="duotone" className="text-(--brand-primary)" />
            <h2 className="text-header font-bold text-(--text-primary)">Anomaly Thresholds</h2>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-body font-bold text-(--text-primary) mb-2">Sensitivity Levels</h3>
              <p className="text-caption text-(--text-tertiary)">Define how strict the algorithm should be when flagging suspicious numbers.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(SENSITIVITY_LEVELS).map(([level, config]) => {
                const isActive = level === sensitivityLevel;
                const isDefault = level === DEFAULT_SENSITIVITY_LEVEL;
                return (
                  <button
                    key={level}
                    onClick={() => setSensitivityLevel(level as SensitivityLevel)}
                    className={`text-left p-5 rounded-2xl border transition-all bg-(--bg-base)/40 ${isActive ? 'border-(--brand-primary)/60 bg-(--brand-primary)/10 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.6)]' : 'border-(--border-low)/60 hover:border-(--border-high)'}`}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-caption font-bold text-(--text-primary)">
                        {config.label} ({(config.deviation * 100).toFixed(0)}% deviation)
                      </span>
                      {isDefault && (
                        <span className="text-tiny font-bold uppercase tracking-[0.2em] text-(--text-tertiary)">Default</span>
                      )}
                    </div>
                    <p className="text-caption text-(--text-secondary) leading-relaxed">{config.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Data Handling Section */}
        <section className="glass-panel overflow-hidden border-(--border-low)">
          <div className="p-6 border-b border-(--border-low) bg-(--bg-surface)/30 flex items-center gap-3">
            <Funnel size={24} weight="duotone" className="text-(--brand-primary)" />
            <h2 className="text-header font-bold text-(--text-primary)">Data Pre-processing</h2>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <span className="text-tiny font-bold uppercase tracking-[0.3em] text-(--text-tertiary)">Data Handling Rules</span>
              <p className="text-caption text-(--text-tertiary) mt-2">Configure how the algorithm prepares raw data before analysis.</p>
            </div>
            <div className="p-6 rounded-2xl border border-(--border-low)/60 bg-(--bg-base)/40 space-y-4">
              <div className="flex items-center gap-3">
                <Info size={18} weight="duotone" className="text-(--text-tertiary)" />
                <h3 className="text-body font-bold text-(--text-primary)">Negative Values</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(NEGATIVE_HANDLING_OPTIONS).map(([mode, config]) => {
                  const isActive = mode === negativeValueHandling;
                  const isDefault = mode === DEFAULT_NEGATIVE_HANDLING;
                  return (
                    <button
                      key={mode}
                      onClick={() => setNegativeValueHandling(mode as NegativeValueHandling)}
                      className={`text-left p-5 rounded-2xl border transition-all bg-(--bg-base)/30 ${isActive ? 'border-(--brand-primary)/60 bg-(--brand-primary)/10 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.6)]' : 'border-(--border-low)/60 hover:border-(--border-high)'}`}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-caption font-bold text-(--text-primary)">
                          {config.label}
                        </span>
                        {isDefault && (
                          <span className="text-tiny font-bold uppercase tracking-[0.2em] text-(--text-tertiary)">Recommended</span>
                        )}
                      </div>
                      <p className="text-caption text-(--text-secondary) leading-relaxed">{config.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pt-2 flex justify-center">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
              >
                <GithubLogo size={20} weight="bold" />
                <span className="text-secondary font-medium">View on GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
