import React, { useState, useEffect, useCallback } from 'react';
import { UserProfileData } from '../types/index.js';
import { api } from '../services/api.js';
import { UserAvatar } from '../components/UserAvatar.js';
import { AchievementCard } from '../components/AchievementCard.js';
import { CATEGORY_CONFIG } from '../components/CategoryBadge.js';
import {
  Trophy,
  Flame,
  PieChart,
  Calendar,
  Lock,
  Loader2,
  Mail,
  UserCheck,
} from 'lucide-react';

interface ProfilePageProps {
  userId: string;
  onNavigateToUser?: (userId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  onNavigateToUser,
}) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.profile.getProfile(userId);
      setProfile(data);
    } catch (err: any) {
      console.error('Error al cargar perfil:', err);
      setError(err.message || 'No se pudo cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-sm font-medium">Cargando perfil y estadísticas...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 max-w-md mx-auto my-12">
        <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
          {error || 'Usuario no encontrado'}
        </p>
      </div>
    );
  }

  const { user, isOwnProfile, isFriend, stats, achievements } = profile;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-12">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm relative overflow-hidden">
        {/* Background Decorative Accent */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ backgroundColor: user.avatarColor }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative z-10">
          <UserAvatar
            name={user.name}
            avatarColor={user.avatarColor}
            size="xl"
            className="ring-4 ring-white dark:ring-stone-800 shadow-md"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
                {user.name}
              </h2>
              {isOwnProfile ? (
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Tú
                </span>
              ) : isFriend ? (
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Amigo
                </span>
              ) : null}
            </div>

            <p className="text-xs text-stone-400 flex items-center justify-center sm:justify-start gap-1 mb-3">
              <Mail className="w-3 h-3" />
              {user.email}
            </p>

            {user.bio ? (
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-lg">
                {user.bio}
              </p>
            ) : (
              <p className="text-xs text-stone-400 italic">Sin biografía disponible</p>
            )}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
          {/* Total Logros */}
          <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl p-3.5 border border-amber-200/50 dark:border-amber-900/40 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Logros</span>
            </div>
            <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
              {stats.totalAchievements}
            </div>
          </div>

          {/* Racha Semanal */}
          <div className="bg-orange-50/60 dark:bg-orange-950/20 rounded-2xl p-3.5 border border-orange-200/50 dark:border-orange-900/40 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Racha Semanal</span>
            </div>
            <div className="text-2xl font-black text-orange-900 dark:text-orange-200 flex items-center justify-center sm:justify-start gap-1">
              <span>{stats.weeklyStreak}</span>
              <span className="text-xs font-medium text-orange-600/80">
                {stats.weeklyStreak === 1 ? 'semana' : 'semanas'}
              </span>
            </div>
          </div>

          {/* Categoría Top */}
          <div className="col-span-2 sm:col-span-1 bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3.5 border border-stone-200/60 dark:border-stone-700/50 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">
              <PieChart className="w-4 h-4" />
              <span>Categoría Top</span>
            </div>
            <div className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">
              {stats.favoriteCategories.length > 0
                ? CATEGORY_CONFIG[stats.favoriteCategories[0].category]?.label || 'General'
                : 'Ninguna'}
            </div>
          </div>
        </div>
      </div>

      {/* Categorías Favoritas (Distribución) */}
      {stats.favoriteCategories.length > 0 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            Distribución de Logros por Categoría
          </h3>
          <div className="space-y-3">
            {stats.favoriteCategories.map((item) => {
              const conf = CATEGORY_CONFIG[item.category];
              const percentage = Math.round((item.count / (stats.totalAchievements || 1)) * 100);
              const Icon = conf?.icon || Trophy;

              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                      <Icon className="w-3.5 h-3.5" />
                      {conf?.label || item.category}
                    </span>
                    <span className="text-stone-400">
                      {item.count} {item.count === 1 ? 'logro' : 'logros'} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logros del Usuario */}
      <div>
        <div className="flex items-center justify-between px-2 mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Logros de {user.name.split(' ')[0]} ({achievements.length})
          </h3>
          {isOwnProfile && (
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Tus logros privados solo los ves tú
            </span>
          )}
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 text-center border border-stone-200 dark:border-stone-800">
            <Trophy className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
              {isOwnProfile
                ? 'Aún no has compartido ningún logro.'
                : `${user.name} aún no tiene logros visibles.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                onDeleted={() => loadProfile()}
                onNavigateToUser={onNavigateToUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
