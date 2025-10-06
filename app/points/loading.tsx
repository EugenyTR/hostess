export default function PointsLoading() {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок и кнопки */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-16">№</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33]">Организация</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33]">Тип связи</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33]">Номер телефона</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33]">Адрес</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-32">Действия</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-[#f0f0f0]">
                    <td className="py-3 px-4">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
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
