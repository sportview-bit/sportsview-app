// src/components/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  title: string;
  subtitle: string;
  accentColor: string;
  icon: React.ReactNode;
  onBack: () => void;
  /** Return an error message string to reject the attempt, or null to accept it. */
  onSubmit: (username: string, password: string) => string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ title, subtitle, accentColor, icon, onBack, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = onSubmit(username, password);
    setError(err ?? '');
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F6F9] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#8B98A8] hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-[#121821] border border-[#232D3A] rounded-2xl p-8">
          <div className="mb-4" style={{ color: accentColor }}>{icon}</div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
          <p className="text-sm text-[#8B98A8] mb-6">{subtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#8B98A8]">Username</label>
              <input
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-3 mt-1 outline-none focus:border-current transition text-white"
                style={{ caretColor: accentColor }}
              />
            </div>
            <div>
              <label className="text-xs text-[#8B98A8]">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#232D3A] rounded-lg px-4 py-3 mt-1 outline-none focus:border-current transition text-white"
                style={{ caretColor: accentColor }}
              />
            </div>
            {error && <p className="text-sm text-[#FF5468]">{error}</p>}
            <button type="submit" className="w-full font-bold py-3 rounded-lg transition hover:brightness-110" style={{ background: accentColor, color: '#0B0F14' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
