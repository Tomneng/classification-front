'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { TransactionDto } from '@/types';
import TransactionTable from '@/components/TransactionTable';

export default function TransactionsPage() {
  const [companyId, setCompanyId] = useState('');
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!companyId.trim()) {
      setError('회사 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.getTransactionsByCompany(companyId);
      setTransactions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 헤더 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                거래 내역 분류 시스템
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                파일 업로드
              </Link>
              <Link
                href="/transactions"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                거래 내역 조회
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              거래 내역 조회
            </h2>
            <p className="text-gray-600">
              회사 ID를 입력하여 거래 내역을 조회하세요
            </p>
          </div>

          {/* 검색 섹션 */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                  회사 ID
                </label>
                <input
                  type="text"
                  id="companyId"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="회사 ID를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      조회 중...
                    </div>
                  ) : (
                    '조회'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">조회 오류</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* 거래 내역 테이블 */}
          <TransactionTable 
            transactions={transactions} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
} 