import { Router } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../db';

export const userRouter = Router();

const PHONE_REGEX = /^\d{10}$/;

userRouter.post('/register', async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) return res.status(400).json({ error: 'Name, phone, and email are required' });
  if (!PHONE_REGEX.test(phone)) return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return res.status(200).json(existing);

  const cardHash = `SVTZ-${randomBytes(4).toString('hex').toUpperCase()}`;
  const user = await prisma.user.create({ data: { name, phone, email, cardHash } });
  res.status(201).json(user);
});

userRouter.post('/login', async (req, res) => {
  const { phone } = req.body;
  if (!phone || !PHONE_REGEX.test(phone)) return res.status(400).json({ error: 'Enter a valid 10-digit phone number' });

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return res.status(404).json({ error: 'No account found for that phone number.' });
  res.json(user);
});

userRouter.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

userRouter.post('/:id/topup', async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Enter a valid amount' });
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { balance: { increment: amount } } });
  await prisma.transaction.create({ data: { userId: user.id, amount, type: 'topup', method: 'USSD' } });
  res.json(user);
});