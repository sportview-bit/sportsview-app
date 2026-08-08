// src/components/User/UserDashboard.tsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, Smartphone, CalendarDays, ScanLine, ArrowLeft } from 'lucide-react';
import type { Match, User } from '../../types';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';

interface UserProps {
  matches: Match[];
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  onBack: () => void;
}

// Shared background layer — the photo shows through the gaps between cards,
// never behind actual content (every card below has its own solid surface
// color, so text stays fully readable regardless of what's behind it).
const PageBackground: React.FC = () => (
  <>
    <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/background.jpg')" }} />
    <div className="fixed inset-0 bg-[var(--bg)]/85 -z-10" />
  </>
);

export const UserDashboard: React.FC<UserProps> = ({ matches, user, setUser, onBack }) => {
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

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6">
        <PageBackground />
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <SettingsMenu />
          </div>
          <Brand size="sm" />
          <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl mt-6">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Join SportsView</h2>
            <p className="text-[var(--text-muted)] text-sm mb-6">Create your account to get your digital stadium card.</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm text-[var(--text-muted)]">Full Name</label>
                <input type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 text-[var(--text)] focus:border-[#F2B705] outline-none transition" placeholder="e.g. Juma Rashid" />
              </div>
              <div>
                <label className="text-sm text-[var(--text-muted)]">Phone Number (For USSD)</label>
                <input type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 text-[var(--text)] focus:border-[#F2B705] outline-none transition" placeholder="07XX XXX XXX" />
              </div>
              <button type="submit" className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-3 rounded-lg transition mt-4">
                Create Account & Get Card
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6">
      <PageBackground />

      <div className="flex justify-between items-start mb-8 border-b border-[var(--border)] pb-4 gap-4">
        <div>
          <div className="mb-2">
            <Brand size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome, {user.name}
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Digital ID: {user.id}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <SettingsMenu />
          <button onClick={onBack} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition">Exit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-24 h-24" /></div>
            <p className="text-sm font-semibold text-[var(--text-muted)]">Available Balance</p>
            <h3 className="text-4xl font-bold text-[#F2B705] mt-2 font-mono">{user.balance.toLocaleString()} TZS</h3>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-[#34D399]" /> Add Money</h3>
            <form onSubmit={handleTopUp} className="flex gap-2">
              <input type="number" required value={topupAmount} onChange={e => setTopupAmount(e.target.value)} placeholder="Amount (TZS)"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 outline-none focus:border-[#34D399] transition" />
              <button type="submit" disabled={paying} className="bg-[#34D399] hover:brightness-110 disabled:opacity-50 px-4 py-2 rounded-lg font-bold text-[#0B0F14] transition">
                {paying ? '...' : 'Pay'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl flex flex-col items-center justify-center">
          <h3 className="font-bold mb-2 flex items-center gap-2"><ScanLine className="w-5 h-5" /> Your Access Card</h3>
          <p className="text-xs text-[var(--text-muted)] mb-6 text-center">Scan at the door. Entry costs 1,000 TZS.</p>
          <div className="bg-white p-3 rounded-xl">
            <QRCodeSVG value={JSON.stringify({ uid: user.id, card: user.cardHash })} size={180} level="H" />
          </div>
          <div className="mt-6 text-center w-full bg-[var(--bg)] py-2 rounded-lg font-mono text-xs text-[var(--text-muted)]">
            Physical Hash: {user.cardHash}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-[#F2B705]"><CalendarDays className="w-5 h-5" /> Upcoming Matches</h3>
          {matches.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No matches posted yet.</p>
          ) : (
            <div className="space-y-3">
              {matches.map(m => (
                <div key={m.id} className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{m.homeTeam} vs {m.awayTeam}</span>
                    <span className="text-[#34D399] font-bold text-sm font-mono">{m.entryFee} TZS</span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{m.matchTime}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};