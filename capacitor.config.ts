import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sportsviewtz.app',
  appName: 'SportsViewTZ',
  webDir: 'dist',
  server: {
    url: 'https://sportsviewtz.com',
    cleartext: false,
  },
};

export default config;