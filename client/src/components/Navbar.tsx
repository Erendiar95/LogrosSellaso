import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { UserAvatar } from './UserAvatar.js';
import { NotificationsModal } from './NotificationsModal.js';
import {
  Trophy,
  Users,
  User as UserIcon,
  PlusCircle,
  Sun,
  Moon,
  Bell,
  LogOut,
  Home,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'feed' | 'friends' | 'profile';
  onNavigate: (tab: 'feed' | 'friends' | 'profile', targetUserId?: string) => void;
  onOpenNewAchievement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenNewAchievement,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      {/* Desktop & Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white flex items-center gap-1">
                Logros
                <span className="text-amber-500 text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 rounded">
                  Amigos
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'feed'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Home className="w-4 h-4" />
              Feed
            </button>

            <button
              onClick={() => onNavigate('friends')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'friends'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Amigos
            </button>

            <button
              onClick={() => onNavigate('profile', user?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'profile'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Mi Perfil
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Desktop Publish Button */}
            <button
              onClick={onOpenNewAchievement}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Publicar Logro
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-stone-600" />
              )}
            </button>

            {/* User Dropdown / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
              <div
                onClick={() => onNavigate('profile', user?.id)}
                className="cursor-pointer"
                title={user?.name}
              >
                <UserAvatar name={user?.name || ''} avatarColor={user?.avatarColor} size="sm" />
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Fixed Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onNavigate('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold ${
            currentTab === 'feed'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => onNavigate('friends')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold ${
            currentTab === 'friends'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Amigos</span>
        </button>

        {/* Center Floating Plus Button */}
        <button
          onClick={onOpenNewAchievement}
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 active:scale-95 transition-transform"
          title="Publicar logro"
        >
          <PlusCircle className="w-7 h-7" />
        </button>

        <button
          onClick={() => onNavigate('profile', user?.id)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold ${
            currentTab === 'profile'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>Perfil</span>
        </button>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
};
