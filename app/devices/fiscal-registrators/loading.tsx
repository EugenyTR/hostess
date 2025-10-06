export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-10 bg-gray-200 rounded mb-6 animate-pulse"></div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-6 py-3">
              <div className="flex space-x-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex space-x-4">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
