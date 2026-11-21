import React from 'react';
import { useNotifications } from '../context/NotificationContext.js';
import { UserAvatar } from './UserAvatar.js';
import { Check, Bell, X } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-stone-800 dark:text-stone-100">Notificaciones</h2>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                Marcar todas leídas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-2 divide-y divide-stone-100 dark:divide-stone-800/60">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-stone-500 dark:text-stone-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Aún no tienes notificaciones</p>
              <p className="text-xs mt-1 text-stone-400">
                Cuando tus amigos reaccionen o comenten, aparecerán aquí.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                  n.read
                    ? 'hover:bg-stone-50 dark:hover:bg-stone-800/40 opacity-80'
                    : 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                }`}
              >
                <UserAvatar
                  name={n.actor?.name || 'Amigo'}
                  avatarColor={n.actor?.avatarColor}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-800 dark:text-stone-200 leading-snug">
                    {n.message}
                  </p>
                  <span className="text-xs text-stone-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
