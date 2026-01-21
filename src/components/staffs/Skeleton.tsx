import React from 'react';

export const StaffTableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-9 bg-gray-200 rounded w-24"></div>
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(5)].map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};