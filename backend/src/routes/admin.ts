import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import { requireRole } from '../middleware/auth';

export const adminRouter = Router();
adminRouter.use(requireRole('admin'));

function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }

adminRouter.get('/overview', async (_req, res) => {
  const since = startOfToday();
  const [totalRooms, totalManagers, totalSponsors, entriesToday] = await Promise.all([
    prisma.room.count({ where: { manager: { status: 'approved' } } }),
    prisma.manager.count({ where: { status: 'approved' } }),
    prisma.sponsor.count(),
    prisma.entry.findMany({ where: { scannedAt: { gte: since } }, select: { amount: true } }),
  ]);
  res.json({
    totalRooms, totalManagers, totalSponsors,
    totalEntriesToday: entriesToday.length,
    totalRevenueToday: entriesToday.reduce((s, e) => s + e.amount, 0),
  });
});

adminRouter.get('/matches', async (_req, res) => res.json(await prisma.match.findMany({ orderBy: { createdAt: 'desc' } })));
adminRouter.post('/matches', async (req, res) => {
  const { homeTeam, awayTeam, matchTime, entryFee } = req.body;
  res.status(201).json(await prisma.match.create({ data: { homeTeam, awayTeam, matchTime, entryFee: entryFee ?? 1000 } }));
});
adminRouter.delete('/matches/:id', async (req, res) => {
  await prisma.match.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

adminRouter.get('/rooms', async (_req, res) => {
  const since = startOfToday();
  const rooms = await prisma.room.findMany({
    where: { manager: { status: 'approved' } },
    include: { manager: true, entries: { where: { scannedAt: { gte: since } }, select: { amount: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(rooms.map(r => ({
    id: r.id, roomName: r.name, location: r.location,
    managerId: r.managerId, managerName: r.manager.name,
    todayEntries: r.entries.length,
    todayRevenue: r.entries.reduce((s, e) => s + e.amount, 0),
  })));
});

adminRouter.post('/rooms', async (req, res) => {
  const { roomName, location, managerName, phone, email, username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const manager = await prisma.manager.create({
    data: { name: managerName, phone, email, username, passwordHash, status: 'approved', room: { create: { name: roomName, location } } },
    include: { room: true },
  });
  res.status(201).json(manager);
});

adminRouter.delete('/rooms/:id', async (req, res) => {
  const room = await prisma.room.findUnique({ where: { id: req.params.id } });
  if (room) {
    await prisma.room.delete({ where: { id: room.id } });
    await prisma.manager.delete({ where: { id: room.managerId } });
  }
  res.status(204).end();
});

adminRouter.get('/managers/pending', async (_req, res) => {
  const pending = await prisma.manager.findMany({ where: { status: 'pending' }, include: { room: true } });
  res.json(pending);
});
adminRouter.post('/managers/:id/approve', async (req, res) => {
  const manager = await prisma.manager.update({ where: { id: req.params.id }, data: { status: 'approved' } });
  res.json(manager);
});
adminRouter.delete('/managers/:id', async (req, res) => {
  const manager = await prisma.manager.findUnique({ where: { id: req.params.id }, include: { room: true } });
  if (manager?.room) await prisma.room.delete({ where: { id: manager.room.id } });
  if (manager) await prisma.manager.delete({ where: { id: manager.id } });
  res.status(204).end();
});

// Real password reset — the correct fix, since it hashes properly instead of relying on manual DB edits
adminRouter.post('/managers/:id/reset-password', async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.manager.update({ where: { id: req.params.id }, data: { passwordHash } });
  res.json({ ok: true });
});

adminRouter.get('/sponsors', async (_req, res) => res.json(await prisma.sponsor.findMany({ orderBy: { createdAt: 'desc' } })));
adminRouter.post('/sponsors', async (req, res) => {
  const { name, username, password, amountSponsored, profitSharePercent } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  res.status(201).json(await prisma.sponsor.create({
    data: { name, username, passwordHash, amountSponsored: Number(amountSponsored) || 0, profitSharePercent: Number(profitSharePercent) || 0 },
  }));
});
adminRouter.delete('/sponsors/:id', async (req, res) => {
  await prisma.sponsor.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
adminRouter.post('/sponsors/:id/reset-password', async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.sponsor.update({ where: { id: req.params.id }, data: { passwordHash } });
  res.json({ ok: true });
});