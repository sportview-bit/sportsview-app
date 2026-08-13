import { Router } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../db';

export const userRouter = Router();

userRouter.post('/register', async (req, res) => {
  const { name, phone } = req.body;
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return res.status(200).json(existing);
  const cardHash = `SVTZ-${randomBytes(4).toString('hex').toUpperCase()}`;
  res.status(201).json(await prisma.user.create({ data: { name, phone, cardHash } }));
});

userRouter.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

userRouter.post('/:id/topup', async (req, res) => {
  const amount = Number(req.body.amount);
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { balance: { increment: amount } } });
  await prisma.transaction.create({ data: { userId: user.id, amount, type: 'topup', method: 'USSD' } });
  res.json(user);
});