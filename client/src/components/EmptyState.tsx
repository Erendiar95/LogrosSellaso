import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Aún no hay logros aquí',
  description = 'Comparte una pequeña o gran victoria con tus amigos. ¡Cada paso cuenta!',
  actionText = 'Compartir el primero',
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-6 bg-white/60 dark:bg-stone-900/40 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-4 shadow-inner">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
