// src/components/Sponsor/SponsorDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';

interface SponsorMe {
  id: string;
  name: string;
  amountSponsored: number;
  profitSharePercent: number;
  rooms: {
    id: string;
    roomName: string;
    location: string;
    todayEntries: number;
    todayRevenue: number;
  }[];
}

export const SponsorDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { session, logout } = useAuth();
  const { t } = useLanguage();
  const token = session!.token;
  const [data, setData] = useState<SponsorMe | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getSponsorMe(token);
      setData(res);
    } catch (e) {
      if (e instanceof Error && e.message.toLowerCase().includes('session')) {
        logout();
        onExit();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-slate-400 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-[#0e1726] px-6 py-4 rounded-lg border border-white/10 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-semibold tracking-wider text-slate-300">Loading sponsor metrics…</span>
        </div>
      </div>
    );
  }

  const platformRevenueToday = data.rooms.reduce((s, r) => s + r.todayRevenue, 0);
  const platformEntriesToday = data.rooms.reduce((s, r) => s + r.todayEntries, 0);
  const currentProfit = Math.round(platformRevenueToday * (data.profitSharePercent / 100));

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white">
      <style>{`
        @keyframes motionFadeIn {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-motion-view {
          animation: motionFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-emerald-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Brand size="sm" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-2 mb-0.5 font-display">
              Sponsor Partner
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              {data.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Here's how the platform is performing in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-white/15 rounded-md hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Refresh
            </button>
            <SettingsMenu />
            <button
              onClick={() => {
                logout();
                onExit();
              }}
              className="text-xs font-bold uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              {t('signOut')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-motion-view space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e1726] border border-white/10 p-6 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Amount You've Sponsored
            </p>
            <h3 className="text-3xl font-display font-bold mt-2 text-white">
              {data.amountSponsored.toLocaleString()} TZS
            </h3>
          </div>

          <div className="bg-[#0e1726] border border-white/10 p-6 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Your Profit Today ({data.profitSharePercent}%)
            </p>
            <h3 className="text-3xl font-display font-bold text-emerald-400 mt-2">
              {currentProfit.toLocaleString()} TZS
            </h3>
          </div>

          <div className="bg-[#0e1726] border border-white/10 p-6 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Platform Revenue Today
            </p>
            <h3 className="text-3xl font-display font-bold mt-2 text-white">
              {platformRevenueToday.toLocaleString()} TZS
            </h3>
          </div>
        </div>

        {/* Room Performance Section */}
        <div className="bg-[#0e1726] border border-white/10 rounded-md p-6 transition-all duration-300 hover:border-emerald-500/30">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 font-display mb-1">
            Room Performance Today
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            {platformEntriesToday} fans have entered across {data.rooms.length} rooms today.
          </p>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scroll-smooth">
            {data.rooms.length === 0 && (
              <p className="text-sm text-slate-400">No rooms are active yet.</p>
            )}
            {[...data.rooms]
              .sort((a, b) => b.todayRevenue - a.todayRevenue)
              .map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center bg-[#0a0f1d] border border-white/10 rounded-sm px-4 py-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:border-emerald-500/40 cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-sm text-white">{r.roomName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {r.location} • {r.todayEntries} entries
                    </p>
                  </div>
                  <p className="font-mono text-emerald-400 font-bold text-sm">
                    {r.todayRevenue.toLocaleString()} TZS
                  </p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};