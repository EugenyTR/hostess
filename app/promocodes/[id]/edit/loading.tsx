export default function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded mr-4"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>

        {/* Форма */}
        <div className="space-y-6">
          {/* Основная информация */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          </div>

          {/* Параметры скидки */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Период действия */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Точки применения */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end space-x-4">
            <div className="w-20 h-10 bg-gray-200 rounded"></div>
            <div className="w-32 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
