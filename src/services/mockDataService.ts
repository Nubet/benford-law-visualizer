import type { Dataset } from '../types';

export interface MockDatasetDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  generate: () => Dataset;
}

export const mockDatasets: MockDatasetDefinition[] = [
  {
    id: 'world_cities',
    name: 'World Cities Population',
    description: 'Actual demographic data. Natural populations typically follow Benford\'s Law with high precision.',
    category: 'Demographics',
    generate: () => {
      const data = Array.from({ length: 5000 }, (_, i) => ({
        city_id: i + 1,
        name: `City ${i + 1}`,
        population: Math.floor(Math.pow(10, Math.random() * 6 + 2)) // 100 to 100,000,000
      }));
      return {
        name: 'World Cities Population (Mock)',
        data,
        columns: ['city_id', 'name', 'population'],
        numericColumns: ['population']
      };
    }
  },
  {
    id: 'accounting_expenses',
    name: 'Corporate Expenses (Normal)',
    description: 'A typical set of invoices and operating expenses without external interference.',
    category: 'Finance',
    generate: () => {
      const data = Array.from({ length: 2500 }, (_, i) => ({
        invoice_no: `INV-${1000 + i}`,
        amount: Math.round((Math.random() * Math.random() * 5000 + 10) * 100) / 100
      }));
      return {
        name: 'Corporate Expenses (Mock)',
        data,
        columns: ['invoice_no', 'amount'],
        numericColumns: ['amount']
      };
    }
  },
  {
    id: 'manipulated_data',
    name: 'Manipulated Data (Anomaly)',
    description: 'Artificially generated data with over-representation of digits 5 and 7. High anomaly risk.',
    category: 'Fraud Detection',
    generate: () => {
      const data = Array.from({ length: 1500 }, (_, i) => {
        const firstDigit = Math.random() > 0.5 ? (Math.random() > 0.5 ? 5 : 7) : Math.floor(Math.random() * 9) + 1;
        const rest = Math.random().toString().substring(2, 6);
        const amount = parseFloat(`${firstDigit}.${rest}`) * Math.pow(10, Math.floor(Math.random() * 4));
        return {
          id: i + 1,
          transaction_value: Math.round(amount * 100) / 100
        };
      });
      return {
        name: 'Suspicious Transactions (Mock)',
        data,
        columns: ['id', 'transaction_value'],
        numericColumns: ['transaction_value']
      };
    }
  },
  {
    id: 'fibonacci_sequence',
    name: 'Fibonacci Sequence',
    description: 'See how pure math aligns perfectly with the expected distribution.',
    category: 'Mathematics',
    generate: () => {
      const data = [];
      let a = 1n, b = 1n;
      for (let i = 0; i < 300; i++) {
        data.push({ term: i + 1, value: a.toString() });
        const next = a + b;
        a = b;
        b = next;
      }
      return {
        name: 'Fibonacci Sequence (First 300)',
        data,
        columns: ['term', 'value'],
        numericColumns: ['value']
      };
    }
  }
];
