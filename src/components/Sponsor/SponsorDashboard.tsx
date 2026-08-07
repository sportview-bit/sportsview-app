// src/components/Sponsor/SponsorDashboard.tsx
import React from 'react';
import { Handshake, TrendingUp, Wallet, LogOut, Radio } from 'lucide-react';
import type { Sponsor, Room } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';

interface SponsorProps {
  sponsor: Sponsor;
  rooms: Room[];
  onExit: () => void;
}

export const SponsorDashboard: React.FC<SponsorProps> = ({ sponsor, rooms, onExit }) => {
  const { t } = useLanguage();
  const platformRevenueToday = rooms.reduce((sum, r) => sum + r.todayRevenue, 0);
  const platformEntriesToday = rooms.reduce((sum, r) => sum + r.todayEntries, 0);

  // Assumption: "current profit" = the sponsor's agreed share of today's platform
  // revenue. Adjust this formula once you've settled on the real sponsorship deal terms.
  const currentProfit = Math.round(platformRevenueToday * (sponsor.profitSharePercent / 100));

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
      <div className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-4">
          <Brand size="sm" />
          <div className="border-l border-[var(--border)] pl-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A78BFA] flex items-center gap-2 mb-1">
              <Handshake className="w-4 h-4" /> Sponsor
            </p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{sponsor.name}</h1>
            <p className="text-[var(--text-muted)] mt-1 text-sm">Here's how the platform is performing.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SettingsMenu />
          <button onClick={onExit} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#FF5468] transition">
            <LogOut className="w-4 h-4" /> {t('signOut')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#A78BFA]/10 text-[#A78BFA] rounded-xl"><Wallet className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Amount You've Sponsored</p>
            <h3 className="text-2xl font-bold font-mono">{sponsor.amountSponsored.toLocaleString()} TZS</h3>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#34D399]/10 text-[#34D399] rounded-xl"><TrendingUp className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Your Profit Today ({sponsor.profitSharePercent}%)</p>
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
        <p className="text-xs text-[var(--text-muted)] mb-4">{platformEntriesToday} fans have entered across {rooms.length} rooms today.</p>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {rooms.length === 0 && <p className="text-sm text-[var(--text-muted)]">No rooms are active yet.</p>}
          {[...rooms].sort((a, b) => b.todayRevenue - a.todayRevenue).map(r => (
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
