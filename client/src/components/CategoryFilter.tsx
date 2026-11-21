import React from 'react';
import { CategoryType } from '../types/index.js';
import { CATEGORY_CONFIG } from './CategoryBadge.js';
import { Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: { key: string; label: string; icon: React.ElementType }[] = [
    { key: 'ALL', label: 'Todos los logros', icon: Sparkles },
    ...(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((cat) => ({
      key: cat,
      label: CATEGORY_CONFIG[cat].label,
      icon: CATEGORY_CONFIG[cat].icon,
    })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.key;

        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 select-none ${
              isSelected
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
