'use client';

import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.path}>
      <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{category.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {category.name}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {category.description}
            </p>
          </div>
          <div className="text-gray-400 transition-transform group-hover:translate-x-1">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
