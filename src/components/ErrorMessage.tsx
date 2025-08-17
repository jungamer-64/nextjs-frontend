import React from 'react';

type Props = {
  title?: string;
  message?: string;
};

const ErrorMessage = ({ title = 'エラー', message }: Props) => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="rounded-md bg-red-50 border border-red-200 p-4">
        <strong className="block text-lg text-red-700 mb-1">{title}</strong>
        <p className="text-sm text-red-700">{message ?? '予期しないエラーが発生しました。'}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
