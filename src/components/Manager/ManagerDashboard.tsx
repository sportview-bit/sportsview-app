// src/components/Manager/ManagerDashboard.tsx
import React, { useState } from 'react';
import { Users, Wallet, CreditCard } from 'lucide-react';
import type { Room } from '../../types';

interface ManagerProps {
  rooms: Room[];
}

export const ManagerDashboard: React.FC<ManagerProps> = ({ rooms }) => {
  // Simulate a manager logging in by picking their room
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');

  // Find the real room data from the state
  const myRoom = rooms.find(r => r.id === selectedRoomId);

  if (rooms.length === 0) {
    return (
      <div className="p-6 bg-slate-950 text-white min-h-screen flex items-center justify-center">
        <p className="text-slate-400">No rooms exist yet. The Admin needs to create one.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      {/* Header & Room Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">Manager View</h1>
          <p className="text-slate-400 mt-1">Welcome back. Here are your room details.</p>
        </div>

        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
          <label className="text-xs text-slate-400 mr-2">Select Your Room:</label>
          <select
            value={selectedRoomId}
            onChange={e => setSelectedRoomId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white p-1 rounded outline-none focus:border-emerald-500"
          >
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.roomName} (ID: {r.id})</option>
            ))}
          </select>
        </div>
      </div>

      {myRoom ? (
        <>
          {/* Main Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl"><Users className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-slate-400">Total People Entered Today</p>
                <h3 className="text-3xl font-bold text-white">{myRoom.todayEntries}</h3>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl"><Wallet className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-slate-400">Money Collected Today</p>
                <h3 className="text-3xl font-bold text-emerald-400">{myRoom.todayRevenue.toLocaleString()} TZS</h3>
              </div>
            </div>
          </div>

          {/* Hardware Scanner Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Door Scanner Status
            </h2>
            <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800 w-fit">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-300">Scanner is ACTIVE and ready for fans.</span>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              When fans scan their QR code or physical card at the door, their 1,000 TZS fee will automatically be deducted and show up here.
            </p>
          </div>
        </>
      ) : (
        <p className="text-red-400">Room data not found.</p>
      )}
    </div>
  );
};