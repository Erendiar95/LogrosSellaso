import React, { useState, useEffect, useCallback } from 'react';
import { FriendUser, SearchResultUser } from '../types/index.js';
import { api } from '../services/api.js';
import { UserAvatar } from '../components/UserAvatar.js';
import {
  Users,
  UserPlus,
  Search,
  Check,
  X,
  UserCheck,
  Clock,
  Loader2,
  Trash2,
} from 'lucide-react';

interface FriendsPageProps {
  onNavigateToUser: (userId: string) => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({ onNavigateToUser }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'search'>('friends');
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [pendingReceived, setPendingReceived] = useState<any[]>([]);
  const [pendingSent, setPendingSent] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const loadFriendsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.friends.getFriends();
      setFriends(data.friends);
      setPendingReceived(data.pendingReceived);
      setPendingSent(data.pendingSent);
    } catch (err) {
      console.error('Error al cargar datos de amigos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  // Búsqueda de usuarios
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearching(true);
    try {
      const data = await api.friends.searchUsers(searchQuery.trim());
      setSearchResults(data.users);
    } catch (err) {
      console.error('Error en búsqueda de usuarios:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Enviar solicitud de amistad
  const handleSendRequest = async (userId: string) => {
    try {
      await api.friends.sendRequest(userId);
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, friendshipStatus: 'PENDING_SENT' } : u))
      );
      loadFriendsData();
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
    }
  };

  // Responder solicitud (aceptar / rechazar)
  const handleRespond = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      await api.friends.respondRequest(requestId, action);
      loadFriendsData();
    } catch (err) {
      console.error('Error al responder solicitud:', err);
    }
  };

  // Eliminar amistad
  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm('¿Seguro que deseas eliminar a esta persona de tus amigos?')) return;
    try {
      await api.friends.removeFriend(friendshipId);
      setFriends((prev) => prev.filter((f) => f.friendshipId !== friendshipId));
    } catch (err) {
      console.error('Error al eliminar amigo:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-12">
      {/* Header Tabs */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-2 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between gap-1">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'friends'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mis Amigos ({friends.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all relative ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Solicitudes</span>
          {pendingReceived.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'pending'
                  ? 'bg-white text-amber-600'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {pendingReceived.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'search'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Buscar</span>
        </button>
      </div>

      {/* Tab: Mis Amigos */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-16 text-center text-stone-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span className="text-sm">Cargando amigos...</span>
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
              <Users className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base">
                Aún no tienes amigos agregados
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto mb-4">
                Busca a tus compañeros, envía solicitudes y empieza a celebrar juntos cada logro.
              </p>
              <button
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Buscar amigos ahora
              </button>
            </div>
          ) : (
            friends.map((f) => (
              <div
                key={f.id}
                className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3 shadow-sm hover:shadow transition-shadow"
              >
                <div
                  onClick={() => onNavigateToUser(f.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <UserAvatar name={f.name} avatarColor={f.avatarColor} size="md" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate hover:text-amber-600 dark:hover:text-amber-400">
                      {f.name}
                    </h4>
                    <p className="text-xs text-stone-400 truncate">{f.email}</p>
                    {f.bio && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {f.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onNavigateToUser(f.id)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors"
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={() => handleRemoveFriend(f.friendshipId)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar amigo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Solicitudes pendientes */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {/* Recibidas */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 px-1">
              Solicitudes recibidas ({pendingReceived.length})
            </h3>
            {pendingReceived.length === 0 ? (
              <p className="text-xs text-stone-400 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 text-center">
                No tienes solicitudes de amistad pendientes por responder.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingReceived.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-amber-200/60 dark:border-amber-900/40 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        name={req.requester.name}
                        avatarColor={req.requester.avatarColor}
                        size="md"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {req.requester.name}
                        </h4>
                        <p className="text-xs text-stone-400 truncate">
                          {req.requester.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRespond(req.id, 'ACCEPT')}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Aceptar</span>
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, 'REJECT')}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-400 text-xs font-bold flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Rechazar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enviadas */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 px-1">
              Solicitudes enviadas ({pendingSent.length})
            </h3>
            {pendingSent.length === 0 ? (
              <p className="text-xs text-stone-400 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 text-center">
                No tienes solicitudes enviadas pendientes de aceptación.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingSent.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        name={req.addressee.name}
                        avatarColor={req.addressee.avatarColor}
                        size="md"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {req.addressee.name}
                        </h4>
                        <p className="text-xs text-stone-400 truncate">
                          {req.addressee.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Pendiente
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Buscar personas */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o correo (ej. Juan, sofia@...)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || searchQuery.trim().length < 2}
              className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
            </button>
          </form>

          {/* Resultados de búsqueda */}
          <div className="space-y-2.5">
            {searchResults.length === 0 && searchQuery.trim().length >= 2 && !isSearching && (
              <p className="text-center text-xs text-stone-400 py-8">
                No se encontraron usuarios que coincidan con tu búsqueda.
              </p>
            )}

            {searchResults.map((u) => (
              <div
                key={u.id}
                className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3 shadow-sm"
              >
                <div
                  onClick={() => onNavigateToUser(u.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <UserAvatar name={u.name} avatarColor={u.avatarColor} size="md" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate hover:text-amber-600">
                      {u.name}
                    </h4>
                    <p className="text-xs text-stone-400 truncate">{u.email}</p>
                    {u.bio && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {u.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {u.friendshipStatus === 'ACCEPTED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      <UserCheck className="w-3.5 h-3.5" />
                      Amigos
                    </span>
                  ) : u.friendshipStatus === 'PENDING_SENT' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Enviada
                    </span>
                  ) : u.friendshipStatus === 'PENDING_RECEIVED' ? (
                    <button
                      onClick={() => handleRespond(u.friendshipId!, 'ACCEPT')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Aceptar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(u.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-amber-500/20 transform active:scale-95 transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Añadir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
