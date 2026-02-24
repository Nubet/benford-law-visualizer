import type { AnalysisSummary, Dataset, SensitivityLevel, NegativeValueHandling } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  version: string;
  exportDate: string;
  analysis: AnalysisSummary;
  settings: {
    sensitivityLevel: SensitivityLevel;
    negativeValueHandling: NegativeValueHandling;
  };
  dataset: {
    name: string;
    totalRecords: number;
    columns: string[];
    numericColumns: string[];
    analyzedColumn: string;
  };
}

export const exportToJSON = (
  result: AnalysisSummary,
  currentDataset?: Dataset | null,
  sensitivityLevel?: SensitivityLevel,
  negativeValueHandling?: NegativeValueHandling
) => {
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    analysis: result,
    settings: {
      sensitivityLevel: sensitivityLevel || 'standard',
      negativeValueHandling: negativeValueHandling || 'absolute',
    },
    dataset: {
      name: currentDataset?.name || result.name,
      totalRecords: currentDataset?.data.length || result.totalCount,
      columns: currentDataset?.columns || [],
      numericColumns: currentDataset?.numericColumns || [],
      analyzedColumn: result.columnName,
    },
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `benford-analysis-${result.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#09090b',
    scale: 2,
    logging: false,
    useCORS: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
};

export const exportToPNG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#09090b',
    scale: 2,
    logging: false,
    useCORS: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imgData;
  link.download = `${filename}.png`;
  link.click();
};
