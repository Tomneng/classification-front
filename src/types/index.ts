export interface ProcessingResultDto {
  totalProcessed: number;
  classifiedCount: number;
  unclassifiedCount: number;
  message: string;
}

export interface TransactionDto {
  id: string;
  transactionDate: string;
  description: string;
  amount: number;
  transactionType: string;
  companyId: string;
  companyName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  isClassified: boolean;
}

export interface FileContent {
  name: string;
  content: string;
  type: 'csv' | 'json';
} 