// src/components/Admin/AdminDashboard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
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
    <div className="min-h-screen bg-[#0a0f1d] text-white">
      <header className="sticky top-0 z-30 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <Brand size="sm" />
          <h1 className="text-xl font-bold mt-2 font-display tracking-tight text-white">Admin Dashboard</h1>
          <button onClick={onExit} className="text-xs font-bold uppercase tracking-widest text-white hover:text-emerald-400 transition">Sign Out</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 w-full py-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-7">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0e1726] border border-white/10 rounded-sm px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Rooms</p>
              <p className="text-3xl font-display mt-1 text-white">{overview?.totalRooms ?? '—'}</p>
            </div>
            <div className="bg-[#0e1726] border border-white/10 rounded-sm px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Managers</p>
              <p className="text-3xl font-display mt-1 text-emerald-400">{overview?.totalManagers ?? '—'}</p>
            </div>
            <div className="bg-[#0e1726] border border-white/10 rounded-sm px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Revenue</p>
              <p className="text-3xl font-display mt-1 text-emerald-400">{(overview?.totalRevenueToday ?? 0).toLocaleString()} 0 TZS</p>
            </div>
          </div>
          
          <div className="sticky top-0 z-20 flex gap-1 mb-6 border-b border-emerald-500/20 bg-[#0a0f1d]/90 backdrop-blur">
            {(['overview', 'matches', 'rooms', 'sponsors'] as const).map(t2 => (
              <button key={t2} onClick={() => setTab(t2)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition ${
                  tab === t2 ? 'border-emerald-500 text-white' : 'border-transparent text-white/60 hover:text-white'
                }`}>
                {t2}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#0e1726] border border-white/10 rounded-sm p-6">
                <h3 className="font-display font-bold mb-4 tracking-tight">Top rooms today</h3>
                <div className="space-y-2">
                  {[...rooms].sort((a, b) => b.todayRevenue - a.todayRevenue).slice(0, 8).map(r => (
                    <div key={r.id} className="flex justify-between items-center bg-[#0a0f1d] border border-white/10 rounded-sm px-4 py-3">
                      <div>
                        <p className="font-semibold text-sm">{r.roomName}</p>
                        <p className="text-xs text-white/60">{r.location} • {r.managerName}</p>
                      </div>
                      <p className="font-mono text-emerald-500 font-bold">{r.todayRevenue.toLocaleString()} TZS</p>
                    </div>
                  ))}
                  {rooms.length === 0 && <p className="text-sm text-white/60">No approved rooms yet.</p>}
                </div>
              </div>
              <div className="bg-[#0e1726] border border-white/10 rounded-sm p-6">
                <h3 className="font-display font-bold mb-4 tracking-tight">Upcoming matches</h3>
                <div className="space-y-2">
                  {matches.slice(0, 8).map(m => (
                    <div key={m.id} className="flex justify-between items-center bg-[#0a0f1d] border border-white/10 rounded-sm px-4 py-3">
                      <p className="font-semibold text-sm">{m.homeTeam} vs {m.awayTeam}</p>
                      <p className="text-xs text-white/60">{m.matchTime}</p>
                    </div>
                  ))}
                  {matches.length === 0 && <p className="text-sm text-white/60">No matches posted yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'matches' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-[#0e1726] border border-white/10 p-6 rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-400 font-display">Post Match</h2>
                <form onSubmit={handlePostMatch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Home Team" required value={homeTeam} onChange={e => setHomeTeam(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    <input type="text" placeholder="Away Team" required value={awayTeam} onChange={e => setAwayTeam(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                  </div>
                  <input type="text" placeholder="Time (e.g. Sat, 16:00)" required value={matchTime} onChange={e => setMatchTime(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                  <button type="submit" className="w-full btn-emerald font-sans font-bold text-xs uppercase tracking-widest text-white py-3 rounded-md transition">
                    Post Match to Users
                  </button>
                </form>
              </div>
              <div className="bg-[#0e1726] border border-white/10 p-6 rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white font-display">Live Matches</h2>
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {matches.length === 0 && <p className="text-white/60 text-sm">No matches added yet.</p>}
                  {matches.map(m => (
                    <div key={m.id} className="flex justify-between items-center bg-[#0a0f1d] p-3 rounded-sm border border-white/10">
                      <div>
                        <span className="font-bold">{m.homeTeam} vs {m.awayTeam}</span>
                        <div className="text-xs text-white/60">{m.matchTime} • Fee: {m.entryFee} TZS</div>
                      </div>
                      <button onClick={() => deleteMatch(m.id)} className="px-3 py-1 text-white border border-rose-800 rounded-sm transition hover:bg-rose-900 text-sm font-bold">
                        Delete
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
                <div className="bg-[#0e1726] border border-emerald-500/20 p-6 rounded-sm">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-400 font-display">
                    {t('pendingApplications')} ({pending.length})
                  </h2>
                  <div className="space-y-4">
                    {pending.map(m => (
                      <div key={m.id} className="bg-[#0a0f1d] border border-white/10 rounded-sm p-4">
                        <p className="font-semibold">{m.name} <span className="text-white/60 font-normal">@{m.username}</span></p>
                        <p className="text-xs text-white/60">{m.phone} • {m.email}</p>
                        {m.room && <p className="text-xs text-white/60 mt-1">{m.room.name} • {m.room.location}</p>}
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => approve(m.id)} className="bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm transition">
                            {t('approve')}
                          </button>
                          <button onClick={() => reject(m.id)} className="border border-rose-800 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-rose-900 transition">
                            {t('reject')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#0e1726] border border-white/10 p-6 rounded-sm">
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-400 font-display">Add Room & Manager</h2>
                  <form onSubmit={handleCreateRoom} className="space-y-3">
                    <input type="text" placeholder="Room Name (e.g. VIP Area)" required value={roomName} onChange={e => setRoomName(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    <input type="text" placeholder="Location" required value={location} onChange={e => setLocation(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Manager Name" required value={managerName} onChange={e => setManagerName(e.target.value)}
                        className="bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                      <input type="text" placeholder="Manager Phone" required value={managerPhone} onChange={e => setManagerPhone(e.target.value)}
                        className="bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    </div>
                    <input type="email" placeholder="Manager Email" required value={managerEmail} onChange={e => setManagerEmail(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    <p className="text-xs text-white/60 pt-1">Login the manager will use to sign in:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Username" required value={managerUsername} onChange={e => setManagerUsername(e.target.value)}
                        className="bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                      <PasswordInput placeholder="Temporary password" required value={managerPassword} onChange={e => setManagerPassword(e.target.value)}
                        className="w-full pr-16 bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    </div>
                    {roomFormError && <p className="text-sm text-rose-800">{roomFormError}</p>}
                    <button type="submit" className="w-full btn-emerald font-sans font-bold text-xs uppercase tracking-widest text-white py-3 rounded-md transition">
                      Register Room & Manager
                    </button>
                  </form>
                </div>
                <div className="h-[580px] flex flex-col bg-[#0e1726] rounded-xl border border-white/10 overflow-hidden">
                  <h2 className="sticky top-0 z-10 bg-[#0e1726] p-4 border-b border-white/10 font-display font-bold text-sm tracking-wider uppercase text-emerald-400">All Rooms & Managers</h2>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {rooms.length === 0 && <p className="text-white/60 text-sm">No rooms registered yet.</p>}
                    {rooms.map(r => (
                      <div key={r.id} className="bg-[#0a0f1d] p-3 rounded-sm border border-white/10">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-emerald-500">{r.roomName}</span>
                            <div className="text-xs text-white/60">Manager: {r.managerName} • {r.location}</div>
                            <div className="text-xs font-mono text-white/60 mt-1">{r.todayEntries} entries • {r.todayRevenue.toLocaleString()} TZS today</div>
                          </div>
                          <div className="flex gap-1">
                            {r.managerId && (
                              <button onClick={() => openReset('manager', r.managerId!)} className="px-2 py-1 text-white/60 hover:text-emerald-500 border border-transparent hover:border-emerald-500 rounded-sm text-xs transition">
                                Reset
                              </button>
                            )}
                            <button onClick={() => deleteRoom(r.id)} className="px-2 py-1 text-white border border-rose-800 rounded-sm text-xs transition hover:bg-rose-900">
                              Delete
                            </button>
                          </div>
                        </div>
                        {resetTarget?.type === 'manager' && resetTarget.id === r.managerId && (
                          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex gap-2">
                            <PasswordInput placeholder="New password" value={resetValue} onChange={e => setResetValue(e.target.value)}
                              className="flex-1 pr-16 bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                            <button onClick={submitReset} disabled={resetBusy} className="bg-emerald-900 text-white font-bold text-sm px-4 rounded-sm disabled:opacity-50">Save</button>
                            <button onClick={() => setResetTarget(null)} className="text-white/60 text-sm px-2">Cancel</button>
                          </div>
                        )}
                        {resetTarget?.type === 'manager' && resetTarget.id === r.managerId && resetError && (
                          <p className="text-xs text-rose-800 mt-1">{resetError}</p>
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
              <div className="bg-[#0e1726] border border-white/10 p-6 rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-400 font-display">Add Sponsor</h2>
                <form onSubmit={handleCreateSponsor} className="space-y-3">
                  <input type="text" placeholder="Sponsor / company name" required value={sponsorName} onChange={e => setSponsorName(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Amount sponsored (TZS)" required value={sponsorAmount} onChange={e => setSponsorAmount(e.target.value)}
                      className="bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                    <input type="number" placeholder="Profit share %" required value={sponsorShare} onChange={e => setSponsorShare(e.target.value)}
                      className="bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                  </div>
                  <input type="text" placeholder="Username" required value={sponsorUsername} onChange={e => setSponsorUsername(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                  <PasswordInput placeholder="Temporary password" required value={sponsorPassword} onChange={e => setSponsorPassword(e.target.value)}
                    className="w-full pr-16 bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                  {sponsorFormError && <p className="text-sm text-rose-800">{sponsorFormError}</p>}
                  <button type="submit" className="w-full btn-emerald font-sans font-bold text-xs uppercase tracking-widest text-white py-3 rounded-md transition">
                    Create Sponsor Account
                  </button>
                </form>
              </div>
              <div className="bg-[#0e1726] border border-emerald-800 p-6 rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white font-display">All Sponsors</h2>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {sponsors.length === 0 && <p className="text-white/60 text-sm">No sponsors registered yet.</p>}
                  {sponsors.map(s => (
                    <div key={s.id} className="bg-[#0a0f1d] p-3 rounded-sm border border-emerald-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-emerald-500">{s.name}</span>
                          <div className="text-xs text-white/60">@{s.username} • {s.profitSharePercent}% profit share</div>
                          <div className="text-xs font-mono text-white/60 mt-1">{s.amountSponsored.toLocaleString()} TZS sponsored</div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openReset('sponsor', s.id)} className="px-2 py-1 text-white/60 hover:text-emerald-500 border border-transparent hover:border-emerald-500 rounded-sm text-xs transition">
                            Reset
                          </button>
                          <button onClick={() => deleteSponsor(s.id)} className="px-2 py-1 text-white border border-rose-800 rounded-sm text-xs transition hover:bg-rose-900">
                            Delete
                          </button>
                        </div>
                      </div>
                      {resetTarget?.type === 'sponsor' && resetTarget.id === s.id && (
                        <div className="mt-3 pt-3 border-t border-emerald-500/20 flex gap-2">
                          <PasswordInput placeholder="New password" value={resetValue} onChange={e => setResetValue(e.target.value)}
                            className="flex-1 pr-16 bg-[#0a0f1d] border border-white/15 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 rounded-md text-white placeholder-slate-500 px-4 py-3 text-sm transition" />
                          <button onClick={submitReset} disabled={resetBusy} className="bg-emerald-900 text-white font-bold text-sm px-4 rounded-sm disabled:opacity-50">Save</button>
                          <button onClick={() => setResetTarget(null)} className="text-white/60 text-sm px-2">Cancel</button>
                        </div>
                      )}
                      {resetTarget?.type === 'sponsor' && resetTarget.id === s.id && resetError && (
                        <p className="text-xs text-rose-800 mt-1">{resetError}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
