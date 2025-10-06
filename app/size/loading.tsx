export default function Loading() {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg border border-[#e3e3e3] overflow-hidden">
        <div className="bg-[#f7f7f7] border-b border-[#e3e3e3] p-4">
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse ml-auto"></div>
          </div>
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-[#e3e3e3] p-4">
            <div className="flex gap-4 items-center">
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="flex gap-2 ml-auto">
                <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
