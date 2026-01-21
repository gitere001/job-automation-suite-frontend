import React from 'react';

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 text-red-500 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};