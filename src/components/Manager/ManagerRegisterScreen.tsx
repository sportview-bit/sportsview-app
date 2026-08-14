// src/components/Manager/ManagerRegisterScreen.tsx
import React, { useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { PasswordInput } from '../Shared/PasswordInput';

export interface ManagerRegistrationInput {
  name: string;
  phone: string;
  email: string;
  roomName: string;
  location: string;
  username: string;
  password: string;
}

interface ManagerRegisterScreenProps {
  onBack: () => void;
  onSubmit: (data: ManagerRegistrationInput) => Promise<string | null> | string | null;
}

export const ManagerRegisterScreen: React.FC<ManagerRegisterScreenProps> = ({ onBack, onSubmit }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<ManagerRegistrationInput>({
    name: '', phone: '', email: '', roomName: '', location: '', username: '', password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof ManagerRegistrationInput, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const err = await onSubmit(form);
    setSubmitting(false);
    if (err) setError(err);
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
          <CheckCircle2 className="w-10 h-10 text-[#34D399] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{t('applicationSubmittedTitle')}</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">{t('applicationSubmittedDesc')}</p>
          <button onClick={onBack} className="w-full bg-[#34D399] hover:brightness-110 text-[#0B0F14] font-bold py-3 rounded-lg transition">
            {t('backToLogin')}
          </button>
        </div>
      </div>
    );
  }

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
          <Building2 className="w-8 h-8 mb-4 text-[#34D399]" />
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{t('managerRegisterTitle')}</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">{t('managerRegisterSubtitle')}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder={t('fullName')} value={form.name} onChange={e => update('name', e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="tel" placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)}
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
              <input required type="email" placeholder={t('email')} value={form.email} onChange={e => update('email', e.target.value)}
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
            </div>
            <input required placeholder={t('roomName')} value={form.roomName} onChange={e => update('roomName', e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
            <input required placeholder={t('location')} value={form.location} onChange={e => update('location', e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder={t('username')} value={form.username} onChange={e => update('username', e.target.value)}
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
              <PasswordInput required placeholder={t('password')} value={form.password} onChange={e => update('password', e.target.value)}
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
            </div>
            {error && <p className="text-sm text-[#FF5468]">{error}</p>}
            <button disabled={submitting} type="submit" className="w-full bg-[#34D399] hover:brightness-110 disabled:opacity-50 text-[#0B0F14] font-bold py-3 rounded-lg transition mt-2">
              {submitting ? '...' : t('submitApplication')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};