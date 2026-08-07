// src/components/Admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { CalendarPlus, Trash2, Building2, ShieldCheck, Radio, Handshake } from 'lucide-react';
import type { Match, Room, Manager, Sponsor } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';

interface AdminProps {
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  managers: Manager[];
  setManagers: React.Dispatch<React.SetStateAction<Manager[]>>;
  sponsors: Sponsor[];
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
  onExit: () => void;
}

type Tab = 'overview' | 'matches' | 'rooms' | 'sponsors';

export const AdminDashboard: React.FC<AdminProps> = ({
  matches, setMatches, rooms, setRooms, managers, setManagers, sponsors, setSponsors, onExit,
}) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('overview');

  // Match form
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchTime, setMatchTime] = useState('');

  // Room + Manager form
  const [roomName, setRoomName] = useState('');
  const [location, setLocation] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerUsername, setManagerUsername] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [roomFormError, setRoomFormError] = useState('');

  // Sponsor form
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorUsername, setSponsorUsername] = useState('');
  const [sponsorPassword, setSponsorPassword] = useState('');
  const [sponsorAmount, setSponsorAmount] = useState('');
  const [sponsorShare, setSponsorShare] = useState('');
  const [sponsorFormError, setSponsorFormError] = useState('');

  const handlePostMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Match = {
      id: `MATCH-${Math.floor(Math.random() * 10000)}`,
      homeTeam, awayTeam,
      homeLogo: homeTeam.charAt(0).toUpperCase(),
      awayLogo: awayTeam.charAt(0).toUpperCase(),
      matchTime, entryFee: 1000,
    };
    setMatches([newMatch, ...matches]);
    setHomeTeam(''); setAwayTeam(''); setMatchTime('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setRoomFormError('');
    if (managers.some(m => m.username === managerUsername)) {
      setRoomFormError('That manager username is already taken.');
      return;
    }
    const managerId = `MGR-${Math.floor(1000 + Math.random() * 9000)}`;
    const roomId = `RM-${Math.floor(1000 + Math.random() * 9000)}`;

    setManagers([...managers, {
      id: managerId, name: managerName, phone: managerPhone,
      username: managerUsername, password: managerPassword, roomId,
    }]);
    setRooms([...rooms, {
      id: roomId, roomName, location, managerId,
      todayEntries: 0, todayRevenue: 0,
    }]);

    setRoomName(''); setLocation(''); setManagerName(''); setManagerPhone('');
    setManagerUsername(''); setManagerPassword('');
  };

  const handleCreateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorFormError('');
    if (sponsors.some(s => s.username === sponsorUsername)) {
      setSponsorFormError('That sponsor username is already taken.');
      return;
    }
    setSponsors([...sponsors, {
      id: `SPN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: sponsorName, username: sponsorUsername, password: sponsorPassword,
      amountSponsored: Number(sponsorAmount) || 0,
      profitSharePercent: Number(sponsorShare) || 0,
    }]);
    setSponsorName(''); setSponsorUsername(''); setSponsorPassword('');
    setSponsorAmount(''); setSponsorShare('');
  };

  const deleteMatch = (id: string) => setMatches(matches.filter(m => m.id !== id));

  const deleteRoom = (id: string) => {
    const room = rooms.find(r => r.id === id);
    setRooms(rooms.filter(r => r.id !== id));
    if (room) setManagers(managers.filter(m => m.id !== room.managerId));
  };

  const deleteSponsor = (id: string) => setSponsors(sponsors.filter(s => s.id !== id));

  const totalMoney = rooms.reduce((sum, r) => sum + r.todayRevenue, 0);
  const totalEntries = rooms.reduce((sum, r) => sum + r.todayEntries, 0);
  const managerName2 = (id: string) => managers.find(m => m.id === id)?.name ?? 'Unassigned';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Brand size="sm" />
          <div className="border-l border-[var(--border)] pl-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#F2B705] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Super Admin
            </p>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Admin Dashboard</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SettingsMenu />
          <button onClick={onExit} className="text-sm text-[var(--text-muted)] hover:text-[#FF5468] transition">{t('signOut')}</button>
        </div>
      </header>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Rooms</p>
            <p className="text-2xl font-bold font-mono mt-1">{rooms.length}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Managers</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#34D399]">{managers.length}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Sponsors</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#A78BFA]">{sponsors.length}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Entries Today</p>
            <p className="text-2xl font-bold font-mono mt-1">{totalEntries}</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Revenue Today</p>
            <p className="text-2xl font-bold font-mono mt-1 text-[#34D399]">{totalMoney.toLocaleString()} TZS</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-[var(--border)] overflow-x-auto">
          {(['overview', 'matches', 'rooms', 'sponsors'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition whitespace-nowrap ${
                tab === t ? 'border-[#F2B705] text-[#F2B705]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {t === 'rooms' ? 'Rooms & Managers' : t}
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
                      <p className="text-xs text-[var(--text-muted)]">{r.location} • {managerName2(r.managerId)}</p>
                    </div>
                    <p className="font-mono text-[#34D399] font-bold">{r.todayRevenue.toLocaleString()} TZS</p>
                  </div>
                ))}
                {rooms.length === 0 && <p className="text-sm text-[var(--text-muted)]">No rooms yet — add one under Rooms & Managers.</p>}
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
                <p className="text-xs text-[var(--text-muted)] pt-1">Login the manager will use to sign in:</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Username" required value={managerUsername} onChange={e => setManagerUsername(e.target.value)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text)] outline-none focus:border-[#34D399] transition" />
                  <input type="password" placeholder="Temporary password" required value={managerPassword} onChange={e => setManagerPassword(e.target.value)}
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
                  <div key={r.id} className="flex justify-between items-center bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      <span className="font-bold text-[#34D399]">{r.roomName}</span>
                      <div className="text-xs text-[var(--text-muted)]">
                        Manager: {managerName2(r.managerId)} • {r.location}
                      </div>
                      <div className="text-xs font-mono text-[var(--text-muted)] mt-1">
                        {r.todayEntries} entries • {r.todayRevenue.toLocaleString()} TZS today
                      </div>
                    </div>
                    <button onClick={() => deleteRoom(r.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
                  <input type="password" placeholder="Temporary password" required value={sponsorPassword} onChange={e => setSponsorPassword(e.target.value)}
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
                  <div key={s.id} className="flex justify-between items-center bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                    <div>
                      <span className="font-bold text-[#A78BFA]">{s.name}</span>
                      <div className="text-xs text-[var(--text-muted)]">@{s.username} • {s.profitSharePercent}% profit share</div>
                      <div className="text-xs font-mono text-[var(--text-muted)] mt-1">{s.amountSponsored.toLocaleString()} TZS sponsored</div>
                    </div>
                    <button onClick={() => deleteSponsor(s.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
