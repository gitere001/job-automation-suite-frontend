import { useState, useEffect } from "react";
import Table from "../components/applications-components/Table";
import Filter from "../components/applications-components/Filter";
import Error from "../components/applications-components/Error";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddApplicationModal from "../components/applications-components/AddApplicationModal";
import ManualApplicationModal from "../components/applications-components/ManualApplicationModal";

interface Application {
  _id: string;
  name: string;
  email: string;
  initialReach: boolean;
  responseStatus: string;
  followUpCount: number;
  priority: string;
  createdAt: string;
  updatedAt: string;
  responseDate?: string;
  nextFollowUpDate?: string;
}

interface Meta {
  total: number;
  returned: number;
  limit: number | string;
  filters: {
    responseStatus: string;
    search: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Application[];
  meta: Meta;
  timestamp: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    responseStatus: "",
    search: "",
    limit: "20",
    sort: "-createdAt",
    applicationType: ""
  });

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();

      if (filters.responseStatus)
        params.append("responseStatus", filters.responseStatus);
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.applicationType)
        params.append("applicationType", filters.applicationType);

      const queryString = params.toString();
      const url = `${import.meta.env.VITE_API_URL}/api/v1/job-applications/applications${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setApplications(data.data);
        setMeta(data.meta);
      } else {
        throw new Error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load applications",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      responseStatus: "",
      search: "",
      limit: "20",
      sort: "-createdAt",
      applicationType: ""
    });
  };

  const handleAddApplication = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Job Applications
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your job applications
          </p>
        </div>
        <div className="flex items-center gap-4">
          {meta && (
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-500">
                Showing {meta.returned} of {meta.total}
              </p>
              <p className="text-sm font-medium text-gray-900">
                Limit: {meta.limit === "all" ? "All" : meta.limit}
              </p>
            </div>
          )}
          <button
            onClick={handleAddApplication}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Add Application</span>
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Add Manual</span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <Filter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Error Component */}
      {error && <Error message={error} onRetry={() => fetchApplications()} />}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Loading applications...
          </p>
        </div>
      )}

      {/* Table Component */}
      {!isLoading && !error && (
        <Table
          applications={applications}
          meta={meta}
          onRefresh={fetchApplications}
        />
      )}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchApplications(); // Refresh the table
        }}
      />
      <ManualApplicationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSuccess={() => {
          fetchApplications(); // Refresh the table
        }}
      />

      {/* Mobile Stats */}
      {meta && (
        <div className="sm:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Showing</p>
              <p className="text-lg font-semibold text-gray-900">
                {meta.returned}/{meta.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Limit</p>
              <p className="text-lg font-semibold text-gray-900">
                {meta.limit === "all" ? "All" : meta.limit}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
