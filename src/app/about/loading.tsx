export default function AboutLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8 mx-auto"></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-48 h-48 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          
          <div className="w-full">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
            
            <div className="mt-6">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}