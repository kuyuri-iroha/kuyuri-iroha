export default function ProjectLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
      <div className="mb-6">
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="h-64 w-full bg-gray-300 dark:bg-gray-600"></div>

        <div className="p-6 md:p-8">
          <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          
          <div className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>

          <div className="mb-6">
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}