// src/App.tsx
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Building2, Users, Handshake, ArrowLeft, Lock } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LoginScreen } from './components/Auth/LoginScreen';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ManagerDashboard } from './components/Manager/ManagerDashboard';
import { ManagerRegisterScreen, type ManagerRegistrationInput } from './components/Manager/ManagerRegisterScreen';
import { SponsorDashboard } from './components/Sponsor/SponsorDashboard';
import { UserDashboard } from './components/User/UserDashboard';
import { SettingsMenu } from './components/Shared/SettingsMenu';
import { Brand } from './components/Shared/Brand';
import type { Match, Room, Manager, Sponsor, User } from './types';

type View = 'landing' | 'staff' | 'admin' | 'manager' | 'sponsor' | 'user';
type ManagerScreen = 'login' | 'register';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const STAFF_HASH = '#staff';

const isStaffDomain = () => {
  const host = window.location.hostname;
  return host.includes('onrender.com') || host === 'localhost' || host === '127.0.0.1';
};

const Shell: React.FC = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<View>(() => (isStaffDomain() && window.location.hash === STAFF_HASH ? 'staff' : 'landing'));
  const [managerScreen, setManagerScreen] = useState<ManagerScreen>('login');

  const [matches, setMatches] = useState<Match[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [activeSponsorId, setActiveSponsorId] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      if (isStaffDomain() && window.location.hash === STAFF_HASH) setView('staff');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goHome = () => {
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setManagerScreen('login');
    setView('landing');
  };

  const handleManagerRegister = (data: ManagerRegistrationInput): string | null => {
    if (managers.some(m => m.username === data.username)) {
      return 'That username is already taken.';
    }
    const managerId = `MGR-${Math.floor(1000 + Math.random() * 9000)}`;
    const roomId = `RM-${Math.floor(1000 + Math.random() * 9000)}`;
    setManagers(prev => [...prev, {
      id: managerId, name: data.name, phone: data.phone, email: data.email,
      username: data.username, password: data.password, roomId, status: 'pending',
    }]);
    setRooms(prev => [...prev, {
      id: roomId, roomName: data.roomName, location: data.location, managerId,
      todayEntries: 0, todayRevenue: 0,
    }]);
    return null;
  };

  if (view === 'admin') {
    if (!isAdmin) {
      return (
        <LoginScreen
          title={t('adminLoginTitle')}
          subtitle={t('adminLoginSubtitle')}
          accentColor="#F2B705"
          icon={<ShieldCheck className="w-8 h-8" />}
          onBack={() => setView('staff')}
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
      if (managerScreen === 'register') {
        return (
          <ManagerRegisterScreen
            onBack={() => setManagerScreen('login')}
            onSubmit={handleManagerRegister}
          />
        );
      }
      return (
        <LoginScreen
          title={t('managerLoginTitle')}
          subtitle={t('managerLoginSubtitle')}
          accentColor="#34D399"
          icon={<Building2 className="w-8 h-8" />}
          onBack={() => setView('staff')}
          onSubmit={(u, p) => {
            const found = managers.find(m => m.username === u && m.password === p);
            if (!found) return 'Invalid username or password';
            if (found.status !== 'approved') return t('pendingApprovalError');
            setActiveManagerId(found.id);
            return null;
          }}
          footer={
            <button onClick={() => setManagerScreen('register')} className="text-sm text-[#34D399] hover:underline">
              {t('newManagerQuestion')} {t('registerAsManager')}
            </button>
          }
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
          onBack={() => setView('staff')}
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

  if (view === 'staff' && isStaffDomain()) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col p-6">
        <div className="flex items-center justify-between mb-10">
          <Brand size="sm" />
          <SettingsMenu />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl w-full text-center">
            <button onClick={goHome} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition mx-auto mb-8">
              <ArrowLeft className="w-4 h-4" /> {t('back')}
            </button>
            <p className="uppercase tracking-[0.25em] text-xs text-[var(--text-muted)] mb-2 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" /> {t('staffPortal')}
            </p>
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>{t('staffPortalDesc')}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
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
      </div>
    );
  }

  // Landing — full-bleed stadium photo behind a centered welcome card.
  return (
    <div className="min-h-screen relative flex flex-col p-6 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }} />
      {/* Dark scrim so text and the card stay readable over any photo */}
      <div className="absolute inset-0 bg-[var(--bg)]/80" />

      <div className="relative z-10 flex items-center justify-between mb-16">
        <Brand size="sm" />
        <SettingsMenu />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-[var(--surface)]/90 backdrop-blur border border-[var(--border)] rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#F2B705] flex items-center justify-center">
            <Users className="w-8 h-8 text-[#0B0F14]" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {t('welcome')} <span className="text-[#F2B705]">SPORTSVIEWTZ</span>
          </h1>
          <p className="text-[var(--text-muted)] mb-8">{t('chooseAccess')}</p>

          <button
            onClick={() => setView('user')}
            className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 text-lg"
          >
            <Users className="w-5 h-5" /> {t('fan')}
          </button>
          <p className="text-sm text-[var(--text-muted)] mt-3">{t('fanDesc')}</p>
        </div>
      </div>

      {isStaffDomain() && (
        <button
          onClick={() => setView('staff')}
          className="relative z-10 mt-16 mx-auto text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition flex items-center gap-1.5"
        >
          <Lock className="w-3 h-3" /> {t('staffLink')}
        </button>
      )}
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