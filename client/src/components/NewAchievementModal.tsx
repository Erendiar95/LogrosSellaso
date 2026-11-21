import React, { useState } from 'react';
import { CategoryType } from '../types/index.js';
import { api } from '../services/api.js';
import { triggerConfetti } from '../utils/confetti.js';
import { CATEGORY_CONFIG } from './CategoryBadge.js';
import {
  X,
  Upload,
  Sparkles,
  Lock,
  Users,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface NewAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const NewAchievementModal: React.FC<NewAchievementModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('HEALTH');
  const [visibility, setVisibility] = useState<'FRIENDS' | 'PRIVATE'>('FRIENDS');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setImageUrl(''); // Limpiar URL si se sube archivo
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (title.trim().length < 3) {
      setErrorMessage('El título debe tener al menos 3 caracteres');
      return;
    }

    if (description.trim().length < 5) {
      setErrorMessage('La descripción debe tener al menos 5 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('visibility', visibility);
      formData.append('date', date);

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      await api.achievements.create(formData);

      // ¡Animación de confeti de celebración!
      triggerConfetti();

      // Limpiar formulario y cerrar
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setFilePreview(null);
      setImageUrl('');
      onCreated();
      onClose();
    } catch (err: any) {
      console.error('Error al publicar logro:', err);
      setErrorMessage(err.message || 'Error al publicar el logro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Celebrar un nuevo Logro
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Comparte una meta cumplida y déjate celebrar por tus amigos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              ¿Qué lograste? <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Aprobé mi examen de inglés, corrí 10 km..."
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Cuéntanos un poco más <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué significó para ti? ¿Cuánto esfuerzo requirió?..."
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none leading-relaxed"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Categoría
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as CategoryType[]).map((catKey) => {
                const conf = CATEGORY_CONFIG[catKey];
                const Icon = conf.icon;
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Privacy row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Fecha del logro
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Privacidad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                ¿Quién puede verlo?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('FRIENDS')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    visibility === 'FRIENDS'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Mis Amigos
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('PRIVATE')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    visibility === 'PRIVATE'
                      ? 'border-stone-800 bg-stone-800 text-white dark:border-stone-200 dark:bg-stone-200 dark:text-stone-900 shadow-sm'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Solo yo
                </button>
              </div>
            </div>
          </div>

          {/* Photo upload / URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              Foto opcional
            </label>

            {filePreview ? (
              <div className="relative rounded-2xl overflow-hidden max-h-48 border border-stone-200 dark:border-stone-700 group">
                <img
                  src={filePreview}
                  alt="Vista previa"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <Upload className="w-6 h-6 text-stone-400 mb-1" />
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Subir imagen desde tu dispositivo
                  </span>
                  <span className="text-[11px] text-stone-400">PNG, JPG, WEBP hasta 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="text-center text-[11px] text-stone-400">o ingresa una URL:</div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) {
                      setSelectedFile(null);
                      setFilePreview(null);
                    }
                  }}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Publicando y celebrando...' : '¡Celebrar y Publicar! 🎉'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
