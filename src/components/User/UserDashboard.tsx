// src/components/User/UserDashboard.tsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, Smartphone, CalendarDays, ScanLine } from 'lucide-react';
import type { Match, User } from '../../types';

interface UserProps {
  matches: Match[];
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserDashboard: React.FC<UserProps> = ({ matches, user, setUser }) => {
  // Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [topupAmount, setTopupAmount] = useState('');
  const [paying, setPaying] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: regName,
      phone: regPhone,
      cardHash: `PHYSICAL-CARD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      balance: 0,
    };
    setUser(newUser);
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || !user) return;
    setPaying(true);

    setTimeout(() => {
      setUser({ ...user, balance: user.balance + parseInt(topupAmount) });
      setTopupAmount('');
      setPaying(false);
      alert('USSD Payment Successful via MalipoPay!');
    }, 1500);
  };

  // If not logged in, show registration form
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-6">
        <div className="bg-[#121821] border border-[#232D3A] p-8 rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Join SportsView</h2>
          <p className="text-[#8B98A8] text-sm mb-6">Create your account to get your digital stadium card.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-[#8B98A8]">Full Name</label>
              <input type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-3 mt-1 text-white focus:border-[#F2B705] outline-none transition" placeholder="e.g. Juma Rashid" />
            </div>
            <div>
              <label className="text-sm text-[#8B98A8]">Phone Number (For USSD)</label>
              <input type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-3 mt-1 text-white focus:border-[#F2B705] outline-none transition" placeholder="07XX XXX XXX" />
            </div>
            <button type="submit" className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-3 rounded-lg transition mt-4">
              Create Account & Get Card
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in, show dashboard
  return (
    <div className="p-6 bg-[#0B0F14] text-[#F3F6F9] min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-[#232D3A] pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F2B705] mb-1">Fan</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome, {user.name}</h1>
          <p className="text-[#8B98A8] text-sm">Digital ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallet & Topup */}
        <div className="space-y-6">
          <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-24 h-24" /></div>
            <p className="text-sm font-semibold text-[#8B98A8]">Available Balance</p>
            <h3 className="text-4xl font-bold text-[#F2B705] mt-2 font-mono">{user.balance.toLocaleString()} TZS</h3>
          </div>

          <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl">
             <h3 className="font-bold mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-[#34D399]"/> Add Money</h3>
             <form onSubmit={handleTopUp} className="flex gap-2">
               <input type="number" required value={topupAmount} onChange={e => setTopupAmount(e.target.value)} placeholder="Amount (TZS)"
                 className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-2 outline-none focus:border-[#34D399] transition" />
               <button type="submit" disabled={paying} className="bg-[#34D399] hover:brightness-110 disabled:opacity-50 px-4 py-2 rounded-lg font-bold text-[#0B0F14] transition">
                 {paying ? '...' : 'Pay'}
               </button>
             </form>
          </div>
        </div>

        {/* Digital QR Card */}
        <div className="bg-gradient-to-br from-[#121821] to-[#1A222C] border border-[#232D3A] p-6 rounded-2xl flex flex-col items-center justify-center">
          <h3 className="font-bold mb-2 flex items-center gap-2"><ScanLine className="w-5 h-5 text-white"/> Your Access Card</h3>
          <p className="text-xs text-[#8B98A8] mb-6 text-center">Scan at the door. Entry costs 1,000 TZS.</p>

          <div className="bg-white p-3 rounded-xl">
            <QRCodeSVG value={JSON.stringify({ uid: user.id, card: user.cardHash })} size={180} level="H" />
          </div>

          <div className="mt-6 text-center w-full bg-[#0B0F14] py-2 rounded-lg font-mono text-xs text-[#8B98A8]">
            Physical Hash: {user.cardHash}
          </div>
        </div>

        {/* Live Matches Feed */}
        <div className="bg-[#121821] border border-[#232D3A] p-6 rounded-2xl">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-[#F2B705]"><CalendarDays className="w-5 h-5"/> Upcoming Matches</h3>
          {matches.length === 0 ? (
            <p className="text-sm text-[#8B98A8]">No matches posted yet.</p>
          ) : (
            <div className="space-y-3">
              {matches.map(m => (
                <div key={m.id} className="bg-[#0B0F14] p-4 rounded-lg border border-[#232D3A]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{m.homeTeam} vs {m.awayTeam}</span>
                    <span className="text-[#34D399] font-bold text-sm font-mono">{m.entryFee} TZS</span>
                  </div>
                  <div className="text-xs text-[#8B98A8]">{m.matchTime}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};