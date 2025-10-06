export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-[#e3e3e3] rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-[#e3e3e3] rounded w-32 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e3e3e3]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7f7f7] border-b border-[#e3e3e3]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                  Наименование
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e3e3e3]">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-[#e3e3e3] rounded w-8 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-[#e3e3e3] rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-6 w-6 bg-[#e3e3e3] rounded animate-pulse"></div>
                      <div className="h-6 w-6 bg-[#e3e3e3] rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
