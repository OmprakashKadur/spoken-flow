import Link from 'next/link';
import { HomeIcon, BookOpen } from 'lucide-react';
import { categories } from '@/utils/data';
import CategoryCard from '@/components/CategoryCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between py-4 sm:py-6">
      
      {/* Left Section: Logo + Title */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="text-2xl sm:text-3xl">🎓</div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Spoken Flow
        </h1>
      </div>

      {/* Right Section: Marked Items */}
      <nav className="flex items-center">
        <Link
          href="/marked"
          className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base flex items-center"
        >
          {/* Mobile Icon */}
          <BookOpen className="sm:hidden w-5 h-5 mr-2" />
          {/* Desktop Text */}
          <span className="hidden sm:inline">📚 Marked Items</span>
        </Link>
      </nav>

    </div>
  </div>
</header>


      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Master English with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Confidence
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practice essential vocabulary, sentences, and conversations. Perfect your public speaking 
            and interview skills with our comprehensive English learning platform.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Spoken Flow?
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Structured Learning
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Organized content from basic words to advanced conversations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💾</div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Progress Tracking
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Save your progress and mark items for later review
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Practice Recording
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Record and review your pronunciation and speech
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Spoken Flow. Built with Next.js and TailwindCSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
