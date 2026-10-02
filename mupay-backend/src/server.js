import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import transferRoutes from './routes/transfers.js';
import receiverRoutes from './routes/receivers.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/receivers', receiverRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[mupay] listening on http://localhost:${port}`);
});