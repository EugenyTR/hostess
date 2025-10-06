export default function CitiesLoading() {
  return (
    <div className="min-h-screen bg-white ml-[220px]">
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-9 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Фильтры */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-11 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full md:w-48 h-11 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Таблица */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb]">
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-6 py-3">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
