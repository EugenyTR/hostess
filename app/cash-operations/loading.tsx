export default function CashOperationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Results Summary Skeleton */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="grid grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-8 gap-4">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-6 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
