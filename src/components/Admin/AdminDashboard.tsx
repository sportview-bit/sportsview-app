// src/components/Admin/AdminDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { CalendarPlus, Trash2, Building2, ShieldCheck, Radio, Handshake, Clock, Check, X, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';
import { PasswordInput } from '../Shared/PasswordInput';
import type { Match, Room } from '../../types';

interface Overview {
  totalRooms: number; totalManagers: number; totalSponsors: number;
  totalEntriesToday: number; totalRevenueToday: number;
}
interface PendingManager {
  id: string; name: string; phone: string; email: string; username: string;
  room: { id: string; name: string; location: string } | null;
}
interface SponsorRow {
  id: string; name: string; username: string; amountSponsored: number; profitSharePercent: number;
}

type Tab = 'overview' | 'matches' | 'rooms' | 'sponsors';

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { session, logout } = useAuth();
  const { t } = useLanguage();
  const token = session!.token;

  const [tab, setTab] = useState<Tab>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pending, setPending] = useState<PendingManager[]>([]);
  const [sponsors, setSponsors] = useState<SponsorRow[]>([]);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchTime, setMatchTime] = useState('');

  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerUsername, setManagerUsername] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [roomFormError, setRoomFormError] = useState('');

  const [sponsorName, setSponsorName] = useState('');
  const [sponsorUsername, setSponsorUsername] = useState('');
  const [sponsorPassword, setSponsorPassword] = useState('');
  const [sponsorAmount, setSponsorAmount] = useState('');
  const [sponsorShare, setSponsorShare] = useState('');
  const [sponsorFormError, setSponsorFormError] = useState('');

  // password-reset UI state — which row (by manager/sponsor id) has its reset field open
  const [resetTarget, setResetTarget] = useState<{ type: 'manager' | 'sponsor'; id: string } | null>(null);
  const [resetValue, setResetValue] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetBusy, setResetBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [ov, ms, rm, pd, sp] = await Promise.all([
        api.getOverview(token), api.getMatches(), api.getRooms(token),
        api.getPendingManagers(token), api.getSponsors(token),
      ]);
      setOverview(ov); setMatches(ms); setRooms(rm); setPending(pd); setSponsors(sp);
    } catch (e) {
      if (e instanceof Error && e.message.toLowerCase().includes('session')) { logout(); onExit(); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  const handlePostMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createMatch(token, { homeTeam, awayTeam, matchTime, entryFee: 1000 });
    setHomeTeam(''); setAwayTeam(''); setMatchTime('');
    refresh();
  };
  const deleteMatch = async (id: string) => { await api.deleteMatch(token, id); refresh(); };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoomFormError('');
    try {
      await api.createRoom(token, {
        roomName, location, managerName, phone: managerPhone, email: managerEmail,
        username: managerUsername, password: managerPassword,
      });
      setRoomName(''); setLocation(''); setManagerName(''); setManagerPhone('');
      setManagerEmail(''); setManagerUsername(''); setManagerPassword('');
      refresh();
    } catch (err) {
      setRoomFormError(err instanceof Error ? err.message : 'Could not create room');
    }
  };
  const deleteRoom = async (id: string) => { await api.deleteRoom(token, id); refresh(); };

  const approve = async (id: string) => { await api.approveManager(token, id); refresh(); };
  const reject = async (id: string) => { await api.rejectManager(token, id); refresh(); };

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorFormError('');
    try {
      await api.createSponsor(token, {
        name: sponsorName, username: sponsorUsername, password: sponsorPassword,
        amountSponsored: sponsorAmount, profitSharePercent: sponsorShare,
      });
      setSponsorName(''); setSponsorUsername(''); setSponsorPassword('');
      setSponsorAmount(''); setSponsorShare('');
      refresh();
    } catch (err) {
      setSponsorFormError(err instanceof Error ? err.message : 'Could not create sponsor');
    }
  };
  const deleteSponsor = async (id: string) => { await api.deleteSponsor(token, id); refresh(); };

  const openReset = (type: 'manager' | 'sponsor', id: string) => {
    setResetTarget({ type, id }); setResetValue(''); setResetError('');
  };
  const submitReset = async () => {
    if (!resetTarget) return;
    if (resetValue.length < 4) { setResetError('At least 4 characters'); return; }
    setResetBusy(true);
    try {
      if (resetTarget.type === 'manager') await api.resetManagerPassword(token, resetTarget.id, resetValue);
      else await api.resetSponsorPassword(token, resetTarget.id, resetValue);
      setResetTarget(null);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Could not reset password');
    } finally {
      setResetBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-10">
        <div>
          <Brand size="sm" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#F2B705] flex items-center gap-2 mt-2">
            <ShieldCheck className="w-4 h-4" /> Super Admin
          </p>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <SettingsMenu />
          <button onClick={onExit} className="text-sm text-[var(--text-muted)] hover:text-[#FF5468] transition">{t('signOut')}</button>
        </div>
      </header>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Rooms</p>
            <p className="text-2xl font-bold font-mono mt-1">{overview?.totalRooms ?? '—'}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Managers</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#34D399]">{overview?.totalManagers ?? '—'}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#F2B705]">{pending.length}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Sponsors</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#A78BFA]">{overview?.totalSponsors ?? '—'}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Entries Today</p>
            <p className="text-2xl font-bold font-mono mt-1">{overview?.totalEntriesToday ?? '—'}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Revenue Today</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#34D399]">{(overview?.totalRevenueToday ?? 0).toLocaleString()} TZS</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-[var(--border)] overflow-x-auto">
          {(['overview', 'matches', 'rooms', 'sponsors'] as const).map(t2 => (
            <button key={t2} onClick={() => setTab(t2)}
              className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition whitespace-nowrap ${
                tab === t2 ? 'border-[#F2B705] text-[#F2B705]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}>
              {t2 === 'rooms' ? 'Rooms & Managers' : t2}
              {t2 === 'rooms' && pending.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-[#F2B705] text-[#0B0F14]">{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Radio className="w-4 h-4 text-[#FF5468]" /> Top rooms today</h3>
              <div className="space-y-2">
                {[...rooms].sort((a, b) => b.todayRevenue - a.todayRevenue).slice(0, 8).map(r => (
                  <div key={r.id} className="flex justify-between items-center bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3">
                    <div>
                      <p className="font-semibold text-sm">{r.roomName}</p>
                      <p className="text-xs text-[var(--text-muted)]">{r.location} • {r.managerName}</p>
                    </div>
                    <p className="font-mono text-[#34D399] font-bold">{r.todayRevenue.toLocaleString()} TZS</p>
                  </div>
                ))}
                {rooms.length === 0 && <p className="text-sm text-[var(--text-muted)]">No approved rooms yet.</p>}
              </div>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-bold mb-4">Upcoming matches</h3>
              <div className="space-y-2">
                {matches.slice(0, 8).map(m => (
                  <div key={m.id} className="flex justify-between items-center bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3">
                    <p className="font-semibold text-sm">{m.homeTeam} vs {m.awayTeam}</p>
                    <p className="text-xs text-[var(--text-muted)]">{m.matchTime}</p>
                  </div>
                ))}
                {matches.length === 0 && <p className="text-sm text-[var(--text-muted)]">No matches posted yet.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === 'matches' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#F2B705]"><CalendarPlus className="w-5 h-5" /> Add a Match</h2>
              <form onSubmit={handlePostMatch} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Home Team" required value={homeTeam} onChange={e => setHomeTeam(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#F2B705] transition" />
                  <input type="text" placeholder="Away Team" required value={awayTeam} onChange={e => setAwayTeam(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#F2B705] transition" />
                </div>
                <input type="text" placeholder="Time (e.g. Sat, 16:00)" required value={matchTime} onChange={e => setMatchTime(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#F2B705] transition" />
                <button type="submit" className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-2.5 rounded-lg transition">
                  Post Match to Users
                </button>
              </form>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4">Live Matches</h2>
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {matches.length === 0 && <p className="text-[var(--text-muted)] text-sm">No matches added yet.</p>}
                {matches.map(m => (
                  <div key={m.id} className="flex justify-between items-center bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      <span className="font-bold">{m.homeTeam} vs {m.awayTeam}</span>
                      <div className="text-xs text-[var(--text-muted)]">{m.matchTime} • Fee: {m.entryFee} TZS</div>
                    </div>
                    <button onClick={() => deleteMatch(m.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'rooms' && (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div className="bg-[var(--surface)] border border-[#F2B705]/40 p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#F2B705]">
                  <Clock className="w-5 h-5" /> {t('pendingApplications')} ({pending.length})
                </h2>
                <div className="space-y-4">
                  {pending.map(m => (
                    <div key={m.id} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4">
                      <p className="font-semibold">{m.name} <span className="text-[var(--text-muted)] font-normal">@{m.username}</span></p>
                      <p className="text-xs text-[var(--text-muted)]">{m.phone} • {m.email}</p>
                      {m.room && <p className="text-xs text-[var(--text-muted)] mt-1">{m.room.name} • {m.room.location}</p>}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => approve(m.id)} className="flex items-center gap-1.5 bg-[#34D399] text-[#0B0F14] font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition">
                          <Check className="w-4 h-4" /> {t('approve')}
                        </button>
                        <button onClick={() => reject(m.id)} className="flex items-center gap-1.5 border border-[#FF5468] text-[#FF5468] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#FF5468]/10 transition">
                          <X className="w-4 h-4" /> {t('reject')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#34D399]"><Building2 className="w-5 h-5" /> Add Room & Manager</h2>
                <form onSubmit={handleCreateRoom} className="space-y-3">
                  <input type="text" placeholder="Room Name (e.g. VIP Area)" required value={roomName} onChange={e => setRoomName(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                  <input type="text" placeholder="Location" required value={location} onChange={e => setLocation(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Manager Name" required value={managerName} onChange={e => setManagerName(e.target.value)}
                      className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                    <input type="text" placeholder="Manager Phone" required value={managerPhone} onChange={e => setManagerPhone(e.target.value)}
                      className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                  </div>
                  <input type="email" placeholder="Manager Email" required value={managerEmail} onChange={e => setManagerEmail(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                  <p className="text-xs text-[var(--text-muted)] pt-1">Login the manager will use to sign in:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Username" required value={managerUsername} onChange={e => setManagerUsername(e.target.value)}
                      className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                    <PasswordInput placeholder="Temporary password" required value={managerPassword} onChange={e => setManagerPassword(e.target.value)}
                      className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                  </div>
                  {roomFormError && <p className="text-sm text-[#FF5468]">{roomFormError}</p>}
                  <button type="submit" className="w-full bg-[#34D399] hover:brightness-110 text-[#0B0F14] font-bold py-2.5 rounded-lg transition">
                    Register Room & Manager
                  </button>
                </form>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-4">All Rooms & Managers</h2>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {rooms.length === 0 && <p className="text-[var(--text-muted)] text-sm">No rooms registered yet.</p>}
                  {rooms.map(r => (
                    <div key={r.id} className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-[#34D399]">{r.roomName}</span>
                          <div className="text-xs text-[var(--text-muted)]">Manager: {r.managerName} • {r.location}</div>
                          <div className="text-xs font-mono text-[var(--text-muted)] mt-1">{r.todayEntries} entries • {r.todayRevenue.toLocaleString()} TZS today</div>
                        </div>
                        <div className="flex gap-1">
                          {r.managerId && (
                            <button onClick={() => openReset('manager', r.managerId!)} title="Reset manager password" className="p-2 text-[var(--text-muted)] hover:text-[#F2B705] hover:bg-[#F2B705]/10 rounded-lg transition">
                              <KeyRound className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteRoom(r.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {resetTarget?.type === 'manager' && resetTarget.id === r.managerId && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)] flex gap-2">
                          <PasswordInput placeholder="New password" value={resetValue} onChange={e => setResetValue(e.target.value)}
                            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[#F2B705]" />
                          <button onClick={submitReset} disabled={resetBusy} className="bg-[#F2B705] text-[#0B0F14] font-bold text-sm px-4 rounded-lg disabled:opacity-50">Save</button>
                          <button onClick={() => setResetTarget(null)} className="text-[var(--text-muted)] text-sm px-2">Cancel</button>
                        </div>
                      )}
                      {resetTarget?.type === 'manager' && resetTarget.id === r.managerId && resetError && (
                        <p className="text-xs text-[#FF5468] mt-1">{resetError}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'sponsors' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#A78BFA]"><Handshake className="w-5 h-5" /> Add Sponsor</h2>
              <form onSubmit={handleCreateSponsor} className="space-y-3">
                <input type="text" placeholder="Sponsor / company name" required value={sponsorName} onChange={e => setSponsorName(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#A78BFA] transition" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Amount sponsored (TZS)" required value={sponsorAmount} onChange={e => setSponsorAmount(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#A78BFA] transition" />
                  <input type="number" placeholder="Profit share %" required value={sponsorShare} onChange={e => setSponsorShare(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#A78BFA] transition" />
                </div>
                <p className="text-xs text-[var(--text-muted)] pt-1">Login the sponsor will use to sign in:</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Username" required value={sponsorUsername} onChange={e => setSponsorUsername(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#A78BFA] transition" />
                  <PasswordInput placeholder="Temporary password" required value={sponsorPassword} onChange={e => setSponsorPassword(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#A78BFA] transition" />
                </div>
                {sponsorFormError && <p className="text-sm text-[#FF5468]">{sponsorFormError}</p>}
                <button type="submit" className="w-full bg-[#A78BFA] hover:brightness-110 text-[#0B0F14] font-bold py-2.5 rounded-lg transition">
                  Create Sponsor Account
                </button>
              </form>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4">All Sponsors</h2>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {sponsors.length === 0 && <p className="text-[var(--text-muted)] text-sm">No sponsors registered yet.</p>}
                {sponsors.map(s => (
                  <div key={s.id} className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#A78BFA]">{s.name}</span>
                        <div className="text-xs text-[var(--text-muted)]">@{s.username} • {s.profitSharePercent}% profit share</div>
                        <div className="text-xs font-mono text-[var(--text-muted)] mt-1">{s.amountSponsored.toLocaleString()} TZS sponsored</div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openReset('sponsor', s.id)} title="Reset sponsor password" className="p-2 text-[var(--text-muted)] hover:text-[#A78BFA] hover:bg-[#A78BFA]/10 rounded-lg transition">
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteSponsor(s.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {resetTarget?.type === 'sponsor' && resetTarget.id === s.id && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)] flex gap-2">
                        <PasswordInput placeholder="New password" value={resetValue} onChange={e => setResetValue(e.target.value)}
                          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[#A78BFA]" />
                        <button onClick={submitReset} disabled={resetBusy} className="bg-[#A78BFA] text-[#0B0F14] font-bold text-sm px-4 rounded-lg disabled:opacity-50">Save</button>
                        <button onClick={() => setResetTarget(null)} className="text-[var(--text-muted)] text-sm px-2">Cancel</button>
                      </div>
                    )}
                    {resetTarget?.type === 'sponsor' && resetTarget.id === s.id && resetError && (
                      <p className="text-xs text-[#FF5468] mt-1">{resetError}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};