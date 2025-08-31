'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { MarkedItem, ContentType } from '@/types';
import { getMarkedItems, getMarkedItemsByCategory } from '@/utils/storage';
import { loadData, getContentTitle, categories } from '@/utils/data';

export default function MarkedView() {
  const [markedItems, setMarkedItems] = useState<MarkedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemsWithContent, setItemsWithContent] = useState<Array<{
    markedItem: MarkedItem;
    content: ContentType;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMarkedItems = async () => {
      setIsLoading(true);
      const items = selectedCategory === 'all' 
        ? getMarkedItems() 
        : getMarkedItemsByCategory(selectedCategory);
      
      setMarkedItems(items);

      // Load content for each marked item
      const contentPromises = items.map(async (markedItem) => {
        try {
          const content = await loadData(markedItem.category, 1);
          const item = content.find(item => item.id === markedItem.id);
          return item ? { markedItem, content: item } : null;
        } catch (error) {
          console.error(`Error loading content for ${markedItem.category}:`, error);
          return null;
        }
      });

      const results = await Promise.all(contentPromises);
      setItemsWithContent(results.filter(Boolean) as Array<{
        markedItem: MarkedItem;
        content: ContentType;
      }>);
      
      setIsLoading(false);
    };

    loadMarkedItems();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            {/* Left Section */}
            <div className="flex justify-between sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Back to Home - Icon for mobile, text for desktop */}
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base flex items-center"
              >
                {/* Mobile Icon */}
                <Home className="sm:hidden w-5 h-5 mr-2" />
                {/* Desktop Text */}
                <span className="hidden sm:inline">← Back to Home</span>
              </Link>

              {/* Page Title */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-xl sm:text-2xl">📚</span>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Marked Items
                </h1>
              </div>
            </div>

            {/* Right Section - Empty for now but can add actions later */}
            <div className="w-full sm:w-auto"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-gray-400">
            Your saved items for quick access and review
          </p>
        </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
                     <button
             onClick={() => handleCategoryChange('all')}
             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
               selectedCategory === 'all'
                 ? 'bg-blue-600 text-white'
                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
             }`}
           >
             All Categories
           </button>
          {categories.map((category) => (
                         <button
               key={category.id}
               onClick={() => handleCategoryChange(category.id)}
               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                 selectedCategory === category.id
                   ? 'bg-blue-600 text-white'
                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
               }`}
             >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Marked Items */}
      {itemsWithContent.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No marked items yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start marking items as you learn to build your personal collection
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start Learning
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itemsWithContent.map(({ markedItem, content }) => (
            <div
              key={`${markedItem.category}-${markedItem.id}`}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {categories.find(c => c.id === markedItem.category)?.icon || '📄'}
                  </span>
                  <span className="text-sm font-medium text-blue-400 uppercase">
                    {categories.find(c => c.id === markedItem.category)?.name || markedItem.category}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(markedItem.timestamp)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                {getContentTitle(content)}
              </h3>

              {/* Content Preview */}
              <div className="mb-4">
                {('meaning' in content) && (
                  <p className="text-gray-300 text-sm">
                    {content.meaning}
                  </p>
                )}
                {('en' in content) && (
                  <div className="space-y-2">
                    <p className="text-white text-sm font-medium">
                      {content.en}
                    </p>
                    {('meaning' in content) && (
                      <p className="text-gray-400 text-sm">
                        {content.meaning}
                      </p>
                    )}
                  </div>
                )}
                {('content' in content) && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {content.content[0]}
                  </p>
                )}
                {('dialogue' in content) && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {content.dialogue[0]?.en}
                  </p>
                )}
              </div>

              <Link
                href={`/categories/${markedItem.category}`}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Continue Learning
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
      </main>
    </div>
  );
}
