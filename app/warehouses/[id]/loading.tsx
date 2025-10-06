export default function EditWarehouseLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-6">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
