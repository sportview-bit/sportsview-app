// src/components/Admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { CalendarPlus, Trash2, Building2, ShieldCheck, Radio } from 'lucide-react';
import type { Match, Room } from '../../types';

interface AdminProps {
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

export const AdminDashboard: React.FC<AdminProps> = ({ matches, setMatches, rooms, setRooms }) => {
  // Form states for Match
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchTime, setMatchTime] = useState('');

  // Form states for Room
  const [roomName, setRoomName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [location, setLocation] = useState('');

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
    const newRoom: Room = {
      id: `RM-${Math.floor(1000 + Math.random() * 9000)}`,
      roomName, managerName, location,
      todayEntries: 0, todayRevenue: 0,
    };
    setRooms([...rooms, newRoom]);
    setRoomName(''); setManagerName(''); setLocation('');
  };

  const deleteMatch = (id: string) => setMatches(matches.filter(m => m.id !== id));
  const deleteRoom = (id: string) => setRooms(rooms.filter(r => r.id !== id));

  const totalMoney = rooms.reduce((sum, room) => sum + room.todayRevenue, 0);
  const totalEntries = rooms.reduce((sum, room) => sum + room.todayEntries, 0);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F6F9] p-6">
      {/* Header */}
      <div className="mb-8 border-b border-[#232D3A] pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F2B705] flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4" /> Super Admin
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Dashboard</h1>
          <p className="text-[#8B98A8] mt-1 text-sm">Everything on the platform, in one place</p>
        </div>

        {/* Live scoreboard strip */}
        <div className="flex gap-3">
          <div className="bg-[#121821] border border-[#232D3A] rounded-xl px-5 py-3 text-center">
            <p className="text-[10px] text-[#8B98A8] uppercase tracking-wider">Rooms</p>
            <p className="text-xl font-bold font-mono">{rooms.length}</p>
          </div>
          <div className="bg-[#121821] border border-[#232D3A] rounded-xl px-5 py-3 text-center">
            <p className="text-[10px] text-[#8B98A8] uppercase tracking-wider">Entries Today</p>
            <p className="text-xl font-bold font-mono">{totalEntries}</p>
          </div>
          <div className="bg-[#121821] border border-[#232D3A] rounded-xl px-5 py-3 text-center">
            <p className="text-[10px] text-[#8B98A8] uppercase tracking-wider">Revenue Today</p>
            <p className="text-xl font-bold font-mono text-[#34D399]">{totalMoney.toLocaleString()} TZS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ADD MATCH SECTION */}
        <div className="space-y-6">
          <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#F2B705]">
              <CalendarPlus className="w-5 h-5" /> Add a Match
            </h2>
            <form onSubmit={handlePostMatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Home Team" required value={homeTeam} onChange={e => setHomeTeam(e.target.value)}
                  className="bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 text-white outline-none focus:border-[#F2B705] transition" />
                <input type="text" placeholder="Away Team" required value={awayTeam} onChange={e => setAwayTeam(e.target.value)}
                  className="bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 text-white outline-none focus:border-[#F2B705] transition" />
              </div>
              <input type="text" placeholder="Time (e.g. Sat, 16:00)" required value={matchTime} onChange={e => setMatchTime(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 text-white outline-none focus:border-[#F2B705] transition" />
              <button type="submit" className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-2.5 rounded-lg transition">
                Post Match to Users
              </button>
            </form>
          </div>

          <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#FF5468]" /> Live Matches
            </h2>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {matches.length === 0 && <p className="text-[#8B98A8] text-sm">No matches added yet.</p>}
              {matches.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-[#0B0F14] p-3 rounded-lg border border-[#232D3A]">
                  <div>
                    <span className="font-bold">{m.homeTeam} vs {m.awayTeam}</span>
                    <div className="text-xs text-[#8B98A8]">{m.matchTime} • Fee: {m.entryFee} TZS</div>
                  </div>
                  <button onClick={() => deleteMatch(m.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ADD ROOM MANAGER SECTION */}
        <div className="space-y-6">
          <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#34D399]">
              <Building2 className="w-5 h-5" /> Add Room & Manager
            </h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <input type="text" placeholder="Room Name (e.g. VIP Area)" required value={roomName} onChange={e => setRoomName(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 text-white outline-none focus:border-[#34D399] transition" />
              <input type="text" placeholder="Manager Name" required value={managerName} onChange={e => setManagerName(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 text-white outline-none focus:border-[#34D399] transition" />
              <input type="text" placeholder="Location" required value={location} onChange={e => setLocation(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 text-white outline-none focus:border-[#34D399] transition" />
              <button type="submit" className="w-full bg-[#34D399] hover:brightness-110 text-[#0B0F14] font-bold py-2.5 rounded-lg transition">
                Register Manager
              </button>
            </form>
          </div>

          <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">All Rooms & Managers</h2>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {rooms.length === 0 && <p className="text-[#8B98A8] text-sm">No rooms registered yet.</p>}
              {rooms.map(r => (
                <div key={r.id} className="flex justify-between items-center bg-[#0B0F14] p-3 rounded-lg border border-[#232D3A]">
                  <div>
                    <span className="font-bold text-[#34D399]">{r.roomName}</span>
                    <div className="text-xs text-[#8B98A8]">Manager: {r.managerName} • {r.location}</div>
                    <div className="text-xs font-mono text-[#8B98A8] mt-1">{r.todayEntries} entries • {r.todayRevenue.toLocaleString()} TZS today</div>
                  </div>
                  <button onClick={() => deleteRoom(r.id)} className="p-2 text-[#FF5468] hover:bg-[#FF5468]/10 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};