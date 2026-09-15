import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sportsviewtz.app',
  appName: 'SportsViewTZ',
  webDir: 'dist',
  server: {
    url: 'https://sportsview-app.onrender.com',
    cleartext: false,
    allowNavigation: ['sportsview-app.onrender.com'],
  },
};

export default config;