import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { login, register } from './controllers/auth.controller';
import { callQueue, completeQueue, getDashboardStats, getQueues } from './controllers/admin.controller';
import { lineWebhook } from './controllers/webhook.controller';
import { chatMessage } from './controllers/chat.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Auth Routes
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);

// Admin Routes (Should be protected by auth middleware in prod)
app.get('/api/admin/stats', getDashboardStats);
app.get('/api/admin/queues', getQueues);
app.put('/api/admin/queues/:id/call', callQueue);
app.put('/api/admin/queues/:id/complete', completeQueue);

// Line Webhook
app.post('/webhook/line', lineWebhook);

// Chat Simulation API
app.post('/api/chat', chatMessage);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
