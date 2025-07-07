// src/components/SkeletonLoader.tsx
export default function SkeletonLoader() {
  return (
    <div className="space-y-12">
      <div>
        <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 bg-neutral-100 dark:bg-neutral-700 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 bg-neutral-100 dark:bg-neutral-700 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}