import {
  User,
  Achievement,
  Comment,
  NotificationItem,
  FriendUser,
  SearchResultUser,
  UserProfileData,
  ReactionType,
} from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('logros_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
  }
  return data as T;
}

export const api = {
  // Autenticación
  auth: {
    register: async (payload: {
      email: string;
      password: string;
      name: string;
      avatarColor?: string;
      bio?: string;
    }): Promise<{ user: User; token: string }> => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    login: async (payload: {
      email: string;
      password: string;
    }): Promise<{ user: User; token: string }> => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    me: async (): Promise<{ user: User }> => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Logros y Feed
  achievements: {
    getFeed: async (category?: string): Promise<{ achievements: Achievement[] }> => {
      const url = new URL(`${API_BASE}/achievements/feed`);
      if (category && category !== 'ALL') {
        url.searchParams.set('category', category);
      }
      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    create: async (formData: FormData): Promise<{ achievement: Achievement }> => {
      const token = localStorage.getItem('logros_token');
      const res = await fetch(`${API_BASE}/achievements`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      return handleResponse(res);
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/achievements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    toggleReaction: async (
      achievementId: string,
      type: ReactionType
    ): Promise<{ action: 'ADDED' | 'REMOVED'; reactions: any[] }> => {
      const res = await fetch(`${API_BASE}/achievements/${achievementId}/reactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ type }),
      });
      return handleResponse(res);
    },

    addComment: async (
      achievementId: string,
      content: string
    ): Promise<{ comment: Comment }> => {
      const res = await fetch(`${API_BASE}/achievements/${achievementId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(res);
    },

    deleteComment: async (commentId: string): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/achievements/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Amigos
  friends: {
    getFriends: async (): Promise<{
      friends: FriendUser[];
      pendingReceived: any[];
      pendingSent: any[];
    }> => {
      const res = await fetch(`${API_BASE}/friends`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    searchUsers: async (q: string): Promise<{ users: SearchResultUser[] }> => {
      const res = await fetch(`${API_BASE}/friends/search?q=${encodeURIComponent(q)}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    sendRequest: async (addresseeId: string): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/friends/request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ addresseeId }),
      });
      return handleResponse(res);
    },

    respondRequest: async (
      requestId: string,
      action: 'ACCEPT' | 'REJECT'
    ): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/friends/respond/${requestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action }),
      });
      return handleResponse(res);
    },

    removeFriend: async (friendshipId: string): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Perfil
  profile: {
    getProfile: async (userId: string): Promise<UserProfileData> => {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Notificaciones
  notifications: {
    get: async (): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    markAllRead: async (): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    markRead: async (id: string): Promise<{ message: string }> => {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
