export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] ml-[220px]">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-[#f0f0f0] rounded w-64 mb-6"></div>

            {/* Опции отчета */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#f0f0f0] rounded-full"></div>
                  <div className="h-4 bg-[#f0f0f0] rounded w-20"></div>
                </div>
              ))}
            </div>

            {/* Кнопка */}
            <div className="h-10 bg-[#f0f0f0] rounded w-48 mb-6"></div>

            {/* Селектор даты */}
            <div className="h-10 bg-[#f0f0f0] rounded w-80 mb-6"></div>

            {/* Таблица */}
            <div className="space-y-3">
              <div className="h-12 bg-[#f0f0f0] rounded"></div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-[#f0f0f0] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
