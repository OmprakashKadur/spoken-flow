'use client';

import { useState, useEffect } from 'react';
import { checkPageExists } from '@/utils/data';

interface PaginatorProps {
  category: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Paginator({ category, currentPage, onPageChange, className = '' }: PaginatorProps) {
  const [maxPages, setMaxPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCache, setPageCache] = useState<Set<number>>(new Set());

  // Smart page discovery - only check what we need
  const discoverPages = async (targetPage: number) => {
    if (pageCache.has(targetPage)) return true;
    
    const exists = await checkPageExists(category, targetPage);
    if (exists) {
      setPageCache(prev => new Set([...prev, targetPage]));
    }
    return exists;
  };

  // Check current page and immediate neighbors only
  useEffect(() => {
    const checkCurrentRange = async () => {
      setIsLoading(true);
      
      // Check current page
      const currentExists = await discoverPages(currentPage);
      if (!currentExists) {
        // Current page doesn't exist, find the highest available page
        let highestPage = 1;
        for (let i = 1; i <= currentPage; i++) {
          if (await discoverPages(i)) {
            highestPage = i;
          } else {
            break;
          }
        }
        setMaxPages(highestPage);
        if (currentPage > highestPage) {
          onPageChange(highestPage);
        }
        setIsLoading(false);
        return;
      }

      // Check next 3 pages to determine max
      let maxFound = currentPage;
      for (let i = currentPage + 1; i <= currentPage + 3; i++) {
        if (await discoverPages(i)) {
          maxFound = i;
        } else {
          break;
        }
      }
      
      setMaxPages(maxFound);
      setIsLoading(false);
    };

    checkCurrentRange();
  }, [category, currentPage]);

  // Validate current page and redirect to max page if current page exceeds it
  useEffect(() => {
    if (maxPages > 0 && currentPage > maxPages) {
      onPageChange(maxPages);
    }
  }, [maxPages, currentPage, onPageChange]);

  const getFileExtension = (category: string): string => {
    switch (category) {
      case 'words':
        return 'words';
      case 'sentences':
        return 'sentences';
      case 'phrases':
        return 'phrases';
      case 'public-speaking':
        return 'speech';
      case 'interviews':
      case 'office':
        return 'conversation';
      default:
        return 'json';
    }
  };

  // Generate page numbers to show (current ± 3 pages)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const start = Math.max(1, currentPage - 3);
    const end = Math.min(maxPages, currentPage + 3);

    // Add first page if not in range
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page if not in range
    if (end < maxPages) {
      if (end < maxPages - 1) pages.push('...');
      pages.push(maxPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center py-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (maxPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center space-x-2 py-6 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {page}
              </button>
            ) : (
              <span className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                {page}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= maxPages}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      >
        Next
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
