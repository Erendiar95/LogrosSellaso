import React, { useState } from 'react';
import { Achievement, ReactionType } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { CategoryBadge } from './CategoryBadge.js';
import { UserAvatar } from './UserAvatar.js';
import { triggerSmallCelebration } from '../utils/confetti.js';
import {
  MessageCircle,
  Lock,
  Users,
  Trash2,
  Send,
  MoreVertical,
  Calendar,
} from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  onDeleted?: (id: string) => void;
  onNavigateToUser?: (userId: string) => void;
}

const REACTION_EMOJIS: Record<ReactionType, { emoji: string; label: string }> = {
  CELEBRATE: { emoji: '🎉', label: 'Celebrar' },
  CLAP: { emoji: '👏', label: 'Aplaudir' },
  STRONG: { emoji: '💪', label: 'Fuerza' },
  HEART: { emoji: '❤️', label: 'Me encanta' },
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onDeleted,
  onNavigateToUser,
}) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState(achievement.reactions || []);
  const [comments, setComments] = useState(achievement.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === achievement.userId;

  // Manejar reacción
  const handleReaction = async (
    e: React.MouseEvent<HTMLButtonElement>,
    type: ReactionType
  ) => {
    // Microcelebración con confeti
    const rect = e.currentTarget.getBoundingClientRect();
    triggerSmallCelebration(rect.left + rect.width / 2, rect.top);

    // Actualización optimista
    const alreadyReacted = reactions.some(
      (r) => r.userId === user?.id && r.type === type
    );

    const updated = alreadyReacted
      ? reactions.filter((r) => !(r.userId === user?.id && r.type === type))
      : [
          ...reactions,
          {
            id: 'temp-' + Date.now(),
            type,
            userId: user!.id,
          },
        ];

    setReactions(updated);

    try {
      const result = await api.achievements.toggleReaction(achievement.id, type);
      setReactions(result.reactions);
    } catch (err) {
      console.error('Error al reaccionar:', err);
      // Revertir
      setReactions(reactions);
    }
  };

  // Enviar comentario
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const { comment } = await api.achievements.addComment(
        achievement.id,
        commentText.trim()
      );
      setComments((prev) => [...prev, comment]);
      setCommentText('');
      setShowComments(true);
    } catch (err) {
      console.error('Error al comentar:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Borrar comentario
  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.achievements.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
    }
  };

  // Borrar logro
  const handleDeleteAchievement = async () => {
    if (!confirm('¿Seguro que deseas eliminar este logro? Esta acción no se puede deshacer.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await api.achievements.delete(achievement.id);
      if (onDeleted) onDeleted(achievement.id);
    } catch (err) {
      console.error('Error al eliminar logro:', err);
      setIsDeleting(false);
    }
  };

  // Formato de fecha
  const formattedDate = new Date(achievement.date || achievement.createdAt).toLocaleDateString(
    'es-ES',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const backendHost = 'http://localhost:4000';
    return `${backendHost}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const imageUrl = resolveImageUrl(achievement.imageUrl);

  return (
    <article className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-200/80 dark:border-stone-800 relative group">
      {/* Header: User, Date, Category & Privacy */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigateToUser && onNavigateToUser(achievement.userId)}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          >
            <UserAvatar
              name={achievement.user?.name || 'Usuario'}
              avatarColor={achievement.user?.avatarColor}
              size="md"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => onNavigateToUser && onNavigateToUser(achievement.userId)}
                className="font-bold text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
              >
                {achievement.user?.name}
              </span>
              <CategoryBadge category={achievement.category} />
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                {achievement.visibility === 'PRIVATE' ? (
                  <>
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span>Solo yo</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 text-amber-500" />
                    <span>Amigos</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Menu (Delete if owner) */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-100 dark:border-stone-700 py-1 z-20">
                <button
                  onClick={handleDeleteAchievement}
                  disabled={isDeleting}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar logro
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body: Title and Description */}
      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-50 leading-snug mb-2">
        {achievement.title}
      </h3>
      <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4">
        {achievement.description}
      </p>

      {/* Optional Image */}
      {imageUrl && (
        <div className="mb-4 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 max-h-96 border border-stone-200/50 dark:border-stone-800/80">
          <img
            src={imageUrl}
            alt={achievement.title}
            className="w-full h-auto max-h-96 object-cover hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Footer: Reactions Bar & Comments Trigger */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Reaction Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => {
            const count = reactions.filter((r) => r.type === type).length;
            const hasReacted = reactions.some(
              (r) => r.userId === user?.id && r.type === type
            );

            return (
              <button
                key={type}
                onClick={(e) => handleReaction(e, type)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all transform active:scale-90 select-none ${
                  hasReacted
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-500 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-transparent'
                }`}
                title={REACTION_EMOJIS[type].label}
              >
                <span className="text-base">{REACTION_EMOJIS[type].emoji}</span>
                {count > 0 && <span className="font-bold text-xs">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Comments Count / Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            showComments
              ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white'
              : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>
            {comments.length === 0
              ? 'Comentar'
              : `${comments.length} ${comments.length === 1 ? 'comentario' : 'comentarios'}`}
          </span>
        </button>
      </div>

      {/* Comments Section (Accordion) */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 animate-in fade-in">
          {/* New comment input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 mb-4">
            <UserAvatar name={user?.name || ''} avatarColor={user?.avatarColor} size="sm" />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="¡Deja un mensaje de ánimo o felicitación!..."
              className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full px-4 py-2 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmittingComment}
              className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Comments list */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-2">
                Sé el primero en celebrar y dejar un comentario.
              </p>
            ) : (
              comments.map((c) => {
                const canDelete = user?.id === c.userId || user?.id === achievement.userId;
                return (
                  <div key={c.id} className="flex items-start gap-2.5 group/comment">
                    <UserAvatar
                      name={c.user?.name || 'Usuario'}
                      avatarColor={c.user?.avatarColor}
                      size="sm"
                    />
                    <div className="flex-1 bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-3 border border-stone-100 dark:border-stone-800 text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {c.user?.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-400">
                            {new Date(c.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="text-stone-400 hover:text-rose-500 transition-colors opacity-0 group-hover/comment:opacity-100"
                              title="Eliminar comentario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </article>
  );
};
