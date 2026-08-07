export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchTime: string;
  entryFee: number;
}

export interface Room {
  id: string;
  roomName: string;
  location: string;
  managerId: string;
  todayEntries: number;
  todayRevenue: number;
}

// Created by Admin only — a manager logs in with these and lands straight
// on the one room tied to their account (managerId === Room.managerId).
export interface Manager {
  id: string;
  name: string;
  phone: string;
  username: string;
  password: string; // mock only — plaintext for demo purposes, never do this in a real backend
  roomId: string;
}

// Created by Admin only.
export interface Sponsor {
  id: string;
  name: string;
  username: string;
  password: string; // mock only
  amountSponsored: number;
  profitSharePercent: number; // % of platform revenue the admin has agreed to share with them
}

export interface User {
  id: string;
  name: string;
  phone: string;
  cardHash: string;
  balance: number;
}