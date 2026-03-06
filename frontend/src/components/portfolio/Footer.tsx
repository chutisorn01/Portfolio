import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Portfolio
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            นักพัฒนาเว็บแอปพลิเคชัน มุ่งมั่นสร้างสรรค์ผลงานที่มีคุณภาพ 
                            และตอบโจทย์ผู้ใช้งาน
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">ลิงก์ด่วน</h3>
                        <ul className="space-y-2">
                            {['หน้าแรก', 'เกี่ยวกับ', 'ทักษะ', 'ผลงาน', 'ติดต่อ'].map((link, idx) => (
                                <li key={idx}>
                                    <button
                                        onClick={() => scrollToSection(['hero', 'about', 'skills', 'projects', 'contact'][idx])}
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">ติดตามเรา</h3>
                        <div className="flex gap-4">
                            {[
                                { emoji: '📧', label: 'Email' },
                                { emoji: '📱', label: 'LINE' },
                                { emoji: '💼', label: 'GitHub' },
                                { emoji: '📘', label: 'Facebook' }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110"
                                    title={social.label}
                                >
                                    {social.emoji}
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-400 mt-4 text-sm">
                            📧 your.email@example.com
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-400">
                        © {currentYear} Portfolio. Made with ❤️ using React + TypeScript + Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
