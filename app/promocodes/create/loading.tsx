export default function CreatePromocodeLoading() {
  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse mr-4"></div>
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-8xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Карточки формы */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-2"></div>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j}>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопки действий */}
        <div className="mt-6 flex items-center justify-end space-x-4">
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
