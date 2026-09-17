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
      <div className="min-h-screen bg-slate-950 text-stone-300 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-stone-900/80 px-6 py-4 rounded-xl border border-stone-800 shadow-2xl backdrop-blur-sm animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-sm font-medium tracking-wide text-stone-200">Retrieving partner metrics…</span>
        </div>
      </div>
    );
  }

  const platformRevenueToday = data.rooms.reduce((s, r) => s + r.todayRevenue, 0);
  const platformEntriesToday = data.rooms.reduce((s, r) => s + r.todayEntries, 0);
  const currentProfit = Math.round(platformRevenueToday * (data.profitSharePercent / 100));

  return (
    <div className="min-h-screen bg-slate-950 text-stone-100 font-sans selection:bg-amber-500/30">
      <style>{`
        @keyframes motionFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-motion-view {
          animation: motionFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-stone-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Brand size="sm" />
            <div className="h-8 w-px bg-stone-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Verified Sponsor
                </span>
                <span className="text-xs text-stone-400">• {data.profitSharePercent}% RevShare</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-stone-100 mt-0.5">
                {data.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 hover:text-amber-400 text-stone-300 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
            >
              Sync Live
            </button>
            <SettingsMenu />
            <button
              onClick={() => {
                logout();
                onExit();
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all duration-200 cursor-pointer"
            >
              {t('signOut')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-motion-view space-y-8">

        {/* Asymmetric Hero Highlights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Hero Card: Today's Profit */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-slate-900 border border-amber-500/30 p-8 shadow-2xl shadow-amber-950/20">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                  Your Net Earnings Today
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Calculated dynamically from live venue entries ({data.profitSharePercent}% profit share).
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/20">
                Live Yield
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-amber-400 font-mono">
                {currentProfit.toLocaleString()}
              </span>
              <span className="text-lg font-bold text-amber-500/80">TZS</span>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
              <span>Overall Capital Sponsored:</span>
              <span className="font-semibold text-stone-200 font-mono text-sm">
                {data.amountSponsored.toLocaleString()} TZS
              </span>
            </div>
          </div>

          {/* Secondary Summary Stats */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Total Platform Revenue Card */}
            <div className="flex-1 rounded-2xl bg-stone-900/70 border border-stone-800/80 p-6 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all shadow-xl">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Gross Platform Revenue Today
                </span>
                <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
              </div>
              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-100 font-mono">
                  {platformRevenueToday.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-stone-400 ml-1.5">TZS</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Aggregated across all active match rooms and venues.
              </p>
            </div>

            {/* Active Fans/Entries Metric */}
            <div className="flex-1 rounded-2xl bg-stone-900/70 border border-stone-800/80 p-6 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all shadow-xl">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Total Fan Attendance
                </span>
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {data.rooms.length} Active Venues
                </span>
              </div>
              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-100 font-mono">
                  {platformEntriesToday.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-stone-400 ml-1.5">Entries Today</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Real-time check-ins logged by room managers today.
              </p>
            </div>

          </div>
        </div>

        {/* Room Performance Table Container */}
        <div className="rounded-2xl bg-stone-900/50 border border-stone-800/90 p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-stone-100">
                Venue & Room Breakdown
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Detailed real-time turnover listed by top performing locations.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-mono text-stone-400 bg-stone-800/60 px-3 py-1 rounded-lg border border-stone-700/50">
              Sorted by Gross Revenue
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {data.rooms.length === 0 && (
              <div className="text-center py-12 text-stone-500 text-sm">
                No active match rooms recorded for today.
              </div>
            )}
            {[...data.rooms]
              .sort((a, b) => b.todayRevenue - a.todayRevenue)
              .map((r) => {
                const roomShare = platformRevenueToday > 0
                  ? Math.round((r.todayRevenue / platformRevenueToday) * 100)
                  : 0;

                return (
                  <div
                    key={r.id}
                    className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/80 hover:bg-slate-900 border border-stone-800/80 hover:border-amber-500/30 rounded-xl px-5 py-4 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-950/10"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-stone-200 group-hover:text-amber-400 transition-colors">
                          {r.roomName}
                        </span>
                        <span className="text-[10px] font-medium text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full border border-stone-700/60">
                          {r.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span>{r.todayEntries} entries logged</span>
                        <span>•</span>
                        <span className="text-stone-500">{roomShare}% of daily total</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-stone-800/60 pt-2 sm:pt-0">
                      <div className="text-right">
                        <div className="font-mono text-amber-400 font-bold text-base">
                          {r.todayRevenue.toLocaleString()} <span className="text-xs text-amber-500/80">TZS</span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Sponsor Share: Math.round(r.todayRevenue * (data.profitSharePercent / 100)).toLocaleString() TZS
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </main>
    </div>
  );
};