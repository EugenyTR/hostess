export default function CashOperationDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>

          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Information Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Quick Stats Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>

              <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
