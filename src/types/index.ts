export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  entryFee: number;
}

export interface Room {
  id: string;
  roomName: string;
  location: string;
  managerName?: string;
  todayEntries: number;
  todayRevenue: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  cardHash: string;
  balance: number;
}