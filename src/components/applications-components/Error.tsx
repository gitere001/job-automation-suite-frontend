import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

const Error = ({ message, onRetry }: ErrorProps) => {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 p-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-800">Error Loading Applications</h3>
          <div className="mt-2">
            <p className="text-sm text-red-700">{message}</p>
            <p className="text-sm text-red-700 mt-1">
              Please check your connection and try again.
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={onRetry}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;