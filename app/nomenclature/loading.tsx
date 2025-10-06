export default function NomenclatureLoading() {
  return (
    <div className="min-h-screen bg-gray-50 ml-[220px]">
      <div className="p-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Categories skeleton */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>

        {/* Search and Export skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
