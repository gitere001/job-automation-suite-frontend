
import {
  EnvelopeIcon,
  ClockIcon,
  FlagIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilIcon,

  LinkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import StatusUpdateModal from './StatusUpdateModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface Meta {
  total: number;
  returned: number;
  limit: number | string;
  filters: {
    responseStatus: string;
    search: string;
  };
}

interface Application {
  _id: string;
  name: string;
  email: string;
  website?: string;
  initialReach: boolean;
  responseStatus: string;
  followUpCount: number;
  priority: string;
  createdAt: string;
  updatedAt: string;
  responseDate?: string;
  nextFollowUpDate?: string;
  applicationType: string;
}

interface TableProps {
  applications: Application[];
  meta: Meta | null;
  onRefresh: () => void;
}

const Table = ({ applications, meta, onRefresh }: TableProps) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      no_response: { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: 'No Response' },
      replied: { color: 'bg-blue-100 text-blue-800', icon: EnvelopeIcon, label: 'Replied' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Rejected' },
      interview: { color: 'bg-purple-100 text-purple-800', icon: CalendarIcon, label: 'Interview' },
      offer: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Offer' },
      ghosted: { color: 'bg-orange-100 text-orange-800', icon: ClockIcon, label: 'Ghosted' }
    };

    const config = statusConfig[status] || statusConfig.no_response;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { color: string; label: string }> = {
      high: { color: 'bg-red-100 text-red-800', label: 'High' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      low: { color: 'bg-green-100 text-green-800', label: 'Low' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FlagIcon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getApplicationTypeBadge = (type: string) => {
    const typeConfig: Record<string, { color: string; label: string }> = {
      manual: { color: 'bg-blue-100 text-blue-800', label: 'Manual' },
      automated: { color: 'bg-green-100 text-green-800', label: 'Automated' }
    };

    const config = typeConfig[type] || typeConfig.automated;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  }

  const handleUpdateStatus = (application: Application) => {
    setSelectedApplication(application);
    setShowStatusModal(true);
  };

  const handleDeleteApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowDeleteModal(true);
  };

  const handleStatusUpdateSuccess = () => {
    setShowStatusModal(false);
    setSelectedApplication(null);
    onRefresh();
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setSelectedApplication(null);
    onRefresh();
  };



  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters or add a new application.</p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Follow-ups
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => {
                // Format website URL
                let websiteUrl = application.website;
                if (websiteUrl && !websiteUrl.startsWith('http')) {
                  websiteUrl = `https://${websiteUrl}`;
                }

                return (
                  <tr key={application._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.website ? (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <LinkIcon className="h-3 w-3" />
                          Visit Site
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(application.responseStatus)}
                        {application.responseDate && (
                          <div className="text-xs text-gray-500">
                            Response: {formatDate(application.responseDate)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(application.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getApplicationTypeBadge(application.applicationType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ArrowPathIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{application.followUpCount}</span>
                        {application.nextFollowUpDate && (
                          <div className="text-xs text-gray-500 ml-2">
                            Next: {formatDate(application.nextFollowUpDate)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(application.createdAt)}</div>
                      <div className="text-xs text-gray-500">{formatTimeAgo(application.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(application)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="Update Status"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(application)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete Application"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {meta && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing <span className="font-medium">{meta.returned}</span> of{' '}
                <span className="font-medium">{meta.total}</span> applications
              </div>
              <div className="text-sm text-gray-500">
                Limit: <span className="font-medium">{meta.limit === 'all' ? 'All' : meta.limit}</span> •
                Filtered by:{' '}
                <span className="font-medium">
                  {meta.filters.responseStatus === 'none' ? 'All Status' : meta.filters.responseStatus}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedApplication && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedApplication(null);
          }}
          onSuccess={handleStatusUpdateSuccess}
          application={selectedApplication}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedApplication && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedApplication(null);
          }}
          onSuccess={handleDeleteSuccess}
          application={selectedApplication}
        />
      )}
    </>
  );
};

export default Table;
