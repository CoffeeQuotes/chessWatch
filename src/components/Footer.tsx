// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="px-4 py-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-900 border-t border-blue-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">♔</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
              ChessWatch
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors">
              Contact
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors">
              Privacy
            </a>
          </div>
          
          <div className="text-sm text-center text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} ChessWatch. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}