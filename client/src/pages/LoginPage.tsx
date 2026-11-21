import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Trophy, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onGoToRegister: () => void;
}

const DEMO_USERS = [
  { name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Maratonista / Tech' },
  { name: 'Sofía Martínez', email: 'sofia@ejemplo.com', role: 'Arquitecta / Pintura' },
  { name: 'Carlos Gómez', email: 'carlos@ejemplo.com', role: 'Fitness / Música' },
  { name: 'Lucía Morales', email: 'lucia@ejemplo.com', role: 'Ciencia / Senderismo' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-white">
            Logros
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Comparte y celebra tus victorias con las personas que te importan
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-amber-900/5">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Iniciando...' : 'Iniciar sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Acceso rápido con usuarios de prueba:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleDemoLogin(demo.email)}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-400 transition-all text-left"
                >
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                    {demo.name}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate">{demo.role}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Link to Register */}
          <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            ¿Aún no tienes cuenta?{' '}
            <button
              onClick={onGoToRegister}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Regístrate gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
