import { Request, Response } from 'express';
import { processIntent } from '../services/ai.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const chatMessage = async (req: Request, res: Response) => {
    try {
        const { text, userId } = req.body;

        // Simulate user ID if not provided (for web demo)
        const simUserId = userId || 'sim_user_123';

        // 1. Process Intent via AI
        const intent = await processIntent(text);

        let replyText = '';

        switch (intent.type) {
            case 'CHECK_SLOTS':
                const checkDate = new Date(intent.data?.date || new Date());
                checkDate.setHours(0, 0, 0, 0);
                const nextDay = new Date(checkDate);
                nextDay.setDate(checkDate.getDate() + 1);

                const bookings = await prisma.booking.groupBy({
                    by: ['timeSlot'],
                    where: {
                        date: {
                            gte: checkDate,
                            lt: nextDay
                        },
                        status: { not: 'CANCELLED' }
                    },
                    _count: {
                        _all: true
                    }
                });

                const busySlots = bookings.map(b => `${b.timeSlot} (${b._count._all} คิว)`);
                const dateStr = checkDate.toISOString().split('T')[0];

                if (busySlots.length > 0) {
                    replyText = `คิววันที่ ${dateStr}:\nมีผู้จองแล้วดังนี้:\n- ${busySlots.join('\n- ')}\n\nช่วงเวลาอื่นๆ 09:00 - 16:00 ยังว่างครับ`;
                } else {
                    replyText = `คิววันที่ ${dateStr} ว่างทุกช่วงเวลา (09:00 - 16:00) ครับ`;
                }
                break;

            case 'BOOKING':
                if (intent.data) {
                    const service = await prisma.service.findFirst({ where: { code: intent.data.service || 'ID_CARD' } });
                    if (service) {
                        await prisma.booking.create({
                            data: {
                                lineUserId: simUserId,
                                serviceId: service.id,
                                date: new Date(intent.data.date || new Date()),
                                timeSlot: intent.data.time || '09:00',
                                status: 'PENDING',
                                queueNumber: `SIM${Date.now().toString().slice(-4)}`
                            }
                        });
                        replyText = `(Sim) จองคิวสำเร็จ! วันที่ ${intent.data.date} เวลา ${intent.data.time}`;
                    } else {
                        replyText = "(Sim) ไม่พบบริการที่เลือกครับ";
                    }
                } else {
                    replyText = "(Sim) ขออภัย ไม่สามารถดึงข้อมูลการจองได้";
                }
                break;

            case 'MY_BOOKING':
                const booking = await prisma.booking.findFirst({
                    where: { lineUserId: simUserId, status: 'PENDING' },
                    include: { service: true }
                });
                if (booking) {
                    replyText = `(Sim) คุณมีคิว ${booking.service.name} วันที่ ${booking.date.toISOString().split('T')[0]} เวลา ${booking.timeSlot} (${booking.queueNumber})`;
                } else {
                    replyText = "(Sim) คุณยังไม่มีการจองคิวครับ";
                }
                break;

            case 'UNKNOWN':
            default:
                replyText = "(Sim) ไม่เข้าใจคำสั่งครับ ลอง 'จองคิวทำบัตรพรุ่งนี้ 10 โมง'";
                break;
        }

        res.json({ reply: replyText, intent });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Chat processing failed' });
    }
};
