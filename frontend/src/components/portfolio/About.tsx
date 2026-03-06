import React from 'react';
import { Card } from '../ui/card';

const About: React.FC = () => {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Section Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        เกี่ยวกับผม
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-12"></div>

                    {/* About Content */}
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: Image/Icon */}
                        <div className="flex justify-center">
                            <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                <div className="text-8xl">💻</div>
                            </div>
                        </div>

                        {/* Right: Text */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                                นักพัฒนาเว็บแอปพลิเคชัน
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                มีประสบการณ์ในการพัฒนาเว็บแอปพลิเคชันด้วยเทคโนโลยีที่ทันสมัย 
                                เช่น React, TypeScript, Node.js และอื่นๆ
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                มุ่งมั่นที่จะสร้างสรรค์ผลงานที่มีคุณภาพ สวยงาม และใช้งานง่าย
                                โดยคำนึงถึงประสบการณ์ของผู้ใช้งานเป็นหลัก
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <Card className="p-4 text-center border-blue-200">
                                    <div className="text-3xl font-bold text-blue-600">3+</div>
                                    <div className="text-sm text-gray-600 mt-1">ปีประสบการณ์</div>
                                </Card>
                                <Card className="p-4 text-center border-purple-200">
                                    <div className="text-3xl font-bold text-purple-600">50+</div>
                                    <div className="text-sm text-gray-600 mt-1">โปรเจค</div>
                                </Card>
                                <Card className="p-4 text-center border-green-200">
                                    <div className="text-3xl font-bold text-green-600">100%</div>
                                    <div className="text-sm text-gray-600 mt-1">ความพึงพอใจ</div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
