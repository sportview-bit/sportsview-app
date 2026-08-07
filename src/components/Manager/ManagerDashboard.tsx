// src/components/Manager/ManagerDashboard.tsx
import React from 'react';
import { Users, Wallet, CreditCard, LogOut } from 'lucide-react';
import type { Manager, Room } from '../../types';

interface ManagerProps {
  manager: Manager;
  room: Room | null;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onExit: () => void;
}

export const ManagerDashboard: React.FC<ManagerProps> = ({ manager, room, setRooms, onExit }) => {
  // Simulates a fan scanning in at the door — 1,000 TZS per entry.
  // Swap this for a real scanner-device event once hardware is ready; the
  // room-update logic underneath stays the same.
  const simulateEntry = () => {
    if (!room) return;
    setRooms(prev =>
      prev.map(r => r.id === room.id
        ? { ...r, todayEntries: r.todayEntries + 1, todayRevenue: r.todayRevenue + 1000 }
        : r
      )
    );
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-[#8B98A8] mb-4">Your account isn't linked to a room yet — contact the admin.</p>
          <button onClick={onExit} className="text-sm text-[#34D399] hover:underline">Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F6F9] p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#232D3A] pb-5 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#34D399] mb-1">Room Manager • {manager.name}</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{room.roomName}</h1>
          <p className="text-[#8B98A8] mt-1 text-sm">{room.location}</p>
        </div>
        <button onClick={onExit} className="flex items-center gap-2 text-sm text-[#8B98A8] hover:text-[#FF5468] transition">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#F2B705]/10 text-[#F2B705] rounded-xl"><Users className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[#8B98A8]">Total People Entered Today</p>
            <h3 className="text-3xl font-bold font-mono">{room.todayEntries}</h3>
          </div>
        </div>

        <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[#34D399]/10 text-[#34D399] rounded-xl"><Wallet className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-[#8B98A8]">Money Collected Today</p>
            <h3 className="text-3xl font-bold text-[#34D399] font-mono">{room.todayRevenue.toLocaleString()} TZS</h3>
          </div>
        </div>
      </div>

      <div className="bg-[#121821] border border-[#232D3A] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#34D399]" />
          Door Scanner
        </h2>
        <div className="flex items-center gap-3 bg-[#0B0F14] p-4 rounded-lg border border-[#232D3A] w-fit mb-4">
          <div className="w-3 h-3 bg-[#34D399] rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-[#F3F6F9]">Scanner is ACTIVE and ready for fans.</span>
        </div>
        <p className="text-xs text-[#8B98A8] mb-4">
          When fans scan their QR code or physical card at the door, their 1,000 TZS fee is deducted and shows up here.
          Hardware isn't wired up yet — use the button below to simulate a scan.
        </p>
        <button onClick={simulateEntry} className="bg-[#34D399] hover:brightness-110 text-[#0B0F14] font-bold px-6 py-2.5 rounded-lg transition">
          Simulate a fan entry (+1,000 TZS)
        </button>
      </div>
    </div>
  );
};
