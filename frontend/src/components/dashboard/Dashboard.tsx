
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Home01Icon,
    ChartAverageIcon,
    UserGroupIcon,
    Settings01Icon,
    Search01Icon,
    Notification01Icon,
    Logout01Icon,
    ArrowRight01Icon,
    Clock01Icon,
    MoreHorizontalIcon,
    Calendar01Icon,
    ArrowUpRight01Icon,
    ArrowDownRight01Icon
} from '@hugeicons/core-free-icons';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function Dashboard() {
    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/20">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border hidden md:flex flex-col bg-card/30 backdrop-blur-xl sticky top-0 h-screen z-10 transition-all duration-300">
                <div className="p-6 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                        H
                    </div>
                    <span className="font-bold text-lg tracking-tight">Hifiw<span className="text-muted-foreground font-normal">OS</span></span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <SidebarItem icon={Home01Icon} label="Overview" active />
                    <SidebarItem icon={ChartAverageIcon} label="Analytics" />
                    <SidebarItem icon={UserGroupIcon} label="Team" />
                    <SidebarItem icon={Calendar01Icon} label="Schedule" />
                    <SidebarItem icon={Settings01Icon} label="Settings" />
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 rounded-xl p-4 mb-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <HugeiconsIcon icon={ChartAverageIcon} size={48} />
                        </div>
                        <h4 className="font-medium text-sm mb-1 z-10 relative">Pro Plan</h4>
                        <p className="text-xs text-muted-foreground mb-3 z-10 relative">Your trial ends in 6 days.</p>
                        <Button size="sm" className="w-full text-xs shadow-sm" variant="outline">Upgrade</Button>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                        <HugeiconsIcon icon={Logout01Icon} size={18} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3 w-1/3">
                        <div className="relative w-full max-w-sm group">
                            <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 hover:bg-secondary/80"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground relative">
                            <HugeiconsIcon icon={Notification01Icon} size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-1.5 rounded-full pr-3 transition-colors">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-background flex items-center justify-center text-white text-xs font-bold">
                                AM
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">Alex Morgan</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6 space-y-8 no-scrollbar">
                    {/* Header */}
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <HugeiconsIcon icon={Calendar01Icon} size={16} className="mr-2" />
                                Oct 24, 2025
                            </Button>
                            <Button size="sm">
                                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            title="Total Revenue"
                            value="$45,231.89"
                            trend="+20.1% from last month"
                            trendUp={true}
                            icon={ChartAverageIcon}
                        />
                        <MetricCard
                            title="Active Users"
                            value="+2350"
                            trend="+180.1% from last month"
                            trendUp={true}
                            icon={UserGroupIcon}
                        />
                        <MetricCard
                            title="Sales"
                            value="+12,234"
                            trend="+19% from last month"
                            trendUp={true}
                            icon={ArrowRight01Icon}
                        />
                        <MetricCard
                            title="Active Now"
                            value="+573"
                            trend="+201 since last hour"
                            trendUp={true}
                            icon={Clock01Icon}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        {/* Main Chart Area */}
                        <Card className="lg:col-span-4 shadow-sm border-border/60 bg-gradient-to-b from-card to-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>Monthly revenue analysis.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/* Mock Chart */}
                                <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 pb-4">
                                    {[40, 30, 55, 45, 60, 75, 50, 65, 80, 70, 85, 90].map((h, i) => (
                                        <div key={i} className="group relative flex-1 bg-primary/10 hover:bg-primary/20 rounded-t-xl transition-all duration-300" style={{ height: `${h}%` }}>
                                            <div className="absolute bottom-0 left-0 w-full bg-primary/80 group-hover:bg-primary h-full rounded-t-xl transition-all duration-300 opacity-20 group-hover:opacity-100 flex items-end justify-center pb-2">
                                                <span className="text-[10px] text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity font-bold">{h}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Sales / Activity */}
                        <Card className="lg:col-span-3 shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>You made 265 sales this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between group cursor-default p-2 -mx-2 rounded-lg hover:bg-secondary/40 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors ring-2 ring-transparent group-hover:ring-primary/20">
                                                    <div className="text-sm font-bold">JD</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">John Doe</p>
                                                    <p className="text-xs text-muted-foreground">success@stripe.com</p>
                                                </div>
                                            </div>
                                            <div className="font-medium text-sm group-hover:scale-105 transition-transform">+$1,999.00</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Another Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-border/60 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <HugeiconsIcon icon={ArrowUpRight01Icon} size={120} />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle>Project Progress</CardTitle>
                                    <CardDescription>Overall status of current sprints</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-0">On Track</Badge>
                            </CardHeader>
                            <CardContent className="mt-4">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="font-medium flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                Frontend
                                            </span>
                                            <span className="text-muted-foreground font-mono">85%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="font-medium flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                Backend API
                                            </span>
                                            <span className="text-muted-foreground font-mono">62%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[62%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-border/60 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>Manage your team</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center -space-x-3 overflow-hidden py-2">
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground hover:z-10 hover:scale-110 transition-all shadow-sm">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-secondary/80 cursor-pointer hover:z-10 hover:scale-110 transition-all shadow-sm">
                                        +4
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button variant="outline" className="w-full">
                                        <HugeiconsIcon icon={UserGroupIcon} size={16} className="mr-2" />
                                        Manage Access
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}

// Subcomponents for cleaner code
function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
            <HugeiconsIcon icon={icon} size={20} className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-primary' : ''}`} />
            {label}
        </button>
    )
}

function MetricCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: any }) {
    return (
        <Card className="shadow-sm border-border/60 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                    <HugeiconsIcon icon={icon} size={16} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <HugeiconsIcon icon={trendUp ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={14} />
                    {trend}
                </p>
            </CardContent>
        </Card>
    )
}
