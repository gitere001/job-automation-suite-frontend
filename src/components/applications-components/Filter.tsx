import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Filters {
  responseStatus: string;
  search: string;
  limit: string;
  sort: string;
  applicationType: string;
}

interface FilterProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  onReset: () => void;
  isLoading: boolean;
}

const Filter = ({ filters, onFilterChange, onReset, isLoading }: FilterProps) => {
  const responseStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'no_response', label: 'No Response' },
    { value: 'replied', label: 'Replied' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'ghosted', label: 'Ghosted' }
  ];

  const limitOptions = [
    { value: '20', label: '20' },
    { value: '40', label: '40' },
    { value: '50', label: '50' },
    { value: '70', label: '70' },
    { value: 'all', label: 'All' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'name', label: 'Company A-Z' },
    { value: '-name', label: 'Company Z-A' },
    { value: '-updatedAt', label: 'Recently Updated' }
  ];

  const applicationTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'manual', label: 'Manual' },
    { value: 'automated', label: 'Automated' }
  ];



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by company name..."
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Response Status Filter */}
          <div>
            <select
              value={filters.responseStatus}
              onChange={(e) => onFilterChange({ responseStatus: e.target.value })}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {responseStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Limit Filter */}
          <div>
            <select
              value={filters.limit}
              onChange={(e) => onFilterChange({ limit: e.target.value })}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {limitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Show {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.applicationType}
              onChange={(e) => onFilterChange({ applicationType: e.target.value })}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {applicationTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Reset</span>
          </button>
        </div>
      </div>

      {/* Active Filters Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.responseStatus && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FunnelIcon className="w-3 h-3 mr-1" />
            Status: {responseStatusOptions.find(o => o.value === filters.responseStatus)?.label}
          </span>
        )}

        {filters.search && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
            Search: "{filters.search}"
          </span>
        )}

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Sort: {sortOptions.find(o => o.value === filters.sort)?.label}
        </span>
      </div>
    </div>
  );
};

export default Filter;