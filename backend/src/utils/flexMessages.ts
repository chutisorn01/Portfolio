import { FlexMessage } from '@line/bot-sdk';

interface BookingDetails {
    queueNumber: string;
    serviceName: string;
    date: string;
    time: string;
    location?: string;
}

export const createBookingFlexMessage = (details: BookingDetails): FlexMessage => {
    return {
        type: 'flex',
        altText: `Booking Confirmed: ${details.queueNumber}`,
        contents: {
            type: 'bubble',
            header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: 'บัตรคิวอิเล็กทรอนิกส์',
                        weight: 'bold',
                        color: '#FFFFFF',
                        size: 'lg'
                    }
                ],
                backgroundColor: '#06C755', // Line Green
                paddingAll: '15px'
            },
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: details.queueNumber,
                        weight: 'bold',
                        size: '4xl',
                        align: 'center',
                        color: '#111111',
                        margin: 'md'
                    },
                    {
                        type: 'text',
                        text: 'หมายเลขคิวของคุณ',
                        size: 'xs',
                        color: '#aaaaaa',
                        align: 'center'
                    },
                    {
                        type: 'separator',
                        margin: 'xl'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'lg',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: 'บริการ',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: details.serviceName,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 4
                                    }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: 'วันที่',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: details.date,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 4
                                    }
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: 'เวลา',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: details.time,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 4
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'text',
                        text: 'กรุณามาก่อนเวลา 10 นาที',
                        size: 'xs',
                        align: 'center',
                        color: '#aaaaaa'
                    }
                ],
                paddingAll: '15px'
            }
        }
    };
};

export const createCallingFlexMessage = (details: BookingDetails): FlexMessage => {
    return {
        type: 'flex',
        altText: `ถึงคิวของคุณแล้ว! ${details.queueNumber}`,
        contents: {
            type: 'bubble',
            header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: 'ถึงคิวของคุณแล้ว!',
                        weight: 'bold',
                        color: '#FFFFFF',
                        size: 'lg'
                    }
                ],
                backgroundColor: '#007AFF', // Blue
                paddingAll: '15px'
            },
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: details.queueNumber,
                        weight: 'bold',
                        size: '5xl', // Bigger for calling
                        align: 'center',
                        color: '#111111',
                        margin: 'md'
                    },
                    {
                        type: 'text',
                        text: 'กรุณาติดต่อที่ช่องบริการ',
                        size: 'md',
                        color: '#E02020', // Red for urgency
                        align: 'center',
                        weight: 'bold',
                        margin: 'md'
                    },
                    {
                        type: 'separator',
                        margin: 'xl'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'lg',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: 'บริการ',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: details.serviceName,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 4
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    };
};
