export default function ReceiptDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="p-6">
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-6 bg-gray-200 rounded w-32 mr-4 animate-pulse"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>
        </div>

        {/* Основная информация о чеке */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Левая колонка */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Таблица позиций */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb]">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f9fa] border-b border-[#e5e7eb]">
                <tr>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#e5e7eb]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Итоговая информация */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-6">
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
