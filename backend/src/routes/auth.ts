import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import { signToken } from '../utils/jwt';

export const authRouter = Router();

authRouter.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  res.json({ token: signToken({ id: admin.id, role: 'admin' }), name: admin.name });
});

authRouter.post('/manager/login', async (req, res) => {
  const { username, password } = req.body;
  const manager = await prisma.manager.findUnique({ where: { username }, include: { room: true } });
  if (!manager || !(await bcrypt.compare(password, manager.passwordHash))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  if (manager.status !== 'approved') {
    return res.status(403).json({ error: 'Your account is still awaiting admin approval.' });
  }
  res.json({ token: signToken({ id: manager.id, role: 'manager' }), name: manager.name, roomName: manager.room?.name });
});

// Public — self-registration, always starts as "pending"
authRouter.post('/manager/register', async (req, res) => {
  const { name, phone, email, roomName, location, username, password } = req.body;
  if (!name || !phone || !email || !roomName || !location || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const existing = await prisma.manager.findUnique({ where: { username } });
  if (existing) return res.status(409).json({ error: 'That username is already taken' });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.manager.create({
    data: {
      name, phone, email, username, passwordHash, status: 'pending',
      room: { create: { name: roomName, location } },
    },
  });
  res.status(201).json({ ok: true });
});