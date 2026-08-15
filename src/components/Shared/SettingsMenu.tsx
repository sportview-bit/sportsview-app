// src/components/Shared/SettingsMenu.tsx
import React, { useState } from 'react';
import { Settings, Sun, Moon, Globe, X } from 'lucide-react';
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
        className="p-2 rounded-lg border border-[var(--border)] hover:border-[#F2B705] transition text-[var(--text)] bg-[var(--surface)]"
      >
        <Settings className="w-5 h-5" />
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
              <button onClick={() => setOpen(false)} aria-label={t('close')} className="text-[var(--text-muted)] hover:text-[var(--text)] transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> {t('language')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLang('sw')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 transition ${
                    lang === 'sw' ? 'bg-[#F2B705] text-[#0B0F14] border-[#F2B705]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#F2B705]'
                  }`}
                >
                  Kiswahili
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 transition ${
                    lang === 'en' ? 'bg-[#F2B705] text-[#0B0F14] border-[#F2B705]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#F2B705]'
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
                    theme === 'dark' ? 'bg-[#34D399] text-[#0B0F14] border-[#34D399]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#34D399]'
                  }`}
                >
                  <Moon className="w-4 h-4" /> {t('dark')}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2 rounded-lg text-sm font-semibold border-2 flex items-center justify-center gap-2 transition ${
                    theme === 'light' ? 'bg-[#34D399] text-[#0B0F14] border-[#34D399]' : 'border-[var(--border)] text-[var(--text)] hover:border-[#34D399]'
                  }`}
                >
                  <Sun className="w-4 h-4" /> {t('light')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};