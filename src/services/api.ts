const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path: string, options: RequestInit = {}, token?: string | null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  adminLogin: (username: string, password: string) =>
    request('/auth/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  managerLogin: (username: string, password: string) =>
    request('/auth/manager/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  managerRegister: (data: Record<string, unknown>) =>
    request('/auth/manager/register', { method: 'POST', body: JSON.stringify(data) }),
  sponsorLogin: (username: string, password: string) =>
    request('/auth/sponsor/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  getOverview: (token: string) => request('/admin/overview', {}, token),
  getMatches: () => request('/matches'),
  createMatch: (token: string, data: Record<string, unknown>) =>
    request('/admin/matches', { method: 'POST', body: JSON.stringify(data) }, token),
  deleteMatch: (token: string, id: string) => request(`/admin/matches/${id}`, { method: 'DELETE' }, token),

  getRooms: (token: string) => request('/admin/rooms', {}, token),
  createRoom: (token: string, data: Record<string, unknown>) =>
    request('/admin/rooms', { method: 'POST', body: JSON.stringify(data) }, token),
  deleteRoom: (token: string, id: string) => request(`/admin/rooms/${id}`, { method: 'DELETE' }, token),

  getPendingManagers: (token: string) => request('/admin/managers/pending', {}, token),
  approveManager: (token: string, id: string) => request(`/admin/managers/${id}/approve`, { method: 'POST' }, token),
  rejectManager: (token: string, id: string) => request(`/admin/managers/${id}`, { method: 'DELETE' }, token),

  getSponsors: (token: string) => request('/admin/sponsors', {}, token),
  createSponsor: (token: string, data: Record<string, unknown>) =>
    request('/admin/sponsors', { method: 'POST', body: JSON.stringify(data) }, token),
  deleteSponsor: (token: string, id: string) => request(`/admin/sponsors/${id}`, { method: 'DELETE' }, token),

  getMyRoom: (token: string) => request('/manager/room', {}, token),
  simulateScan: (token: string, cardHash: string, matchId: string) =>
    request('/manager/scan', { method: 'POST', body: JSON.stringify({ cardHash, matchId }) }, token),

  getSponsorMe: (token: string) => request('/sponsor/me', {}, token),

  registerUser: (name: string, phone: string) =>
    request('/users/register', { method: 'POST', body: JSON.stringify({ name, phone }) }),
  getUser: (id: string) => request(`/users/${id}`),
  topUp: (userId: string, amount: number) =>
    request(`/users/${userId}/topup`, { method: 'POST', body: JSON.stringify({ amount }) }),
};