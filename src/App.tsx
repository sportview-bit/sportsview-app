// src/App.tsx
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Building2, Users, Handshake, ArrowLeft, Lock } from 'lucide-react';
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

type View = 'landing' | 'staff' | 'admin' | 'manager' | 'sponsor' | 'user';

// Mock-only superadmin credentials. There's only ever one Super Admin account,
// so unlike Manager/Sponsor it isn't stored in a list — swap this for real
// auth before this touches real money.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// The URL fragment that unlocks the staff/partner selection screen. There is
// NO button or link anywhere in the UI that leads here — the only way in is
// typing this directly into the address bar, e.g. yoursite.com/#staff. This
// mirrors how real companies keep internal tools off the public homepage
// (a separate, unlinked URL) rather than a fake-secret button on the page.
const STAFF_HASH = '#staff';

const Shell: React.FC = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<View>(() => (window.location.hash === STAFF_HASH ? 'staff' : 'landing'));

  // All platform data lives here for now. In production this belongs in a database.
  const [matches, setMatches] = useState<Match[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [activeSponsorId, setActiveSponsorId] = useState<string | null>(null);

  // Lets someone reach the staff screen by typing #staff into the address bar
  // at any point, and keeps it in sync if they edit the URL directly.
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === STAFF_HASH) setView('staff');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goHome = () => {
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setView('landing');
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
      return (
        <LoginScreen
          title={t('managerLoginTitle')}
          subtitle={t('managerLoginSubtitle')}
          accentColor="#34D399"
          icon={<Building2 className="w-8 h-8" />}
          onBack={() => setView('staff')}
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

  // Staff/partner access — reachable only by typing #staff into the URL.
  // There is no visible link to this screen anywhere else in the app.
  if (view === 'staff') {
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

  // Landing — a slim, always-visible header (logo, then title, beside it —
  // same pattern as YouTube/Instagram) instead of one big splash logo, plus
  // the single public entry point. No staff/manager/sponsor/admin buttons here.
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col p-6">
      <div className="flex items-center justify-between mb-16">
        <Brand size="sm" />
        <SettingsMenu />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
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