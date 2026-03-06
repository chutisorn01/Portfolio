import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Client, ClientConfig } from '@line/bot-sdk';
import { createCallingFlexMessage } from '../utils/flexMessages';

const prisma = new PrismaClient();

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'mock_token',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'mock_secret',
};

const client = new Client(clientConfig);

// Get Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        const searchDate = date ? new Date(String(date)) : new Date();

        // Set to start of day (00:00:00)
        const startDate = new Date(searchDate);
        startDate.setHours(0, 0, 0, 0);

        // Set to end of day (23:59:59.999)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const whereDate = {
            gte: startDate,
            lt: endDate
        };

        const totalQueues = await prisma.booking.count({
            where: { date: whereDate },
        });

        const servedQueues = await prisma.booking.count({
            where: {
                date: whereDate,
                status: 'COMPLETED'
            },
        });

        const pendingQueues = await prisma.booking.count({
            where: {
                date: whereDate,
                status: 'PENDING'
            },
        });

        res.json({
            total: totalQueues,
            served: servedQueues,
            pending: pendingQueues,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

// Get Queues (with optional status filter)
export const getQueues = async (req: Request, res: Response) => {
    try {
        const { status, date } = req.query;

        const searchDate = date ? new Date(String(date)) : new Date();
        const startDate = new Date(searchDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const where: any = {
            date: {
                gte: startDate,
                lt: endDate
            }
        };

        if (status && status !== 'ALL') {
            where.status = String(status).toUpperCase();
        }

        const queues = await prisma.booking.findMany({
            where,
            include: { service: true },
            orderBy: { createdAt: 'asc' },
        });

        res.json(queues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch queues' });
    }
};

// Call Queue
export const callQueue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status: 'SERVING' },
            include: { service: true }
        });

        if (booking.lineUserId && !booking.lineUserId.startsWith('sim_') && !booking.lineUserId.startsWith('SIM')) {
            try {
                const flexMessage = createCallingFlexMessage({
                    queueNumber: booking.queueNumber,
                    serviceName: booking.service.name,
                    date: booking.date.toISOString().split('T')[0],
                    time: booking.timeSlot
                });

                await client.pushMessage(booking.lineUserId, flexMessage);
            } catch (lineError) {
                console.error('Failed to send Line notification:', lineError);
            }
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to call queue' });
    }
};

// Complete Queue
export const completeQueue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status: 'COMPLETED' },
            include: { service: true }
        });

        if (booking.lineUserId && !booking.lineUserId.startsWith('sim_') && !booking.lineUserId.startsWith('SIM')) {
            try {
                await client.pushMessage(booking.lineUserId, {
                    type: 'text',
                    text: `✅ การรับบริการเสร็จสิ้น (${booking.queueNumber})\n\nขอบคุณที่ใช้บริการครับ 🙏\nหากมีข้อเสนอแนะ แจ้งเราได้เสมอครับ`
                });
            } catch (lineError) {
                console.error('Failed to send Line notification:', lineError);
            }
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete queue' });
    }
};
