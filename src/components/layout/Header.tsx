import React from 'react';
import { useApp } from '../../store/useApp';
import { FileCode, Image as ImageIcon, FilePdf } from '@phosphor-icons/react';
import { exportToJSON, exportToPDF, exportToPNG } from '../../services/reportGenerator';
import { clsx } from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export const Header: React.FC = () => {
  const { analysisResult, currentDataset } = useApp();
  const activeName = currentDataset?.name || analysisResult?.name || 'New Analysis';

  const handleExportJSON = () => {
    if (analysisResult) exportToJSON(analysisResult);
  };

  const handleExportPDF = () => {
    if (analysisResult) exportToPDF('root', `benford-report-${analysisResult.name.replace(/\s+/g, '-')}`);
  };

  const handleExportPNG = () => {
    if (analysisResult) exportToPNG('root', `benford-summary-${analysisResult.name.replace(/\s+/g, '-')}`);
  };

  return (
    <LazyMotion features={domAnimation}>
      <header className="h-24 flex items-center justify-between px-10 sticky top-0 z-20 bg-(--bg-base)">
        <div className="flex items-center gap-6">
          {analysisResult ? (
            <div className="flex items-center gap-4">
              <h1 className="text-title font-bold text-(--text-primary) tracking-tight">{activeName}</h1>
              
              <m.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={clsx(
                  "px-3 py-1 rounded-full text-caption font-bold border",
                  analysisResult.risk === 'low' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  analysisResult.risk === 'medium' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  analysisResult.risk === 'high' && "bg-red-500/10 text-red-500 border-red-500/20",
                )}
              >
                {analysisResult.risk} anomaly risk
              </m.div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-(--text-tertiary)">
              <span className="text-secondary font-medium tracking-tight">{activeName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {analysisResult && (
            <>
              <button 
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-5 py-2.5 bg-(--bg-surface) border border-(--border-low) text-caption font-semibold text-(--text-primary) hover:bg-(--bg-overlay) rounded-full transition-all"
                title="Export Raw JSON"
              >
                <FileCode size={16} weight="bold" />
                <span>JSON</span>
              </button>
              <button 
                onClick={handleExportPNG}
                className="flex items-center gap-2 px-5 py-2.5 bg-(--bg-surface) border border-(--border-low) text-caption font-semibold text-(--text-primary) hover:bg-(--bg-overlay) rounded-full transition-all"
                title="Export as PNG Image"
              >
                <ImageIcon size={16} weight="bold" />
                <span>PNG</span>
              </button>
              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-6 py-2.5 bg-(--brand-primary) hover:bg-(--brand-hover) text-(--brand-text) rounded-full text-caption font-bold transition-all ml-2 shadow-sm"
                title="Download PDF Report"
              >
                <FilePdf size={16} weight="bold" />
                <span>Generate PDF</span>
              </m.button>
            </>
          )}
        </div>
      </header>
    </LazyMotion>
  );
};
