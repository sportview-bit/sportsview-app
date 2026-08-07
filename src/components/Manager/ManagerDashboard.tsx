// src/components/Manager/ManagerDashboard.tsx
import React, { useState } from 'react';
import { Users, Wallet, CreditCard, Building2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <Building2 className="w-8 h-8 text-[#8B98A8] mx-auto mb-3" />
          <p className="text-[#8B98A8]">No rooms exist yet. The Admin needs to create one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F6F9] p-6">
      {/* Header & Room Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#232D3A] pb-5 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#34D399] mb-1">Room Manager</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Manager View</h1>
          <p className="text-[#8B98A8] mt-1 text-sm">Welcome back. Here are your room details.</p>
        </div>

        <div className="bg-[#121821] p-2 rounded-lg border border-[#232D3A]">
          <label className="text-xs text-[#8B98A8] mr-2">Select Your Room:</label>
          <select
            value={selectedRoomId}
            onChange={e => setSelectedRoomId(e.target.value)}
            className="bg-[#0B0F14] border border-[#232D3A] text-white p-1.5 rounded outline-none focus:border-[#34D399] transition"
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
            <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl flex items-center gap-4">
              <div className="p-4 bg-[#F2B705]/10 text-[#F2B705] rounded-xl"><Users className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-[#8B98A8]">Total People Entered Today</p>
                <h3 className="text-3xl font-bold font-mono">{myRoom.todayEntries}</h3>
              </div>
            </div>

            <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl flex items-center gap-4">
              <div className="p-4 bg-[#34D399]/10 text-[#34D399] rounded-xl"><Wallet className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-[#8B98A8]">Money Collected Today</p>
                <h3 className="text-3xl font-bold text-[#34D399] font-mono">{myRoom.todayRevenue.toLocaleString()} TZS</h3>
              </div>
            </div>
          </div>

          {/* Hardware Scanner Status */}
          <div className="bg-[#121821] border border-[#232D3A] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#34D399]" />
              Door Scanner Status
            </h2>
            <div className="flex items-center gap-3 bg-[#0B0F14] p-4 rounded-lg border border-[#232D3A] w-fit">
              <div className="w-3 h-3 bg-[#34D399] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#F3F6F9]">Scanner is ACTIVE and ready for fans.</span>
            </div>
            <p className="text-xs text-[#8B98A8] mt-4">
              When fans scan their QR code or physical card at the door, their 1,000 TZS fee will automatically be deducted and show up here.
            </p>
          </div>
        </>
      ) : (
        <p className="text-[#FF5468]">Room data not found.</p>
      )}
    </div>
  );
};