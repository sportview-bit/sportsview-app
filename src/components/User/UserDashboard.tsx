// src/components/User/UserDashboard.tsx
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, Smartphone, CalendarDays, ScanLine, ArrowLeft, LogOut } from 'lucide-react';
import type { Match, User } from '../../types';
import { api } from '../../services/api';
import { SettingsMenu } from '../Shared/SettingsMenu';
import { Brand } from '../Shared/Brand';

interface UserProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  onBack: () => void;
  onLogout: () => void;
}

// Fixed dark scrim regardless of theme, so the background photo always
// reads the same way — switching to light mode changes the UI, not the photo.
const PageBackground: React.FC = () => (
  <>
    <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/background.jpg')" }} />
    <div className="fixed inset-0 -z-10" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />
  </>
);

const PHONE_REGEX = /^\d{10}$/;

export const UserDashboard: React.FC<UserProps> = ({ user, setUser, onBack, onLogout }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [mode, setMode] = useState<'login' | 'register'>('register');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  const [topupAmount, setTopupAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.getMatches().then(setMatches).catch(() => {}); }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!PHONE_REGEX.test(regPhone)) {
      setError('Phone number must be exactly 10 digits, e.g. 0712345678');
      return;
    }
    setBusy(true);
    try {
      const newUser = await api.registerUser(regName, regPhone, regEmail);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your card');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!PHONE_REGEX.test(loginPhone)) {
      setError('Phone number must be exactly 10 digits, e.g. 0712345678');
      return;
    }
    setBusy(true);
    try {
      const found = await api.loginUser(loginPhone);
      setUser(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || !user) return;
    setBusy(true);
    try {
      const updated = await api.topUp(user.id, parseInt(topupAmount, 10));
      setUser(updated);
      setTopupAmount('');
    } finally {
      setBusy(false);
    }
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
            <div className="flex gap-2 mb-6 border-b border-[var(--border)]">
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${mode === 'register' ? 'border-[#F2B705] text-[#F2B705]' : 'border-transparent text-[var(--text-muted)]'}`}
              >
                Join
              </button>
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${mode === 'login' ? 'border-[#F2B705] text-[#F2B705]' : 'border-transparent text-[var(--text-muted)]'}`}
              >
                Log In
              </button>
            </div>

            {mode === 'register' ? (
              <>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Join SportsView</h2>
                <p className="text-[var(--text-muted)] text-sm mb-6">Create your account to get your digital stadium card.</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Full Name</label>
                    <input type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 text-[var(--text)] focus:border-[#F2B705] outline-none transition" placeholder="e.g. Juma Rashid" />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Phone Number (10 digits)</label>
                    <input type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 text-[var(--text)] focus:border-[#F2B705] outline-none transition" placeholder="0712345678" />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Email</label>
                    <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 text-[var(--text)] focus:border-[#F2B705] outline-none transition" placeholder="you@example.com" />
                  </div>
                  {error && <p className="text-sm text-[#FF5468]">{error}</p>}
                  <button disabled={busy} type="submit" className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-3 rounded-lg transition mt-4 disabled:opacity-50">
                    {busy ? 'Creating…' : 'Create Account & Get Card'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Welcome back</h2>
                <p className="text-[var(--text-muted)] text-sm mb-6">Enter your phone number to access your card.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Phone Number (10 digits)</label>
                    <input type="tel" required value={loginPhone} onChange={e => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 mt-1 text-[var(--text)] focus:border-[#F2B705] outline-none transition" placeholder="0712345678" />
                  </div>
                  {error && <p className="text-sm text-[#FF5468]">{error}</p>}
                  <button disabled={busy} type="submit" className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-3 rounded-lg transition mt-4 disabled:opacity-50">
                    {busy ? 'Checking…' : 'Log In'}
                  </button>
                </form>
              </>
            )}
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
          <div className="mb-2"><Brand size="sm" /></div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Welcome, {user.name}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Digital ID: {user.id}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <SettingsMenu />
          <button onClick={onLogout} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[#FF5468] transition">
            <LogOut className="w-4 h-4" /> Log out
          </button>
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
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 outline-none focus:border-[#34D399] transition text-[var(--text)]" />
              <button type="submit" disabled={busy} className="bg-[#34D399] hover:brightness-110 disabled:opacity-50 px-4 py-2 rounded-lg font-bold text-[#0B0F14] transition">
                {busy ? '...' : 'Pay'}
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