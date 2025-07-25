'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import FilePreview from '@/components/FilePreview';
import { apiService } from '@/services/api';
import { FileContent, ProcessingResultDto } from '@/types';

export default function Home() {
  const [bankTransactionsFile, setBankTransactionsFile] = useState<FileContent | null>(null);
  const [rulesFile, setRulesFile] = useState<FileContent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResultDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!bankTransactionsFile || !rulesFile) {
      setError('두 파일 모두 업로드해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // FileContent를 File 객체로 변환
      const bankTransactionsBlob = new Blob([bankTransactionsFile.content], { type: 'text/csv' });
      const rulesBlob = new Blob([rulesFile.content], { type: 'application/json' });
      
      const bankTransactionsFileObj = new File([bankTransactionsBlob], bankTransactionsFile.name, { type: 'text/csv' });
      const rulesFileObj = new File([rulesBlob], rulesFile.name, { type: 'application/json' });

      const processingResult = await apiService.processTransactions(bankTransactionsFileObj, rulesFileObj);
      setResult(processingResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
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
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                파일 업로드
              </Link>
              <Link
                href="/transactions"
                className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                거래 내역 조회
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              파일 업로드 및 분류
            </h2>
            <p className="text-gray-600">
              은행 거래 내역과 분류 규칙을 업로드하여 자동으로 분류하세요
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* 파일 업로드 섹션 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  파일 업로드
                </h3>
                
                <div className="space-y-4">
                  <FileUpload
                    onFileUpload={setBankTransactionsFile}
                    accept=".csv"
                    label="은행 거래 내역 (CSV)"
                    fileType="csv"
                  />
                  
                  <FileUpload
                    onFileUpload={setRulesFile}
                    accept=".json"
                    label="분류 규칙 (JSON)"
                    fileType="json"
                  />
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleProcess}
                    disabled={!bankTransactionsFile || !rulesFile || isProcessing}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                      !bankTransactionsFile || !rulesFile || isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        처리 중...
                      </div>
                    ) : (
                      '분류 처리 시작'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    처리 결과
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">총 처리 건수:</span>
                      <span className="font-semibold text-gray-900">{result.totalProcessed}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">분류 완료:</span>
                      <span className="font-semibold text-green-600">{result.classifiedCount}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">미분류:</span>
                      <span className="font-semibold text-yellow-600">{result.unclassifiedCount}건</span>
                    </div>
                    {result.message && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">{result.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 파일 미리보기 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FilePreview
              file={bankTransactionsFile}
              title="은행 거래 내역"
            />
            <FilePreview
              file={rulesFile}
              title="분류 규칙"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
