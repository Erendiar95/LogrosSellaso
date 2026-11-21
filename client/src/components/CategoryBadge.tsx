import React from 'react';
import { CategoryType } from '../types/index.js';
import {
  Heart,
  GraduationCap,
  Briefcase,
  Smile,
  Palette,
  Sparkles,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'sm' | 'md';
}

export const CATEGORY_CONFIG: Record<
  CategoryType,
  { label: string; icon: React.ElementType; color: string; bgLight: string; bgDark: string }
> = {
  HEALTH: {
    label: 'Salud y Fitness',
    icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-50 border-rose-200 text-rose-700',
    bgDark: 'dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300',
  },
  STUDIES: {
    label: 'Estudios',
    icon: GraduationCap,
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 border-blue-200 text-blue-700',
    bgDark: 'dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300',
  },
  WORK: {
    label: 'Trabajo y Carrera',
    icon: Briefcase,
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50 border-amber-200 text-amber-700',
    bgDark: 'dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
  },
  PERSONAL: {
    label: 'Crecimiento Personal',
    icon: Smile,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    bgDark: 'dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
  },
  CREATIVITY: {
    label: 'Creatividad y Arte',
    icon: Palette,
    color: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-50 border-purple-200 text-purple-700',
    bgDark: 'dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300',
  },
  OTHER: {
    label: 'Otros Logros',
    icon: Sparkles,
    color: 'text-stone-600 dark:text-stone-400',
    bgLight: 'bg-stone-50 border-stone-200 text-stone-700',
    bgDark: 'dark:bg-stone-800/40 dark:border-stone-700 dark:text-stone-300',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
  const Icon = config.icon;

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${
        config.bgLight
      } ${config.bgDark} ${
        isSmall ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3.5 py-1'
      }`}
    >
      <Icon className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
};
