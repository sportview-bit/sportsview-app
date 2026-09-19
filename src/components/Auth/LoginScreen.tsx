// src/components/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { PasswordInput } from '../Shared/PasswordInput';

interface LoginScreenProps {
  title: string;
  subtitle: string;
  accentColor: string;
  onBack: () => void;
  onSubmit: (username: string, password: string) => Promise<string | null> | string | null;
  footer?: React.ReactNode;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ title, subtitle, onBack, onSubmit, footer }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const err = await onSubmit(username, password);
    setLoading(false);
    setError(err ?? '');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0e1726] border-l border-white/10 shadow-2xl z-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-white hover:text-emerald-400 transition">
          {t('back')}
        </button>
        <SettingsMenu />
      </div>
      <h2 className="text-xl font-bold mb-2 font-display text-white">{title}</h2>
      <p className="text-sm text-white/60 mb-8">{subtitle}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">{t('username')}</label>
          <input
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-[#0a0f1d] border border-slate-700 rounded-sm px-4 py-3 mt-1 outline-none focus:border-slate-500 transition text-white"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">{t('password')}</label>
          <PasswordInput
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#0a0f1d] border border-slate-700 rounded-sm px-4 py-3 mt-1 outline-none focus:border-slate-500 transition text-white"
          />
        </div>
        {error && <p className="text-sm text-rose-800">{error}</p>}
        <button disabled={loading} type="submit" className="w-full btn-emerald font-sans font-bold text-xs uppercase tracking-widest text-white py-3 rounded-md transition">
          {loading ? t('signingIn') : t('signIn')}
        </button>
      </form>
      {footer && <div className="mt-8 text-center">{footer}</div>}
    </div>
  );
};