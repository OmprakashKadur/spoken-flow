'use client';

import { useState, useEffect, useRef } from 'react';

interface SentenceScrollerProps {
  content: string[];
  autoScroll?: boolean;
  speed?: number;
  fontSize?: number;
  className?: string;
}

export default function SentenceScroller({
  content,
  autoScroll = false,
  speed = 0.5,
  fontSize = 16,
  className = ''
}: SentenceScrollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoScrolling) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % content.length);
      }, 3000 / speed); // 3 seconds base time divided by speed
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoScrolling, speed, content.length]);

  useEffect(() => {
    if (containerRef.current && currentIndex < content.length) {
      const currentElement = containerRef.current.children[currentIndex] as HTMLElement;
      if (currentElement) {
        currentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentIndex, content.length]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % content.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + content.length) % content.length);
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleAutoScroll}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isAutoScrolling
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isAutoScrolling ? '⏹ Stop' : '▶ Play'}
          </button>
          
          <button
            onClick={goToPrevious}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            ⏮ Previous
          </button>
          
          <button
            onClick={goToNext}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
            ⏭ Next
          </button>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} of {content.length}
        </div>
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className="relative h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        style={{ fontSize: `${fontSize}px` }}
      >
        {content.map((line, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-50 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <p className="leading-relaxed text-gray-800 dark:text-gray-200">
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / content.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
