// src/components/Footer.tsx

// Re-using the same icon from the header for consistency.
const ChessIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7 text-blue-600"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93V15h2v2.93c-0.64.05-1.31.07-2 .07s-1.36-0.02-2-0.07zM12 13c-0.83 0-1.5-0.67-1.5-1.5S11.17 10 12 10s1.5 0.67 1.5 1.5S12.83 13 12 13zm-3-1h1.5c.55 0 1-0.45 1-1s-0.45-1-1-1H9v2zm8 0h-1.5c-0.55 0-1-0.45-1-1s0.45-1 1-1H17v2zm-5-3.07V8h2v1.93c0.64-0.05 1.31-0.07 2-0.07s1.36 0.02 2 0.07V15h-2v-2.07c-0.64 0.05-1.31 0.07-2 0.07s-1.36-0.02-2-0.07V15H8V9.93c0.64-0.05 1.31-0.07 2-0.07s1.36 0.02 2 0.07z" />
    </svg>
  );

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ChessIcon />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              ChessWatch
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
              About
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
              Features
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} ChessWatch. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}