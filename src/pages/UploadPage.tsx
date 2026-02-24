import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUp, File as FileIcon, WarningCircle, Database, ArrowRight } from '@phosphor-icons/react';
import { useApp } from '../store/useApp';
import { parseFile } from '../services/fileParser';
import { mockDatasets } from '../services/mockDataService';
import { clsx } from 'clsx';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

export const UploadPage: React.FC = () => {
  const { setDataset } = useApp();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const dataset = await parseFile(file);
      setDataset(dataset);
      setTimeout(() => {
        navigate('/analysis');
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setLoading(false);
    }
  }, [navigate, setDataset]);

  const handleMockSelect = (id: string) => {
    setLoading(true);
    const mock = mockDatasets.find(m => m.id === id);
    if (mock) {
      setTimeout(() => {
        setDataset(mock.generate());
        navigate('/analysis');
      }, 600);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-7xl mx-auto py-10">
        <UploadIntro
          isDragging={isDragging}
          loading={loading}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onFileInput={onFileInput}
        />
        {error && <UploadError message={error} />}
        <MockDatasetSection onSelect={handleMockSelect} />
        <UploadFeatureList />
      </div>
    </LazyMotion>
  );
};

const UploadIntro: React.FC<{
  isDragging: boolean;
  loading: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isDragging, loading, onDragOver, onDragLeave, onDrop, onFileInput }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
    <div className="lg:col-span-5 space-y-8">
      <m.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <span className="text-(--brand-primary) font-bold uppercase tracking-[0.3em] text-tiny mb-4 block">Data Acquisition</span>
        <h1 className="text-display mb-6">
          Unmask <br />
          <span className="text-(--brand-primary)">Anomaly</span> <br />
          In Seconds.
        </h1>
        <p className="text-secondary text-(--text-secondary) leading-relaxed max-w-md">
          Detect suspicious patterns in datasets using Benford's Law.
        </p>
      </m.div>

      <div className="flex gap-10">
        <div>
          <div className="text-large font-bold text-(--text-primary) mb-1">50MB</div>
          <div className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">Max Load</div>
        </div>
        <div className="w-px h-10 bg-(--border-low)" />
        <div>
          <div className="text-large font-bold text-(--text-primary) mb-1">Local</div>
          <div className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">Processing</div>
        </div>
      </div>
    </div>

    <div className="lg:col-span-7">
    <m.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        className={clsx(
          'relative glass-panel p-2 transition-all duration-500',
          isDragging ? 'scale-[1.02] ring-4 ring-(--brand-primary)/20 shadow-lg' : 'shadow-sm',
          loading && 'pointer-events-none opacity-60'
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="border-2 border-dashed border-(--border-low) rounded-[2.2rem] p-20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={onFileInput}
            accept=".csv,.xlsx,.xls,.json"
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <m.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-(--brand-primary)/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-(--brand-primary) border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-title font-bold text-(--text-primary) tracking-tight">Hashing & Parsing...</p>
              </m.div>
            ) : (
              <m.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-(--brand-surface) text-(--brand-primary) rounded-4xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-(--brand-primary) group-hover:text-(--brand-text) transition-all duration-500 shadow-sm border border-(--border-low)">
                  <CloudArrowUp size={48} weight="bold" />
                </div>
                <h3 className="text-title font-bold text-(--text-primary) mb-3 tracking-tight">
                  Drop dataset here
                </h3>
                <p className="text-secondary text-(--text-secondary) mb-10 max-w-xs font-medium leading-relaxed">
                  Supports CSV, XLSX, and JSON. <br />
                  No data ever leaves your browser session.
                </p>

                <div className="flex gap-4">
                  {['CSV', 'Excel', 'JSON'].map(ext => (
                    <div key={ext} className="flex items-center gap-2 px-4 py-2 rounded-full bg-(--bg-base) border border-(--border-low) text-caption font-bold text-(--text-secondary) uppercase tracking-widest">
                      <FileIcon size={14} weight="bold" />
                      {ext}
                    </div>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  </div>
);

const UploadError: React.FC<{ message: string }> = ({ message }) => (
  <m.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6 flex items-center gap-3 text-red-400 bg-red-500/5 px-6 py-4 rounded-2xl border border-red-500/10"
  >
    <WarningCircle size={24} weight="bold" />
    <span className="text-caption font-bold tracking-tight">{message}</span>
  </m.div>
);

const MockDatasetSection: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => (
  <div className="space-y-10">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-(--bg-overlay) rounded-2xl flex items-center justify-center border border-(--border-low)">
          <Database size={24} weight="duotone" className="text-(--brand-primary)" />
        </div>
        <h2 className="text-title font-bold text-(--text-primary) tracking-tight">Test Scenarios</h2>
      </div>
      <div className="h-px flex-1 mx-10 bg-(--border-low) hidden md:block" />
      <p className="text-(--text-tertiary) font-bold uppercase tracking-widest text-tiny">No data? No problem.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockDatasets.map((mock, idx) => (
        <m.button
          key={mock.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + idx * 0.1 }}
          whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(mock.id)}
          className="glass-panel p-8 text-left group relative overflow-hidden flex flex-col h-full hover:border-(--brand-primary)/30 transition-all duration-300"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-(--brand-primary)/5 rounded-full blur-2xl group-hover:bg-(--brand-primary)/10 transition-colors" />
          <div className="flex items-center justify-between mb-6">
            <span className="text-tiny font-bold uppercase tracking-widest text-(--brand-primary) bg-(--brand-surface) px-3 py-1.5 rounded-lg border border-(--brand-primary)/20">
              {mock.category}
            </span>
            <ArrowRight size={20} weight="bold" className="text-(--text-tertiary) group-hover:text-(--brand-primary) group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="font-bold text-(--text-primary) mb-3 text-header tracking-tight leading-tight">{mock.name}</h4>
          <p className="text-caption text-(--text-secondary) leading-relaxed flex-1">{mock.description}</p>
        </m.button>
      ))}
    </div>
  </div>
);

const UploadFeatureList = () => (
  <div className="mt-24 border-t border-(--border-low) pt-20">
    <div className="mb-10">
      <span className="text-tiny font-bold uppercase tracking-[0.3em] text-(--text-tertiary)">Preparing Your Data</span>
      <h3 className="text-title font-bold text-(--text-primary) tracking-tight mt-3">Data Best Practices</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        {
          title: 'Go Big',
          desc: 'Works best on datasets with a wide range of values (spanning multiple orders of magnitude).'
        },
        {
          title: 'Raw Numbers Only',
          desc: 'Do not use averages, assigned numbers (like IDs or phone numbers), or pre-summarized data.'
        },
        {
          title: 'Sample Size',
          desc: 'For accurate results, aim for a dataset with at least 100-500 entries.'
        }
      ].map((item) => (
        <div key={item.title} className="p-6 rounded-2xl border border-(--border-low)/60 bg-(--bg-base)/40">
          <h4 className="font-bold text-(--text-primary) mb-3 text-body tracking-tight">{item.title}</h4>
          <p className="text-caption text-(--text-secondary) leading-relaxed font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
