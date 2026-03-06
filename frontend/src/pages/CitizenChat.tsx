import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const CitizenChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ? (ระบบจำลอง)', sender: 'bot', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        try {
            const response = await api.post('/chat', { text: userMsg.text });

            const botMsg: Message = {
                id: Date.now() + 1,
                text: response.data.reply,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat error', error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อครับ',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-100 max-w-md mx-auto border shadow-xl">
            <div className="bg-[#00B900] p-4 text-white font-bold flex justify-between items-center">
                <span>Line OA Simulation</span>
                <span className="text-xs opacity-80">Online</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#8c9da0]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${msg.sender === 'user'
                                    ? 'bg-[#98e165] text-black rounded-tr-none'
                                    : 'bg-white text-black rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="bg-white p-3 border-t flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-[#00B900]"
                    placeholder="พิมพ์ข้อความ..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-[#00B900] text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default CitizenChat;
