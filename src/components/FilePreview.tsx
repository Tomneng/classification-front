'use client';

import { FileContent } from '@/types';

interface FilePreviewProps {
  file: FileContent | null;
  title: string;
}

export default function FilePreview({ file, title }: FilePreviewProps) {
  if (!file) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">파일을 업로드하면 내용이 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  const formatContent = (content: string, type: 'csv' | 'json') => {
    if (type === 'json') {
      try {
        return JSON.stringify(JSON.parse(content), null, 2);
      } catch {
        return content;
      }
    }
    return content;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        {title} - {file.name}
      </h3>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-600">
            {file.type.toUpperCase()} 파일 내용
          </span>
        </div>
        <div className="max-h-96 overflow-auto">
          <pre className="p-4 text-sm text-gray-800 bg-white whitespace-pre-wrap font-mono">
            {formatContent(file.content, file.type)}
          </pre>
        </div>
      </div>
    </div>
  );
} 