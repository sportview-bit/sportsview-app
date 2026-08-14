// src/components/Sponsor/SponsorDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Handshake, TrendingUp, Wallet, LogOut, Radio, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';

interface SponsorMe {
  id: string; name: string; amountSponsored: number; profitSharePercent: number;
  rooms: { id: string; roomName: string; location: string; todayEntries: number; todayRevenue: number }[];
}

export const SponsorDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { session, logout } = useAuth();
  const { t } = useLanguage();
  const token = session!.token;
  const [data, setData] = useState<SponsorMe | null>(null);

  const refresh = useCallback(async () => {
    setData(await api.getSponsorMe(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!data) return <div className="min-h-screen bg-[var(--bg)] text-[var(--text-muted)] flex items-center justify-center">Loading…</div>;

  const platformRevenueToday = data.rooms.reduce((s, r) => s + r.todayRevenue, 0);
  const platformEntriesToday = data.rooms.reduce((s, r) => s + r.todayEntries, 0);
  const currentProfit = Math.round(platformRevenueToday * (data.profitSharePercent / 100));

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
      <div className="flex justify-between items-start mb-8 border-b border-[var(--border)] pb-5 gap-4">
        <div>
          <Brand size="sm" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] flex items-center gap-2 mt-2 mb-1">
            <Handshake className="w-4 h-4" /> Sponsor
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{data.name}</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">Here's how the platform is performing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="p-2 rounded-lg border border-[var(--border)] hover:border-[#A78BFA] transition"><RefreshCw className="w-4 h-4" /></button>
          <SettingsMenu />
          <button onClick={() => { logout(); onExit(); }} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#FF5468] transition">
            <LogOut className="w-4 h-4" /> {t('signOut')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#A78BFA]/10 text-[#A78BFA] rounded-xl"><Wallet className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Amount You've Sponsored</p>
            <h3 className="text-2xl font-bold font-mono">{data.amountSponsored.toLocaleString()} TZS</h3>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#34D399]/10 text-[#34D399] rounded-xl"><TrendingUp className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Your Profit Today ({data.profitSharePercent}%)</p>
            <h3 className="text-2xl font-bold text-[#34D399] font-mono">{currentProfit.toLocaleString()} TZS</h3>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#F2B705]/10 text-[#F2B705] rounded-xl"><Radio className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Platform Revenue Today</p>
            <h3 className="text-2xl font-bold font-mono">{platformRevenueToday.toLocaleString()} TZS</h3>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Room performance today</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">{platformEntriesToday} fans have entered across {data.rooms.length} rooms today.</p>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {data.rooms.length === 0 && <p className="text-sm text-[var(--text-muted)]">No rooms are active yet.</p>}
          {[...data.rooms].sort((a, b) => b.todayRevenue - a.todayRevenue).map(r => (
            <div key={r.id} className="flex justify-between items-center bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3">
              <div>
                <p className="font-semibold text-sm">{r.roomName}</p>
                <p className="text-xs text-[var(--text-muted)]">{r.location} • {r.todayEntries} entries</p>
              </div>
              <p className="font-mono text-[#34D399] font-bold">{r.todayRevenue.toLocaleString()} TZS</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};