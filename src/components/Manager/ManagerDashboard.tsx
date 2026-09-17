// src/components/Manager/ManagerDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';
import type { Match } from '../../types';

interface RoomDetail {
  id: string;
  roomName: string;
  location: string;
  todayEntries: number;
  todayRevenue: number;
  monthlyRevenue: number;
  recentEntries: {
    id: string;
    userName: string;
    amount: number;
    match: string;
    scannedAt: string;
  }[];
}

// The fixed 3-way split every 1,000 TZS entry is broken into.
const VAT_SHARE = 0.18;
const PLATFORM_SHARE = 0.32;
const OWNER_SHARE = 0.5;

export const ManagerDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { session, logout } = useAuth();
  const { t } = useLanguage();
  const token = session!.token;

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [cardHash, setCardHash] = useState('');
  const [matchId, setMatchId] = useState('');
  const [scanMsg, setScanMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [r, ms] = await Promise.all([api.getMyRoom(token), api.getMatches()]);
      setRoom(r);
      setMatches(ms);
      setMatchId((prev) => prev || ms[0]?.id || '');
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
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [refresh]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanMsg(null);
    try {
      const res = await api.simulateScan(token, cardHash, matchId);
      setScanMsg({
        ok: true,
        text: `${res.userName} let in — ${res.amount.toLocaleString()} TZS deducted.`,
      });
      setCardHash('');
      refresh();
    } catch (err) {
      setScanMsg({
        ok: false,
        text: err instanceof Error ? err.message : 'Scan failed',
      });
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-slate-400 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-[#0e1726] px-6 py-4 rounded-lg border border-white/10 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-semibold tracking-wider text-slate-300">Loading your room…</span>
        </div>
      </div>
    );
  }

  const totalCash = room.todayRevenue;
  const vat = Math.round(totalCash * VAT_SHARE);
  const platform = Math.round(totalCash * PLATFORM_SHARE);
  const owner = Math.round(totalCash * OWNER_SHARE);
  const myTotalCashMonth = Math.round(room.monthlyRevenue * OWNER_SHARE);

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
              Room Manager • {session?.name}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              {room.roomName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{room.location}</p>
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-motion-view space-y-6">
        {/* People in Today */}
        <div className="bg-[#0e1726] border border-white/10 p-6 rounded-md transition-all duration-300 ease-out hover:scale-[1.015] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {t('peopleInToday')}
          </p>
          <h3 className="text-4xl font-display font-bold mt-2 text-emerald-400">
            {room.todayEntries}
          </h3>
        </div>

        {/* The 4 Revenue-Split Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0e1726] border border-white/10 p-5 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t('totalCash')}
            </p>
            <p className="text-xl font-bold font-mono mt-1 text-white">
              {totalCash.toLocaleString()} TZS
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">100% Total</p>
          </div>

          <div className="bg-[#0e1726] border border-white/10 p-5 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t('vat')}
            </p>
            <p className="text-xl font-bold font-mono mt-1 text-emerald-400">
              {vat.toLocaleString()} TZS
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">18% Share</p>
          </div>

          <div className="bg-[#0e1726] border border-white/10 p-5 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t('platformShare')}
            </p>
            <p className="text-xl font-bold font-mono mt-1 text-emerald-400">
              {platform.toLocaleString()} TZS
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">32% Share</p>
          </div>

          <div className="bg-[#0e1726] border border-white/10 p-5 rounded-md transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t('ownerShare')}
            </p>
            <p className="text-xl font-bold font-mono mt-1 text-emerald-400">
              {owner.toLocaleString()} TZS
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">50% Share</p>
          </div>
        </div>

        {/* Owner's Monthly Total */}
        <div className="bg-[#0e1726] border border-emerald-500/30 p-6 rounded-md transition-all duration-300 ease-out hover:scale-[1.015] hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {t('myTotalCashMonth')}
          </p>
          <h3 className="text-3xl font-display font-bold text-emerald-400 mt-2">
            {myTotalCashMonth.toLocaleString()} TZS
          </h3>
        </div>

        {/* Door Scanner Form */}
        <div className="bg-[#0e1726] border border-white/10 rounded-md p-6 transition-all duration-300 hover:border-emerald-500/30">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 font-display mb-1">
            {t('doorScanner')}
          </h2>
          <p className="text-xs text-slate-400 mb-5">{t('scannerHelp')}</p>
          <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
            <input
              required
              placeholder={t('cardIdPlaceholder')}
              value={cardHash}
              onChange={(e) => setCardHash(e.target.value)}
              className="flex-1 bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm font-mono transition"
            />
            <select
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              className="bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white px-4 py-3 text-sm transition"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0a0f1d] text-white">
                  {m.homeTeam} vs {m.awayTeam}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="btn-emerald font-sans font-bold text-xs uppercase tracking-widest text-white px-8 py-3 rounded-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              {t('scanButton')}
            </button>
          </form>
          {scanMsg && (
            <p
              className={`text-sm mt-4 font-semibold ${
                scanMsg.ok ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {scanMsg.text}
            </p>
          )}
        </div>

        {/* Live Entries List */}
        <div className="bg-[#0e1726] border border-white/10 rounded-md p-6 transition-all duration-300 hover:border-emerald-500/30">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white font-display mb-4">
            {t('liveEntries')}
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scroll-smooth">
            {room.recentEntries.length === 0 && (
              <p className="text-sm text-slate-400">{t('noEntriesYet')}</p>
            )}
            {room.recentEntries.map((e) => (
              <div
                key={e.id}
                className="flex justify-between items-center bg-[#0a0f1d] border border-white/10 rounded-sm px-4 py-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:border-emerald-500/40 cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-sm text-white">{e.userName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{e.match}</p>
                </div>
                <p className="font-mono text-emerald-400 font-bold text-sm">
                  {e.amount.toLocaleString()} TZS
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};