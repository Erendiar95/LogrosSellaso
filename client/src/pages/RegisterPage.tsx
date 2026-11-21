import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Trophy, Mail, Lock, User, ArrowRight, AlertCircle, Check } from 'lucide-react';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

const PRESET_COLORS = [
  '#f59e0b', // Ámbar
  '#10b981', // Esmeralda
  '#3b82f6', // Azul
  '#ec4899', // Rosa
  '#8b5cf6', // Púrpura
  '#ef4444', // Rojo
  '#06b6d4', // Cian
  '#84cc16', // Lima
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarColor, setAvatarColor] = useState(PRESET_COLORS[0]);
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        avatarColor,
        bio: bio.trim() || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
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
            Únete a Logros
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Crea tu perfil y comienza a compartir tus metas alcanzadas
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-amber-900/5">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Preview & Color Selection */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl text-white shadow-md transition-transform"
                style={{ backgroundColor: avatarColor }}
              >
                {getInitials(name)}
              </div>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Elige el color de tu avatar:
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {avatarColor === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Laura Gómez"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Contraseña (mínimo 6 caracteres)
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

            {/* Bio (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Breve descripción / biografía (opcional)
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Amante de la naturaleza, aprendiendo a programar..."
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 pt-2"
            >
              <span>{isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onGoToLogin}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Inicia sesión aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
