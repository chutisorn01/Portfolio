import React from 'react';
import { Button } from '../ui/button';

const Hero: React.FC = () => {
    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Avatar/Image */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                            H
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        สวัสดีครับ! 👋
                    </h1>
                    
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
                        ผม <span className="text-blue-600">นักพัฒนาเว็บ</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        สร้างสรรค์เว็บแอปพลิเคชันที่สวยงาม ใช้งานง่าย และตอบโจทย์ผู้ใช้งาน
                        ด้วยเทคโนโลยีที่ทันสมัย
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg"
                            onClick={() => scrollToSection('projects')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg"
                        >
                            ดูผลงาน
                        </Button>
                        <Button 
                            size="lg"
                            variant="outline"
                            onClick={() => scrollToSection('contact')}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
                        >
                            ติดต่อเรา
                        </Button>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="mt-16 animate-bounce">
                        <svg 
                            className="w-6 h-6 mx-auto text-gray-400" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
