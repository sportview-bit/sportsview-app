// src/App.tsx
import React, { useState } from 'react';
import { ShieldCheck, Building2, Users, Handshake } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LoginScreen } from './components/Auth/LoginScreen';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ManagerDashboard } from './components/Manager/ManagerDashboard';
import { SponsorDashboard } from './components/Sponsor/SponsorDashboard';
import { UserDashboard } from './components/User/UserDashboard';
import { SettingsMenu } from './components/Shared/SettingsMenu';
import { Brand } from './components/Shared/Brand';
import type { Match, Room, Manager, Sponsor, User } from './types';

type View = 'landing' | 'admin' | 'manager' | 'sponsor' | 'user';

// Mock-only superadmin credentials. There's only ever one Super Admin account,
// so unlike Manager/Sponsor it isn't stored in a list — swap this for real
// auth before this touches real money.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const Shell: React.FC = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<View>('landing');

  // All platform data lives here for now. In production this belongs in a database.
  const [matches, setMatches] = useState<Match[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [activeSponsorId, setActiveSponsorId] = useState<string | null>(null);

  const goHome = () => setView('landing');

  if (view === 'admin') {
    if (!isAdmin) {
      return (
        <LoginScreen
          title={t('adminLoginTitle')}
          subtitle={t('adminLoginSubtitle')}
          accentColor="#F2B705"
          icon={<ShieldCheck className="w-8 h-8" />}
          onBack={goHome}
          onSubmit={(u, p) => {
            if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
              setIsAdmin(true);
              return null;
            }
            return 'Invalid username or password';
          }}
        />
      );
    }
    return (
      <AdminDashboard
        matches={matches}
        setMatches={setMatches}
        rooms={rooms}
        setRooms={setRooms}
        managers={managers}
        setManagers={setManagers}
        sponsors={sponsors}
        setSponsors={setSponsors}
        onExit={() => {
          setIsAdmin(false);
          goHome();
        }}
      />
    );
  }

  if (view === 'manager') {
    const activeManager = managers.find(m => m.id === activeManagerId) || null;
    if (!activeManager) {
      return (
        <LoginScreen
          title={t('managerLoginTitle')}
          subtitle={t('managerLoginSubtitle')}
          accentColor="#34D399"
          icon={<Building2 className="w-8 h-8" />}
          onBack={goHome}
          onSubmit={(u, p) => {
            const found = managers.find(m => m.username === u && m.password === p);
            if (found) {
              setActiveManagerId(found.id);
              return null;
            }
            return 'Invalid username or password';
          }}
        />
      );
    }
    const myRoom = rooms.find(r => r.managerId === activeManager.id) || null;
    return (
      <ManagerDashboard
        manager={activeManager}
        room={myRoom}
        setRooms={setRooms}
        onExit={() => {
          setActiveManagerId(null);
          goHome();
        }}
      />
    );
  }

  if (view === 'sponsor') {
    const activeSponsor = sponsors.find(s => s.id === activeSponsorId) || null;
    if (!activeSponsor) {
      return (
        <LoginScreen
          title={t('sponsorLoginTitle')}
          subtitle={t('sponsorLoginSubtitle')}
          accentColor="#A78BFA"
          icon={<Handshake className="w-8 h-8" />}
          onBack={goHome}
          onSubmit={(u, p) => {
            const found = sponsors.find(s => s.username === u && s.password === p);
            if (found) {
              setActiveSponsorId(found.id);
              return null;
            }
            return 'Invalid username or password';
          }}
        />
      );
    }
    return (
      <SponsorDashboard
        sponsor={activeSponsor}
        rooms={rooms}
        onExit={() => {
          setActiveSponsorId(null);
          goHome();
        }}
      />
    );
  }

  if (view === 'user') {
    return <UserDashboard matches={matches} user={user} setUser={setUser} onBack={goHome} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <SettingsMenu />
      </div>

      <div className="max-w-4xl w-full text-center">
        <Brand size="lg" />
        <p className="text-[var(--text-muted)] mb-10">{t('chooseAccess')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => setView('user')} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--text)] transition text-left">
            <Users className="w-6 h-6 mb-3" />
            <div className="font-bold">{t('fan')}</div>
            <div className="text-sm text-[var(--text-muted)]">{t('fanDesc')}</div>
          </button>
          <button onClick={() => setView('manager')} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#34D399] transition text-left">
            <Building2 className="w-6 h-6 text-[#34D399] mb-3" />
            <div className="font-bold">{t('manager')}</div>
            <div className="text-sm text-[var(--text-muted)]">{t('managerDesc')}</div>
          </button>
          <button onClick={() => setView('sponsor')} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#A78BFA] transition text-left">
            <Handshake className="w-6 h-6 text-[#A78BFA] mb-3" />
            <div className="font-bold">{t('sponsor')}</div>
            <div className="text-sm text-[var(--text-muted)]">{t('sponsorDesc')}</div>
          </button>
          <button onClick={() => setView('admin')} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#F2B705] transition text-left">
            <ShieldCheck className="w-6 h-6 text-[#F2B705] mb-3" />
            <div className="font-bold">{t('admin')}</div>
            <div className="text-sm text-[var(--text-muted)]">{t('adminDesc')}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
