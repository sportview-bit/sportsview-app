// src/components/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { PasswordInput } from '../Shared/PasswordInput';

interface LoginScreenProps {
  title: string;
  subtitle: string;
  accentColor: string;
  icon: React.ReactNode;
  onBack: () => void;
  onSubmit: (username: string, password: string) => Promise<string | null> | string | null;
  footer?: React.ReactNode;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ title, subtitle, accentColor, icon, onBack, onSubmit, footer }) => {
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition">
            <ArrowLeft className="w-4 h-4" /> {t('back')}
          </button>
          <SettingsMenu />
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
          <div className="mb-4" style={{ color: accentColor }}>{icon}</div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">{subtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--text-muted)]">{t('username')}</label>
              <input
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 outline-none focus:border-current transition text-[var(--text)]"
                style={{ caretColor: accentColor }}
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">{t('password')}</label>
              <PasswordInput
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 outline-none focus:border-current transition text-[var(--text)]"
                style={{ caretColor: accentColor }}
              />
            </div>
            {error && <p className="text-sm text-[#FF5468]">{error}</p>}
            <button disabled={loading} type="submit" className="w-full font-bold py-3 rounded-lg transition hover:brightness-110 disabled:opacity-50" style={{ background: accentColor, color: '#0B0F14' }}>
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>
          {footer && <div className="mt-5 text-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
};