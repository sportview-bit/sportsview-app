// src/types/index.ts

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchTime: string;
  entryFee: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  cardHash: string;
  balance: number;
}

export interface Room {
  id: string;
  roomName: string;
  managerName: string;
  location: string;
  todayEntries: number;
  todayRevenue: number;
}