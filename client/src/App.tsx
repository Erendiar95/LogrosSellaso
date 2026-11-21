import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { FeedPage } from './pages/FeedPage.js';
import { FriendsPage } from './pages/FriendsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { NewAchievementModal } from './components/NewAchievementModal.js';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<'feed' | 'friends' | 'profile'>('feed');
  const [targetProfileUserId, setTargetProfileUserId] = useState<string | null>(null);
  const [isNewAchievementOpen, setIsNewAchievementOpen] = useState(false);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/40 dark:bg-stone-950">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold tracking-wide">Iniciando Logros...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login o registro
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onGoToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onGoToLogin={() => setAuthView('login')} />
    );
  }

  const handleNavigate = (tab: 'feed' | 'friends' | 'profile', targetUserId?: string) => {
    setCurrentTab(tab);
    if (tab === 'profile') {
      setTargetProfileUserId(targetUserId || user!.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToUser = (userId: string) => {
    setTargetProfileUserId(userId);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAchievementCreated = () => {
    // Forzar recarga del feed y cambiar a la pestaña de feed
    setFeedRefreshKey((prev) => prev + 1);
    setCurrentTab('feed');
  };

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar & Mobile Bottom Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenNewAchievement={() => setIsNewAchievementOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {currentTab === 'feed' && (
          <FeedPage
            key={feedRefreshKey}
            onOpenNewAchievement={() => setIsNewAchievementOpen(true)}
            onNavigateToUser={handleNavigateToUser}
          />
        )}

        {currentTab === 'friends' && (
          <FriendsPage onNavigateToUser={handleNavigateToUser} />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            userId={targetProfileUserId || user!.id}
            onNavigateToUser={handleNavigateToUser}
          />
        )}
      </main>

      {/* Modal para publicar nuevo logro */}
      <NewAchievementModal
        isOpen={isNewAchievementOpen}
        onClose={() => setIsNewAchievementOpen(false)}
        onCreated={handleAchievementCreated}
      />
    </div>
  );
};
