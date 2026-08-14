import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { managerRouter } from './routes/manager';
import { userRouter } from './routes/user';
import { sponsorRouter } from './routes/sponsor';
import { prisma } from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/manager', managerRouter);
app.use('/api/users', userRouter);
app.use('/api/sponsor', sponsorRouter);

app.get('/api/matches', async (_req, res) => res.json(await prisma.match.findMany({ orderBy: { createdAt: 'desc' } })));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SportsView TZ API running on port ${PORT}`));