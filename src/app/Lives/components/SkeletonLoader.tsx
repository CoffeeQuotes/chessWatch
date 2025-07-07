// src/app/Lives/components/SkeletonLoader.tsx

const SkeletonCard = () => (
  <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-200 dark:bg-slate-800"></div>
    <div className="p-4 space-y-3">
      <div className="h-2.5 w-1/4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800"></div>
      <div className="flex items-center gap-2 pt-3">
        <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      </div>
      <div className="flex justify-end pt-4">
        <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  </div>
);

export default function SkeletonLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Skeleton for a Carousel Section */}
        <div>
          <div className="h-8 w-1/3 mb-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
        {/* Skeleton for another Carousel Section */}
        <div>
          <div className="h-8 w-1/2 mb-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}