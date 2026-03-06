import { Request, Response } from 'express';
import { middleware, MiddlewareConfig, WebhookEvent, Client, ClientConfig } from '@line/bot-sdk';
import { processIntent } from '../services/ai.service';
import { PrismaClient } from '@prisma/client';
import { createBookingFlexMessage } from '../utils/flexMessages';

const prisma = new PrismaClient();

const lineConfig: MiddlewareConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'mock_token',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'mock_secret',
};

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'mock_token',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'mock_secret',
};

const client = new Client(clientConfig);

export const lineWebhook = async (req: Request, res: Response) => {
    const events: WebhookEvent[] = req.body.events;

    try {
        const results = await Promise.all(
            events.map(async (event: WebhookEvent) => {
                return handleEvent(event);
            })
        );
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
};

const handleEvent = async (event: WebhookEvent) => {
    if (event.type === 'postback') {
        const userId = event.source.userId;
        if (!userId) return;

        const data = event.postback.data; // e.g., "service=ID_CARD"
        const params = new URLSearchParams(data);
        const serviceCode = params.get('service');
        const dateTime = (event.postback.params as any)?.datetime; // "2023-12-25T10:00"

        if (serviceCode && dateTime) {
            const service = await prisma.service.findFirst({ where: { code: serviceCode } });
            if (service) {
                const [datePart, timePart] = dateTime.split('T');
                const queueNumber = `Q${Date.now().toString().slice(-4)}`;
                await prisma.booking.create({
                    data: {
                        lineUserId: userId,
                        serviceId: service.id,
                        date: new Date(datePart),
                        timeSlot: timePart,
                        status: 'PENDING',
                        queueNumber: queueNumber
                    }
                });

                const replyText = createBookingFlexMessage({
                    queueNumber: queueNumber,
                    serviceName: service.name,
                    date: datePart,
                    time: timePart
                });

                if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
                    return client.replyMessage(event.replyToken, replyText);
                }
            }
        }
        return Promise.resolve(null);
    }

    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const userId = event.source.userId;
    if (!userId) return;

    const userText = event.message.text;

    // 1. Process Intent via AI
    const intent = await processIntent(userText);

    let replyText: string | any = '';

    switch (intent.type) {
        case 'CHECK_SLOTS':
            // Query DB for slots
            // Simplified: Just say "Available"
            replyText = "คิวว่าง: 09:00 - 16:00 ครับ";
            break;

        case 'BOOKING':
            if (intent.data) {
                // Create Booking
                // Find Service
                const service = await prisma.service.findFirst({ where: { code: intent.data.service || 'ID_CARD' } });
                if (service) {
                    const queueNumber = `Q${Date.now().toString().slice(-4)}`;
                    await prisma.booking.create({
                        data: {
                            lineUserId: userId,
                            serviceId: service.id,
                            date: new Date(intent.data.date || new Date()),
                            timeSlot: intent.data.time || '09:00',
                            status: 'PENDING',
                            queueNumber: queueNumber // Simple RNG
                        }
                    });

                    // Use Flex Message
                    replyText = createBookingFlexMessage({
                        queueNumber: queueNumber,
                        serviceName: service.name,
                        date: intent.data.date || new Date().toISOString().split('T')[0],
                        time: intent.data.time || '09:00'
                    }) as any; // Cast to any to bypass string type check (will fix type next)

                } else {
                    replyText = "ไม่พบบริการที่เลือกครับ";
                }
            } else {
                // Ask for Service using Quick Reply
                replyText = {
                    type: 'text',
                    text: 'ต้องการจองคิวรับบริการด้านไหนครับ?',
                    quickReply: {
                        items: [
                            {
                                type: 'action',
                                action: {
                                    type: 'datetimepicker',
                                    label: 'ทำบัตรประชาชน',
                                    data: 'service=ID_CARD',
                                    mode: 'datetime'
                                }
                            },
                            {
                                type: 'action',
                                action: {
                                    type: 'datetimepicker',
                                    label: 'จดทะเบียนสมรส',
                                    data: 'service=MARRIAGE',
                                    mode: 'datetime'
                                }
                            },
                            {
                                type: 'action',
                                action: {
                                    type: 'datetimepicker',
                                    label: 'แจ้งเกิด/ตาย',
                                    data: 'service=BIRTH_DEATH',
                                    mode: 'datetime'
                                }
                            }
                        ]
                    }
                };
            }
            break;

        case 'MY_BOOKING':
            const booking = await prisma.booking.findFirst({
                where: { lineUserId: userId, status: 'PENDING' },
                include: { service: true }
            });
            if (booking) {
                replyText = `คุณมีคิว ${booking.service.name} วันที่ ${booking.date.toISOString().split('T')[0]} เวลา ${booking.timeSlot} (${booking.queueNumber})`;
            } else {
                replyText = "คุณยังไม่มีการจองคิวครับ";
            }
            break;

        case 'UNKNOWN':
        default:
            replyText = "ไม่เข้าใจคำสั่งครับ ลองถามใหม่ เช่น 'จองคิวทำบัตรพรุ่งนี้ 10 โมง'";
            break;
    }

    // Reply to Line
    // If mocking, we can't reply really unless Token is valid.
    // Reply to Line
    if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
        if (typeof replyText === 'string') {
            return client.replyMessage(event.replyToken, { type: 'text', text: replyText });
        } else if ((replyText as any).type === 'flex') {
            return client.replyMessage(event.replyToken, replyText);
        } else if ((replyText as any).quickReply) {
            // Handle message with Quick Reply
            return client.replyMessage(event.replyToken, replyText);
        }
    } else {
        console.log(`[MOCK LINE REPLY] To ${userId}:`, JSON.stringify(replyText));
        return Promise.resolve(null);
    }
};
