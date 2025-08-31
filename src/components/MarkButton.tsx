'use client';

import { useState, useEffect } from 'react';
import { isItemMarked, toggleMarkedItem } from '@/utils/storage';

interface MarkButtonProps {
  category: string;
  id: number;
  className?: string;
}

export default function MarkButton({ category, id, className = '' }: MarkButtonProps) {
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
    setIsMarked(isItemMarked(category, id));
  }, [category, id]);

  const handleToggle = () => {
    const newMarkedState = toggleMarkedItem(category, id);
    setIsMarked(newMarkedState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        isMarked
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
      } ${className}`}
      title={isMarked ? 'Remove from marked' : 'Mark for later'}
    >
      {isMarked ? (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Marked</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Mark</span>
        </>
      )}
    </button>
  );
}
