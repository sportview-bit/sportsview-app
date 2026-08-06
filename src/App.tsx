// src/App.tsx
import { useState } from 'react';
import { ManagerDashboard } from './components/Manager/ManagerDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserDashboard } from './components/User/UserDashboard';
import type { Match, User, Room } from './types';

export default function App() {
  const [activeRole, setActiveRole] = useState<'user' | 'manager' | 'admin'>('user');

  // Shared Database State
  const [matches, setMatches] = useState<Match[]>([]);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'RM-1001',
      roomName: 'Main Stadium View',
      managerName: 'John Deo',
      location: 'Dar es Salaam',
      todayEntries: 145,
      todayRevenue: 145000,
    }
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <div>
      {/* Top Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center gap-4 text-sm text-slate-300">
        <span className="font-bold text-white">App Menu:</span>
        <button
          onClick={() => setActiveRole('user')}
          className={`px-4 py-1.5 rounded-md font-semibold transition ${activeRole === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          Fan App (Users)
        </button>
        <button
          onClick={() => setActiveRole('manager')}
          className={`px-4 py-1.5 rounded-md font-semibold transition ${activeRole === 'manager' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          Room Manager
        </button>
        <button
          onClick={() => setActiveRole('admin')}
          className={`px-4 py-1.5 rounded-md font-semibold transition ${activeRole === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          Main Admin
        </button>
      </div>

      {/* Screens */}
      {activeRole === 'user' && (
        <UserDashboard matches={matches} user={currentUser} setUser={setCurrentUser} />
      )}

      {activeRole === 'manager' && (
        <ManagerDashboard rooms={rooms} />
      )}

      {activeRole === 'admin' && (
        <AdminDashboard matches={matches} setMatches={setMatches} rooms={rooms} setRooms={setRooms} />
      )}
    </div>
  );
}