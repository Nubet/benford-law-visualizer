import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import * as XLSX from 'xlsx';
import type { Dataset } from '../types';

export const parseCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results: ParseResult<any>) => {
        const columns = results.meta.fields || [];
        const numericColumns = findNumericColumns(results.data, columns);
        resolve({
          name: file.name,
          data: results.data,
          columns,
          numericColumns
        });
      },
      error: (error: Error) => reject(error)
    });
  });
};

export const parseExcel = async (file: File): Promise<Dataset> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
  
  const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
  const numericColumns = findNumericColumns(jsonData, columns);

  return {
    name: file.name,
    data: jsonData,
    columns,
    numericColumns
  };
};

export const parseJSON = async (file: File): Promise<Dataset> => {
  const text = await file.text();
  const jsonData = JSON.parse(text);
  const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  
  const columns = dataArray.length > 0 ? Object.keys(dataArray[0]) : [];
  const numericColumns = findNumericColumns(dataArray, columns);

  return {
    name: file.name,
    data: dataArray,
    columns,
    numericColumns
  };
};

const findNumericColumns = (data: Record<string, any>[], columns: string[]): string[] => {
  if (data.length === 0) return [];
  
  return columns.filter(col => {
    return data.slice(0, 50).some(row => {
      const val = row[col];
      return val !== null && val !== undefined && !isNaN(parseFloat(String(val)));
    });
  });
};

export const parseFile = (file: File): Promise<Dataset> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    default:
      throw new Error('Unsupported file format');
  }
};
