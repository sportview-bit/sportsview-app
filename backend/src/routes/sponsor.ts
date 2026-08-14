import { Router } from 'express';
import { prisma } from '../db';
import { AuthedRequest, requireRole } from '../middleware/auth';

export const sponsorRouter = Router();
sponsorRouter.use(requireRole('sponsor'));

function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }

sponsorRouter.get('/me', async (req: AuthedRequest, res) => {
  const sponsor = await prisma.sponsor.findUnique({ where: { id: req.auth!.id } });
  if (!sponsor) return res.status(404).json({ error: 'Not found' });

  const since = startOfToday();
  const rooms = await prisma.room.findMany({
    where: { manager: { status: 'approved' } },
    include: { entries: { where: { scannedAt: { gte: since } }, select: { amount: true } } },
  });

  res.json({
    id: sponsor.id,
    name: sponsor.name,
    amountSponsored: sponsor.amountSponsored,
    profitSharePercent: sponsor.profitSharePercent,
    rooms: rooms.map(r => ({
      id: r.id, roomName: r.name, location: r.location,
      todayEntries: r.entries.length,
      todayRevenue: r.entries.reduce((s, e) => s + e.amount, 0),
    })),
  });
});