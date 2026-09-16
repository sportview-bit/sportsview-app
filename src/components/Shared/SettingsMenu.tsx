// src/components/Shared/SettingsMenu.tsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const SettingsMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="relative z-[60]">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={t('settings')}
        className="px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[#065f46] transition text-[var(--text)] bg-[var(--surface)] text-sm font-semibold"
      >
        {t('settings')}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[65]" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 mt-2 w-72 rounded-2xl p-5 z-[70] border-2"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              color: 'var(--text)',
            }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>{t('settings')}</h3>
              <button onClick={() => setOpen(false)} aria-label={t('close')} className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm font-semibold transition">
                {t('close')}
              </button>
            </div>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
                {t('language')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLang('sw')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 transition ${
                    lang === 'sw' ? 'bg-[#065f46] text-[#0B0F14] border-[#065f46]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#065f46]'
                  }`}
                >
                  Kiswahili
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 transition ${
                    lang === 'en' ? 'bg-[#065f46] text-[#0B0F14] border-[#065f46]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#065f46]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('theme')}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 flex items-center justify-center gap-2 transition ${
                    theme === 'dark' ? 'bg-[#065f46] text-[#0B0F14] border-[#065f46]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#065f46]'
                  }`}
                >
                  {t('dark')}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 flex items-center justify-center gap-2 transition ${
                    theme === 'light' ? 'bg-[#065f46] text-[#0B0F14] border-[#065f46]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#065f46]'
                  }`}
                >
                  {t('light')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};