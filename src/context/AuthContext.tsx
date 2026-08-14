import React, { createContext, useContext, useEffect, useState } from 'react';

export type Role = 'admin' | 'manager' | 'sponsor';
export type Session = { token: string; role: Role; name: string; roomName?: string } | null;

interface AuthValue {
  session: Session;
  login: (s: NonNullable<Session>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue>({ session: null, login: () => {}, logout: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session>(() => {
    const raw = localStorage.getItem('svtz_session');
    return raw ? (JSON.parse(raw) as Session) : null;
  });

  useEffect(() => {
    if (session) localStorage.setItem('svtz_session', JSON.stringify(session));
    else localStorage.removeItem('svtz_session');
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, login: setSession, logout: () => setSession(null) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);