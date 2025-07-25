import { ProcessingResultDto, TransactionDto } from '@/types';

const API_BASE_URL = '/api/v1/accounting';

export const apiService = {
  async ping(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pong`);
    if (!response.ok) {
      throw new Error('Ping failed');
    }
  },

  async processTransactions(
    bankTransactionsFile: File,
    rulesFile: File
  ): Promise<ProcessingResultDto> {
    const formData = new FormData();
    formData.append('bankTransactions', bankTransactionsFile);
    formData.append('rules', rulesFile);

    const response = await fetch(`${API_BASE_URL}/process`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '처리 중 오류가 발생했습니다.');
    }

    return response.json();
  },

  async getTransactionsByCompany(companyId: string): Promise<TransactionDto[]> {
    const response = await fetch(`${API_BASE_URL}/records?companyId=${companyId}`);
    
    if (!response.ok) {
      throw new Error('거래 내역 조회 중 오류가 발생했습니다.');
    }

    return response.json();
  }
}; 