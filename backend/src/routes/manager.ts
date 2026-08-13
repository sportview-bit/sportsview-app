import { Router } from 'express';
import { prisma } from '../db';
import { AuthedRequest, requireRole } from '../middleware/auth';

export const managerRouter = Router();
managerRouter.use(requireRole('manager'));

function startOfToday() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d;
}

managerRouter.get('/room', async (req: AuthedRequest, res) => {
  const since = startOfToday();
  const room = await prisma.room.findUnique({
    where: { managerId: req.auth!.id },
    include: { entries: { where: { scannedAt: { gte: since } }, include: { user: true, match: true }, orderBy: { scannedAt: 'desc' } } },
  });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({
    id: room.id, roomName: room.name, location: room.location,
    todayEntries: room.entries.length,
    todayRevenue: room.entries.reduce((s, e) => s + e.amount, 0),
    recentEntries: room.entries.slice(0, 30).map(e => ({
      id: e.id, userName: e.user.name, amount: e.amount, match: `${e.match.homeTeam} vs ${e.match.awayTeam}`, scannedAt: e.scannedAt,
    })),
  });
});

managerRouter.post('/scan', async (req: AuthedRequest, res) => {
  const { cardHash, matchId } = req.body;
  const room = await prisma.room.findUnique({ where: { managerId: req.auth!.id } });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const user = await prisma.user.findUnique({ where: { cardHash } });
  if (!user) return res.status(404).json({ error: 'Card not recognized' });
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return res.status(404).json({ error: 'Select a match first' });
  if (user.balance < match.entryFee) return res.status(402).json({ error: `${user.name} needs to top up` });

  const [entry] = await prisma.$transaction([
    prisma.entry.create({ data: { userId: user.id, roomId: room.id, matchId, amount: match.entryFee } }),
    prisma.user.update({ where: { id: user.id }, data: { balance: { decrement: match.entryFee } } }),
    prisma.transaction.create({ data: { userId: user.id, amount: match.entryFee, type: 'entry', method: 'QR' } }),
  ]);
  res.status(201).json({ ok: true, userName: user.name, amount: match.entryFee, entryId: entry.id });
});