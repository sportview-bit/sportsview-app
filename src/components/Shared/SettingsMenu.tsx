// src/components/Shared/SettingsMenu.tsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const SettingsMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t('settings')}
        className="px-4 py-2 border border-emerald-500/30 hover:border-emerald-500 transition text-white bg-[#0a0f1d] text-xs font-bold uppercase tracking-widest rounded-md"
      >
        {t('settings')}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />

          <div
            className="fixed inset-y-0 right-0 w-full max-w-md z-50 bg-[#0a0f1d] border-l border-white/10 p-8 shadow-2xl transition-transform"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-display tracking-tight text-white">{t('settings')}</h3>
              <button onClick={() => setOpen(false)} aria-label={t('close')} className="text-white hover:text-emerald-500 text-sm font-bold uppercase tracking-widest">
                {t('close')}
              </button>
            </div>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-white mb-4">
                {t('language')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLang('sw')}
                  className={`px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest border transition ${
                    lang === 'sw' ? 'bg-emerald-900 text-white border-emerald-500' : 'border-white/10 text-white hover:border-emerald-500'
                  }`}
                >
                  Kiswahili
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest border transition ${
                    lang === 'en' ? 'bg-emerald-900 text-white border-emerald-500' : 'border-white/10 text-white hover:border-emerald-500'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white mb-4">{t('theme')}</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest border transition ${
                    theme === 'dark' ? 'bg-emerald-900 text-white border-emerald-500' : 'border-white/10 text-white hover:border-emerald-500'
                  }`}
                >
                  {t('dark')}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-3 rounded-md text-xs font-bold uppercase tracking-widest border transition ${
                    theme === 'light' ? 'bg-emerald-900 text-white border-emerald-500' : 'border-white/10 text-white hover:border-emerald-500'
                  }`}
                >
                  {t('light')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};