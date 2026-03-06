import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, send data to backend or email service
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: '📧',
            title: 'Email',
            value: 'your.email@example.com',
            link: 'mailto:your.email@example.com'
        },
        {
            icon: '📱',
            title: 'LINE',
            value: '@yourlineid',
            link: '#'
        },
        {
            icon: '💼',
            title: 'GitHub',
            value: 'github.com/yourusername',
            link: 'https://github.com/yourusername'
        }
    ];

    return (
        <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Section Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        ติดต่อเรา
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        มีโปรเจคที่น่าสนใจ หรือต้องการปรึกษา? ติดต่อเราได้ทุกเมื่อ!
                    </p>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left: Contact Info */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">
                                ข้อมูลติดต่อ
                            </h3>
                            <div className="space-y-6">
                                {contactInfo.map((info, idx) => (
                                    <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                                        <a 
                                            href={info.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center group"
                                        >
                                            <div className="text-4xl mr-4">{info.icon}</div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">{info.title}</div>
                                                <div className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                                                    {info.value}
                                                </div>
                                            </div>
                                        </a>
                                    </Card>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                                    ติดตามเรา
                                </h4>
                                <div className="flex gap-4">
                                    {['📘', '🐦', '💼', '📷'].map((emoji, idx) => (
                                        <a
                                            key={idx}
                                            href="#"
                                            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-2xl hover:shadow-xl hover:scale-110 transition-all"
                                        >
                                            {emoji}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div>
                            <Card className="p-8 bg-white shadow-xl">
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                                    ส่งข้อความถึงเรา
                                </h3>
                                
                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4">✅</div>
                                        <div className="text-xl font-semibold text-green-600 mb-2">
                                            ส่งข้อความสำเร็จ!
                                        </div>
                                        <div className="text-gray-600">
                                            เราจะติดต่อกลับโดยเร็วที่สุด
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ชื่อของคุณ
                                            </label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="กรอกชื่อของคุณ"
                                                required
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                อีเมล
                                            </label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="your.email@example.com"
                                                required
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ข้อความ
                                            </label>
                                            <Textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="เขียนข้อความของคุณที่นี่..."
                                                rows={5}
                                                required
                                                className="w-full"
                                            />
                                        </div>

                                        <Button 
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                                        >
                                            ส่งข้อความ ✉️
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
