'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ContentType, Word, Sentence, Phrase, Speech, Conversation } from '@/types';
import { loadData, isLongContent, categories } from '@/utils/data';
import { getLastVisitedPage, updateLastVisitedPage } from '@/utils/storage';
import Paginator from '@/components/Paginator';
import MarkButton from '@/components/MarkButton';
import SentenceScroller from '@/components/SentenceScroller';
import Recorder from '@/components/Recorder';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [scrollSpeed, setScrollSpeed] = useState(1);

  const categoryInfo = categories.find(c => c.id === category);

  useEffect(() => {
    if (categoryInfo) {
      const lastPage = getLastVisitedPage(category);
      setCurrentPage(lastPage);
      loadCategoryData(lastPage);
    }
  }, [category]);

  useEffect(() => {
    if (categoryInfo) {
      loadCategoryData(currentPage);
      updateLastVisitedPage(category, currentPage);
    }
  }, [currentPage, category]);

  const loadCategoryData = async (page: number) => {
    setIsLoading(true);
    try {
      const categoryData = await loadData(category, page);
      setData(categoryData);
    } catch (error) {
      console.error('Error loading category data:', error);
      setData([]);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Category not found
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const isLong = isLongContent(category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categoryInfo.name}
                </h1>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/marked"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                📚 Marked Items
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMarkedOnly(!showMarkedOnly)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showMarkedOnly
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showMarkedOnly ? '✅ Show All' : '📌 Show Marked Only'}
            </button>
          </div>

          {isLong && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Size:
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {fontSize}px
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Speed:
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {scrollSpeed}x
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {isLong ? (
              // Long content layout (speeches, conversations)
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {data.map((item) => {
                    if ('content' in item) {
                      const speech = item as Speech;
                      return (
                        <div key={speech.id} className="mb-8">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {speech.title}
                          </h2>
                          <SentenceScroller
                            content={speech.content}
                            speed={scrollSpeed}
                            fontSize={fontSize}
                          />
                        </div>
                      );
                    } else if ('dialogue' in item) {
                      const conversation = item as Conversation;
                      return (
                        <div key={conversation.id} className="mb-8">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {conversation.title}
                          </h2>
                          <div className="space-y-4">
                            {conversation.dialogue.map((line, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                              >
                                <div className="flex items-start space-x-3">
                                  <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[60px]">
                                    {line.speaker}:
                                  </span>
                                  <p className="text-gray-900 dark:text-white leading-relaxed">
                                    {line.en}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="lg:col-span-1">
                  <Recorder />
                </div>
              </div>
            ) : (
              // Short content layout (words, sentences, phrases)
              <div className="space-y-6">
                {data.map((item) => {
                  if ('word' in item) {
                    const word = item as Word;
                    return (
                      <div
                        key={word.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {word.word}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {word.meaning}
                            </p>
                          </div>
                          <MarkButton category={category} id={word.id} />
                        </div>
                      </div>
                    );
                  } else if ('en' in item && 'kn' in item) {
                    const sentence = item as Sentence;
                    return (
                      <div
                        key={sentence.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-lg text-gray-900 dark:text-white mb-2">
                              {sentence.en}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {sentence.kn}
                            </p>
                          </div>
                          <MarkButton category={category} id={sentence.id} />
                        </div>
                      </div>
                    );
                  } else if ('phrase' in item) {
                    const phrase = item as Phrase;
                    return (
                      <div
                        key={phrase.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {phrase.phrase}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {phrase.meaning}
                            </p>
                          </div>
                          <MarkButton category={category} id={phrase.id} />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Pagination */}
            <Paginator
              category={category}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        )}
      </main>
    </div>
  );
}
