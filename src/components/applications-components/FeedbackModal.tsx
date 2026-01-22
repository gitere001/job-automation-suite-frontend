import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    success: boolean;
    message?: string;
    summary?: {
      totalCompanies: number;
      successfullySent: number;
      skipped: number;
      failed: number;
      processedAt: string;
    };
    detailedResults?: Array<{
      company: string;
      email: string;
      status: 'sent' | 'skipped' | 'failed' | 'error';
      reason?: string;
      error?: string;
      messageId?: string;
      timestamp: string;
    }>;
  } | null;
}

const FeedbackModal = ({ isOpen, onClose, result }: FeedbackModalProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('summary');

  useEffect(() => {
    if (result && isOpen) {
      setActiveTab('summary');
    }
  }, [result, isOpen]);

  if (!isOpen || !result) return null;

  const { success, summary, detailedResults, message } = result;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'skipped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircleIcon className="h-4 w-4" />;
      case 'skipped': return <InformationCircleIcon className="h-4 w-4" />;
      case 'failed':
      case 'error': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Sent';
      case 'skipped': return 'Skipped';
      case 'failed': return 'Failed';
      case 'error': return 'Error';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${success ? 'bg-green-100' : 'bg-red-100'}`}>
              {success ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {success ? 'Applications Sent Successfully' : 'Sending Failed'}
              </h2>
              <p className="text-sm text-gray-600">
                {success ? 'Your job applications have been processed' : 'There was an issue sending applications'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        {summary && detailedResults && (
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('details')}
              >
                Details ({detailedResults.length})
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!success && message && !summary && (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {success && summary && (
            <>
              {activeTab === 'summary' ? (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{summary.totalCompanies}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{summary.successfullySent}</div>
                      <div className="text-sm text-gray-600">Sent</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{summary.skipped}</div>
                      <div className="text-sm text-gray-600">Skipped</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">{summary.failed}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Sent</span>
                        <span className="text-gray-600">{summary.successfullySent} companies</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(summary.successfullySent / summary.totalCompanies) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Skipped</span>
                        <span className="text-gray-600">{summary.skipped} companies</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${(summary.skipped / summary.totalCompanies) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Failed</span>
                        <span className="text-gray-600">{summary.failed} companies</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${(summary.failed / summary.totalCompanies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  {summary.successfullySent > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">Applications Sent!</h4>
                          <p className="text-sm text-green-700">
                            {summary.successfullySent} email{summary.successfullySent !== 1 ? 's' : ''} sent successfully.
                            Each email was sent with a 5-second delay between them.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Failed Warning */}
                  {summary.failed > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">Some Applications Failed</h4>
                          <p className="text-sm text-yellow-700">
                            {summary.failed} email{summary.failed !== 1 ? 's' : ''} failed to send.
                            Check the Details tab for specific errors.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-2">
                    Showing {detailedResults?.length} results
                  </div>
                  <div className="divide-y divide-gray-200">
                    {detailedResults?.map((item, index) => (
                      <div key={index} className="py-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-900">{item.company}</div>
                            <div className="text-sm text-gray-500">{item.email}</div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {getStatusText(item.status)}
                          </span>
                        </div>

                        {item.status === 'skipped' && item.reason && (
                          <div className="text-sm text-gray-600">{item.reason}</div>
                        )}

                        {item.status === 'failed' && item.error && (
                          <div className="text-sm text-red-600">{item.error}</div>
                        )}

                        {item.status === 'sent' && item.messageId && (
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {item.messageId}
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;