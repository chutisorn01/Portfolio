import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const Projects: React.FC = () => {
    const projects = [
        {
            title: 'Queue Management System',
            description: 'ระบบจัดการคิวออนไลน์สำหรับหน่วยงานราชการ เชื่อมต่อกับ LINE Official Account',
            image: '🎫',
            tags: ['React', 'TypeScript', 'Node.js', 'Prisma', 'LINE Bot'],
            link: '#',
            color: 'from-blue-400 to-blue-600'
        },
        {
            title: 'E-Commerce Platform',
            description: 'แพลตฟอร์มอีคอมเมิร์ซที่ครบครัน พร้อมระบบชำระเงินและจัดการสินค้า',
            image: '🛒',
            tags: ['Next.js', 'PostgreSQL', 'Stripe', 'Tailwind'],
            link: '#',
            color: 'from-green-400 to-green-600'
        },
        {
            title: 'Dashboard Analytics',
            description: 'Dashboard สำหรับวิเคราะห์ข้อมูลแบบ Real-time พร้อม Visualization ที่สวยงาม',
            image: '📊',
            tags: ['React', 'Chart.js', 'Express', 'MongoDB'],
            link: '#',
            color: 'from-purple-400 to-purple-600'
        },
        {
            title: 'Task Management App',
            description: 'แอปพลิเคชันจัดการงานและโปรเจค ทำงานร่วมกันเป็นทีมได้',
            image: '✅',
            tags: ['Vue.js', 'Firebase', 'Vuetify'],
            link: '#',
            color: 'from-orange-400 to-orange-600'
        },
        {
            title: 'Social Media Platform',
            description: 'แพลตฟอร์มโซเชียลมีเดีย มีระบบ Feed, Chat, และ Notification',
            image: '💬',
            tags: ['React', 'Socket.io', 'Redis', 'AWS'],
            link: '#',
            color: 'from-pink-400 to-pink-600'
        },
        {
            title: 'Portfolio Website',
            description: 'เว็บไซต์ Portfolio สวยงาม responsive และ SEO-friendly',
            image: '🌐',
            tags: ['React', 'Tailwind', 'Vite'],
            link: '#',
            color: 'from-cyan-400 to-cyan-600'
        }
    ];

    return (
        <section id="projects" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        ผลงาน
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        ตัวอย่างโปรเจคที่ผ่านมา แต่ละโปรเจคได้รับการออกแบบและพัฒนาอย่างพิถีพิถัน
                    </p>

                    {/* Projects Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, idx) => (
                            <Card 
                                key={idx}
                                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Project Icon/Image */}
                                <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300`}>
                                    {project.image}
                                </div>

                                {/* Project Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag, tagIdx) => (
                                            <Badge 
                                                key={tagIdx} 
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* View Button */}
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        ดูรายละเอียด →
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
