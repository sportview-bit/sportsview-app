// src/components/Admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { CalendarPlus, Trash2, Building2 } from 'lucide-react';
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

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      <div className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage everything on your platform</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Total Money Collected Today</p>
          <h2 className="text-2xl font-bold text-emerald-400">{totalMoney.toLocaleString()} TZS</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ADD MATCH SECTION */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400"><CalendarPlus className="w-5 h-5" /> Add a Match</h2>
            <form onSubmit={handlePostMatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Home Team" required value={homeTeam} onChange={e => setHomeTeam(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
                <input type="text" placeholder="Away Team" required value={awayTeam} onChange={e => setAwayTeam(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              </div>
              <input type="text" placeholder="Time (e.g. Sat, 16:00)" required value={matchTime} onChange={e => setMatchTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-2 rounded-lg">Post Match to Users</button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4 text-white">Live Matches</h2>
            <div className="space-y-2">
              {matches.length === 0 && <p className="text-slate-500 text-sm">No matches added yet.</p>}
              {matches.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="font-bold">{m.homeTeam} vs {m.awayTeam}</span>
                    <div className="text-xs text-slate-400">{m.matchTime} • Fee: {m.entryFee} TZS</div>
                  </div>
                  <button onClick={() => deleteMatch(m.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ADD ROOM MANAGER SECTION */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><Building2 className="w-5 h-5" /> Add Room & Manager</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <input type="text" placeholder="Room Name (e.g. VIP Area)" required value={roomName} onChange={e => setRoomName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500" />
              <input type="text" placeholder="Manager Name" required value={managerName} onChange={e => setManagerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500" />
              <input type="text" placeholder="Location" required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-2 rounded-lg">Register Manager</button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4 text-white">All Rooms & Managers</h2>
            <div className="space-y-2">
              {rooms.map(r => (
                <div key={r.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="font-bold text-emerald-400">{r.roomName}</span>
                    <div className="text-xs text-slate-400">Manager: {r.managerName} • {r.location}</div>
                  </div>
                  <button onClick={() => deleteRoom(r.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition">
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