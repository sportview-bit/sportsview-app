// src/App.tsx
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Building2, Users, Handshake, ArrowLeft, Lock } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/Auth/LoginScreen';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ManagerDashboard } from './components/Manager/ManagerDashboard';
import { ManagerRegisterScreen, type ManagerRegistrationInput } from './components/Manager/ManagerRegisterScreen';
import { SponsorDashboard } from './components/Sponsor/SponsorDashboard';
import { UserDashboard } from './components/User/UserDashboard';
import { SettingsMenu } from './components/Shared/SettingsMenu';
import { Brand } from './components/Shared/Brand';
import { api } from './services/api';
import type { User } from './types';

type View = 'landing' | 'staff' | 'admin' | 'manager' | 'sponsor' | 'user';
type ManagerScreen = 'login' | 'register';

const STAFF_HASH = '#staff';

const isStaffDomain = () => {
  const host = window.location.hostname;
  return host.includes('onrender.com') || host === 'localhost' || host === '127.0.0.1';
};

const Shell: React.FC = () => {
  const { t } = useLanguage();
  const { session, login, logout } = useAuth();
  const [view, setView] = useState<View>(() => (isStaffDomain() && window.location.hash === STAFF_HASH ? 'staff' : 'landing'));
  const [managerScreen, setManagerScreen] = useState<ManagerScreen>('login');
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('svtz_fan');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('svtz_fan', JSON.stringify(user));
    else localStorage.removeItem('svtz_fan');
  }, [user]);

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

  const handleManagerRegister = async (data: ManagerRegistrationInput): Promise<string | null> => {
    try {
      await api.managerRegister(data);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Could not submit application';
    }
  };

  if (view === 'admin') {
    if (!session || session.role !== 'admin') {
      return (
        <LoginScreen
          title={t('adminLoginTitle')}
          subtitle={t('adminLoginSubtitle')}
          accentColor="#F2B705"
          icon={<ShieldCheck className="w-8 h-8" />}
          onBack={() => setView('staff')}
          onSubmit={async (u, p) => {
            try {
              const res = await api.adminLogin(u, p);
              login({ token: res.token, role: 'admin', name: res.name });
              return null;
            } catch (err) {
              return err instanceof Error ? err.message : 'Login failed';
            }
          }}
        />
      );
    }
    return <AdminDashboard onExit={() => { logout(); goHome(); }} />;
  }

  if (view === 'manager') {
    if (!session || session.role !== 'manager') {
      if (managerScreen === 'register') {
        return <ManagerRegisterScreen onBack={() => setManagerScreen('login')} onSubmit={handleManagerRegister} />;
      }
      return (
        <LoginScreen
          title={t('managerLoginTitle')}
          subtitle={t('managerLoginSubtitle')}
          accentColor="#34D399"
          icon={<Building2 className="w-8 h-8" />}
          onBack={() => setView('staff')}
          onSubmit={async (u, p) => {
            try {
              const res = await api.managerLogin(u, p);
              login({ token: res.token, role: 'manager', name: res.name, roomName: res.roomName });
              return null;
            } catch (err) {
              return err instanceof Error ? err.message : 'Login failed';
            }
          }}
          footer={
            <button onClick={() => setManagerScreen('register')} className="text-sm text-[#34D399] hover:underline">
              {t('newManagerQuestion')} {t('registerAsManager')}
            </button>
          }
        />
      );
    }
    return <ManagerDashboard onExit={() => { logout(); goHome(); }} />;
  }

  if (view === 'sponsor') {
    if (!session || session.role !== 'sponsor') {
      return (
        <LoginScreen
          title={t('sponsorLoginTitle')}
          subtitle={t('sponsorLoginSubtitle')}
          accentColor="#A78BFA"
          icon={<Handshake className="w-8 h-8" />}
          onBack={() => setView('staff')}
          onSubmit={async (u, p) => {
            try {
              const res = await api.sponsorLogin(u, p);
              login({ token: res.token, role: 'sponsor', name: res.name });
              return null;
            } catch (err) {
              return err instanceof Error ? err.message : 'Login failed';
            }
          }}
        />
      );
    }
    return <SponsorDashboard onExit={() => { logout(); goHome(); }} />;
  }

  if (view === 'user') {
    return (
      <UserDashboard
        user={user}
        setUser={setUser}
        onBack={goHome}
        onLogout={() => { setUser(null); goHome(); }}
      />
    );
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

  // Landing — on the internal/staff domain, "Staff" is the primary door and
  // Fan becomes the small secondary link. On the public domain, it's the
  // reverse: Fan is primary, and staff access doesn't appear at all.
  const staffDomain = isStaffDomain();

  return (
    <div className="min-h-screen relative flex flex-col p-6">
      <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/background.jpg')" }} />
      <div className="fixed inset-0 -z-10" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />

      <div className="flex items-center justify-between mb-16">
        <Brand size="sm" />
        <SettingsMenu />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-[var(--surface)]/90 backdrop-blur border border-[var(--border)] rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#F2B705] flex items-center justify-center">
            {staffDomain ? <ShieldCheck className="w-8 h-8 text-[#0B0F14]" /> : <Users className="w-8 h-8 text-[#0B0F14]" />}
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {t('welcome')} <span className="text-[#F2B705]">SPORTSVIEWTZ</span>
          </h1>
          <p className="text-[var(--text-muted)] mb-8">{t('chooseAccess')}</p>

          {staffDomain ? (
            <>
              <button
                onClick={() => setView('staff')}
                className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 text-lg"
              >
                <ShieldCheck className="w-5 h-5" /> {t('staffButtonLabel')}
              </button>
              <p className="text-sm text-[var(--text-muted)] mt-3">{t('staffButtonDesc')}</p>

              <button
                onClick={() => setView('user')}
                className="mt-6 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition flex items-center justify-center gap-1.5 mx-auto"
              >
                <Users className="w-3 h-3" /> {t('fan')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setView('user')}
                className="w-full bg-[#F2B705] hover:brightness-110 text-[#0B0F14] font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 text-lg"
              >
                <Users className="w-5 h-5" /> {t('fan')}
              </button>
              <p className="text-sm text-[var(--text-muted)] mt-3">{t('fanDesc')}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;