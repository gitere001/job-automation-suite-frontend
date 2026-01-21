// DashboardSkeleton.tsx
const DashboardSkeleton = () => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded-md w-24 mb-3 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-md w-32 mb-3 animate-pulse"></div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-20 ml-2 animate-pulse"></div>
          </div>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonPieChart = ({ className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="h-6 bg-gray-200 rounded-md w-36 mb-4 animate-pulse"></div>
      <div className="flex items-center justify-center" style={{ height: '300px' }}>
        <div className="relative">
          <div className="w-48 h-48 border-8 border-gray-200 rounded-full animate-pulse"></div>
          <div className="absolute top-4 left-4 w-40 h-40 border-8 border-gray-100 rounded-full animate-pulse"></div>
          <div className="absolute top-8 left-8 w-32 h-32 border-4 border-gray-50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonActivityGrid = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="h-6 bg-gray-200 rounded-md w-32 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-md w-16 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonStatusGrid = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="h-6 bg-gray-200 rounded-md w-48 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <div className="h-8 bg-gray-200 rounded-md w-12 mb-2 animate-pulse"></div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-16 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-48 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          <div className="text-right">
            <div className="h-3 bg-gray-200 rounded-md w-12 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-md w-16 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonPieChart />
        <SkeletonPieChart />
      </div>

      {/* Weekly Activity */}
      <SkeletonActivityGrid />

      {/* Status Breakdown */}
      <SkeletonStatusGrid />
    </div>
  );
};

export default DashboardSkeleton;