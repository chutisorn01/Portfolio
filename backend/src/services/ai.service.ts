import axios from 'axios';

const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY;
const TYPHOON_API_URL = 'https://api.opentyphoon.ai/v1/chat/completions';

export interface Intent {
    type: 'CHECK_SLOTS' | 'BOOKING' | 'MY_BOOKING' | 'UNKNOWN';
    data?: any;
}

export const processIntent = async (text: string): Promise<Intent> => {
    // Debug log
    console.log('Processing Intent for:', text);
    console.log('API Key Present:', !!TYPHOON_API_KEY);

    if (!TYPHOON_API_KEY) {
        console.warn('TYPHOON_API_KEY not found. Using mock AI.');
        return mockAI(text);
    }

    try {
        const response = await axios.post(
            TYPHOON_API_URL,
            {
                model: 'typhoon-v2.5-30b-a3b-instruct',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant for a government queue system. 
            Analyze the user's input and extract the intent.
            Output JSON only.
            Possible intents:
            1. CHECK_SLOTS: User asks for available slots. Extract "date" (YYYY-MM-DD) if specified (default to tomorrow if "tomorrow" is said, or today).
            2. BOOKING: User wants to book a queue. Extract "service" (ID_CARD, MARRIAGE, BIRTH_DEATH), "date" (YYYY-MM-DD), "time" (HH:mm).
            3. MY_BOOKING: User asks for their existing booking.
            
            Example Output:
            { "type": "BOOKING", "data": { "service": "ID_CARD", "date": "2024-02-20", "time": "10:00" } }
            { "type": "CHECK_SLOTS", "data": { "date": "2024-02-21" } }
            
            Current Date: ${new Date().toISOString().split('T')[0]}
            `
                    },
                    { role: 'user', content: text }
                ],
                max_tokens: 2000,
                temperature: 0.1, // Low temp for consistent JSON
                response_format: { type: "json_object" } // If supported, otherwise rely on prompt
            },
            {
                headers: {
                    'Authorization': `Bearer ${TYPHOON_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.choices[0].message.content;
        // Parse JSON from content
        // Sometimes LLM might wrap in markdown ```json ... ```
        const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('AI Processing Error:', error);
        return { type: 'UNKNOWN' };
    }
};

// Fallback Mock AI for testing without tokens
const mockAI = (text: string): Intent => {
    const lower = text.toLowerCase();

    if (lower.includes('ว่าง') || lower.includes('slots')) {
        return { type: 'CHECK_SLOTS' };
    }

    if (lower.includes('จอง') || lower.includes('book')) {
        // Very naive parser for mock
        // "จอง ทำบัตร 2024-02-20 10:00"
        const parts = text.split(' ');
        // Assuming format: จอง <service> <date> <time> logic roughly
        return {
            type: 'BOOKING',
            data: {
                service: 'ID_CARD', // Default for mock
                date: new Date().toISOString().split('T')[0], // Default today
                time: '10:00'
            }
        };
    }

    if (lower.includes('ของฉัน') || lower.includes('my')) {
        return { type: 'MY_BOOKING' };
    }

    return { type: 'UNKNOWN' };
}
