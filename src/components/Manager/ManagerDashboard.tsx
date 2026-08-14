// src/components/Manager/ManagerDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Users, Wallet, ScanLine, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';
import type { Match } from '../../types';

interface RoomDetail {
  id: string; roomName: string; location: string; todayEntries: number; todayRevenue: number;
  recentEntries: { id: string; userName: string; amount: number; match: string; scannedAt: string }[];
}

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
    const [r, ms] = await Promise.all([api.getMyRoom(token), api.getMatches()]);
    setRoom(r); setMatches(ms);
    setMatchId(prev => prev || ms[0]?.id || '');
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
      setScanMsg({ ok: true, text: `${res.userName} let in — ${res.amount.toLocaleString()} TZS deducted.` });
      setCardHash(''); refresh();
    } catch (err) {
      setScanMsg({ ok: false, text: err instanceof Error ? err.message : 'Scan failed' });
    }
  };

  if (!room) return <div className="min-h-screen bg-[var(--bg)] text-[var(--text-muted)] flex items-center justify-center">Loading your room…</div>;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[var(--border)] pb-5 gap-4">
        <div>
          <Brand size="sm" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#34D399] mt-2 mb-1">Room Manager • {session?.name}</p>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{room.roomName}</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">{room.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="p-2 rounded-lg border border-[var(--border)] hover:border-[#34D399] transition"><RefreshCw className="w-4 h-4" /></button>
          <SettingsMenu />
          <button onClick={() => { logout(); onExit(); }} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#FF5468] transition">
            <LogOut className="w-4 h-4" /> {t('signOut')}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#F2B705]/10 text-[#F2B705] rounded-xl"><Users className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">People in today</p>
            <h3 className="text-3xl font-bold font-mono">{room.todayEntries}</h3>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#34D399]/10 text-[#34D399] rounded-xl"><Wallet className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Collected today</p>
            <h3 className="text-3xl font-bold text-[#34D399] font-mono">{room.todayRevenue.toLocaleString()} TZS</h3>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><ScanLine className="w-5 h-5 text-[#34D399]" /> Door scanner</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">Hardware scanner not connected yet — enter a card ID to simulate a scan.</p>
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <input required placeholder="Card ID (e.g. SVTZ-A1B2C3D4)" value={cardHash} onChange={e => setCardHash(e.target.value)}
            className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 outline-none focus:border-[#34D399] font-mono text-[var(--text)]" />
          <select value={matchId} onChange={e => setMatchId(e.target.value)}
            className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 outline-none focus:border-[#34D399] text-[var(--text)]">
            {matches.map(m => <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam}</option>)}
          </select>
          <button className="bg-[#34D399] text-[#0B0F14] font-bold px-6 py-2 rounded-lg hover:brightness-110 transition">Scan</button>
        </form>
        {scanMsg && <p className={`text-sm mt-3 ${scanMsg.ok ? 'text-[#34D399]' : 'text-[#FF5468]'}`}>{scanMsg.text}</p>}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">Live entries today</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {room.recentEntries.length === 0 && <p className="text-sm text-[var(--text-muted)]">No one has scanned in yet today.</p>}
          {room.recentEntries.map(e => (
            <div key={e.id} className="flex justify-between items-center bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3">
              <div>
                <p className="font-semibold text-sm">{e.userName}</p>
                <p className="text-xs text-[var(--text-muted)]">{e.match}</p>
              </div>
              <p className="font-mono text-[#34D399] font-bold">{e.amount.toLocaleString()} TZS</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};