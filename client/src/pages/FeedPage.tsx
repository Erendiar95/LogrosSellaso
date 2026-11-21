import React, { useState, useEffect, useCallback } from 'react';
import { Achievement } from '../types/index.js';
import { api } from '../services/api.js';
import { AchievementCard } from '../components/AchievementCard.js';
import { CategoryFilter } from '../components/CategoryFilter.js';
import { EmptyState } from '../components/EmptyState.js';
import { Loader2, Plus, Sparkles } from 'lucide-react';

interface FeedPageProps {
  onOpenNewAchievement: () => void;
  onNavigateToUser: (userId: string) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  onOpenNewAchievement,
  onNavigateToUser,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.achievements.getFeed(selectedCategory);
      setAchievements(data.achievements);
    } catch (err: any) {
      console.error('Error al cargar feed:', err);
      setError('No pudimos cargar los logros. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleAchievementDeleted = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-2xl mx-auto">
      {/* Welcome Banner / Motivational card */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 dark:from-amber-950/40 dark:to-stone-900 border border-amber-200/60 dark:border-amber-900/50 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Muro de Inspiración</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white">
            Celebremos juntos cada victoria
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-md">
            Los maratones, los exámenes, los nuevos hábitos o ese pequeño detalle que te hizo feliz.
          </p>
        </div>

        <button
          onClick={onOpenNewAchievement}
          className="flex-shrink-0 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/30 flex items-center gap-2 transform active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Compartir logro</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Feed Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Cargando logros de tus amigos...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/30 rounded-3xl border border-rose-200 dark:border-rose-900 text-center">
          <p className="text-sm text-rose-700 dark:text-rose-300 mb-3">{error}</p>
          <button
            onClick={loadFeed}
            className="text-xs font-bold text-rose-600 underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      ) : achievements.length === 0 ? (
        <EmptyState
          title={
            selectedCategory === 'ALL'
              ? 'Aún no hay logros en tu feed'
              : 'No hay logros en esta categoría'
          }
          description={
            selectedCategory === 'ALL'
              ? 'Añade a más amigos o sé el primero en compartir un logro para romper el hielo.'
              : 'Sé el primero en compartir un logro en esta categoría.'
          }
          actionText="Publicar mi primer logro"
          onAction={onOpenNewAchievement}
        />
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onDeleted={handleAchievementDeleted}
              onNavigateToUser={onNavigateToUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};
