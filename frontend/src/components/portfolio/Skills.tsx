import React from 'react';
import { Card } from '../ui/card';

const Skills: React.FC = () => {
    const skillCategories = [
        {
            title: 'Frontend',
            icon: '🎨',
            color: 'from-blue-500 to-cyan-500',
            skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js']
        },
        {
            title: 'Backend',
            icon: '⚙️',
            color: 'from-green-500 to-emerald-500',
            skills: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'MongoDB']
        },
        {
            title: 'Tools & Others',
            icon: '🛠️',
            color: 'from-purple-500 to-pink-500',
            skills: ['Git', 'Docker', 'Vercel', 'Netlify', 'LINE Bot API']
        }
    ];

    return (
        <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        ทักษะ
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-12"></div>

                    {/* Skills Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {skillCategories.map((category, idx) => (
                            <Card 
                                key={idx} 
                                className="p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-t-4"
                                style={{ borderTopColor: idx === 0 ? '#3b82f6' : idx === 1 ? '#10b981' : '#a855f7' }}
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-3xl mb-6`}>
                                    {category.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                                    {category.title}
                                </h3>

                                {/* Skills List */}
                                <ul className="space-y-3">
                                    {category.skills.map((skill, skillIdx) => (
                                        <li 
                                            key={skillIdx}
                                            className="flex items-center text-gray-700"
                                        >
                                            <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3"></span>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
