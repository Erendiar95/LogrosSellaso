export type CategoryType =
  | 'HEALTH'
  | 'STUDIES'
  | 'WORK'
  | 'PERSONAL'
  | 'CREATIVITY'
  | 'OTHER';

export type ReactionType = 'CELEBRATE' | 'CLAP' | 'STRONG' | 'HEART';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  bio?: string;
  createdAt?: string;
}

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
}

export interface Comment {
  id: string;
  achievementId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarColor: string;
  };
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: CategoryType;
  date: string;
  imageUrl?: string | null;
  visibility: 'FRIENDS' | 'PRIVATE';
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarColor: string;
  };
  reactions: Reaction[];
  comments: Comment[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string;
  achievementId?: string | null;
  type: 'REACTION' | 'COMMENT' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPTED';
  message: string;
  read: boolean;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    avatarColor: string;
  };
}

export interface FriendUser extends User {
  friendshipId: string;
  since: string;
}

export interface SearchResultUser extends User {
  friendshipStatus: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';
  friendshipId: string | null;
}

export interface UserProfileStats {
  totalAchievements: number;
  weeklyStreak: number;
  favoriteCategories: { category: CategoryType; count: number }[];
}

export interface UserProfileData {
  user: User;
  isOwnProfile: boolean;
  isFriend: boolean;
  stats: UserProfileStats;
  achievements: Achievement[];
}
