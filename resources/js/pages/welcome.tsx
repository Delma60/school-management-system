import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Building2, Calendar, ChevronRight, GraduationCap, MapPin, Phone, Users } from 'lucide-react';
import React from 'react';

// Define the types coming from your Laravel Backend
interface WelcomeProps {
    canLogin: boolean;
    stats: { students: number; teachers: number; courses: number };
    events: Array<{ id: number; title: string; date: string; day: string; month: string; type: string }>;
    school: { name: string; email: string; phone: string; address: string; logo: string | null };
}

export default function Welcome({ canLogin, stats, events, school }: WelcomeProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground font-sans selection:bg-primary/30">
            <Head title={`Welcome to ${school?.name}`} />

            {/* SLEEK NAVIGATION */}
            <header className="absolute top-0 w-full z-50 bg-transparent border-b border-white/10">
                <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        {school.logo ? (
                            <img src={`/storage/${school?.logo}`} alt="Logo" className="h-10 w-10 object-contain" />
                        ) : (
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Building2 className="h-6 w-6" />
                            </div>
                        )}
                        <span className="font-bold text-xl tracking-tight hidden sm:block">{school.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {canLogin ? (
                            <Button asChild className="rounded-full px-6 bg-white text-slate-900 hover:bg-slate-100 shadow-xl">
                                <Link href={route('login')}>
                                    Student / Staff Portal <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild className="rounded-full px-6 bg-white text-slate-900 hover:bg-slate-100 shadow-xl">
                                <Link href="/dashboard">Return to Dashboard</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* DYNAMIC SPLIT HERO SECTION */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900 overflow-hidden">
                    {/* Abstract Background Elements */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                            {/* Left Content */}
                            <div className="max-w-2xl text-white">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                                    Discover a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">brighter</span> future today.
                                </h1>
                                <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                                    Join {school.name}, where academic excellence meets holistic development. We prepare students not just for exams, but for life.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/25">
                                        Enroll Your Child
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                                        View Prospectus
                                    </Button>
                                </div>
                            </div>

                            {/* Right Masonry Image Grid */}
                            <div className="hidden lg:grid grid-cols-2 gap-4 h-[500px]">
                                <div className="space-y-4 pt-12">
                                    <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-48 w-full object-cover shadow-2xl" alt="Students learning" />
                                    <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-64 w-full object-cover shadow-2xl" alt="Classroom" />
                                </div>
                                <div className="space-y-4">
                                    <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-64 w-full object-cover shadow-2xl" alt="Campus" />
                                    <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-48 w-full object-cover shadow-2xl" alt="Library" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DB-POWERED FLOATING STATS BAR */}
                <div className="container mx-auto px-4 md:px-8 relative z-20 -mt-12 sm:-mt-16">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x dark:divide-slate-800 text-center">
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-3">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold">{stats.students > 0 ? `${stats.students}+` : 'Loading...'}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Active Students</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-3">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold">{stats.teachers > 0 ? `${stats.teachers}+` : 'Expert'}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Qualified Teachers</p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-3">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold">{stats.courses}+</h3>
                            <p className="text-sm text-muted-foreground mt-1">Subjects & Courses</p>
                        </div>
                    </div>
                </div>

                {/* DB-POWERED UPCOMING EVENTS */}
                <section className="py-24 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Upcoming School Events</h2>
                                <p className="text-muted-foreground text-lg">
                                    Stay updated with the latest activities, exams, and holidays at {school.name}.
                                </p>
                            </div>
                            <Button variant="outline" className="rounded-full">View All Events</Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {events.length > 0 ? events.map((event) => (
                                <div key={event.id} className="group bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="p-6 flex gap-6">
                                        {/* Date Block */}
                                        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 border rounded-xl min-w-[80px] h-[90px] group-hover:bg-primary group-hover:border-primary transition-colors">
                                            <span className="text-2xl font-bold group-hover:text-white">{event.day}</span>
                                            <span className="text-sm font-medium text-muted-foreground group-hover:text-white/80 uppercase">{event.month}</span>
                                        </div>
                                        {/* Event Info */}
                                        <div className="flex flex-col justify-center">
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{event.type}</span>
                                            <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="mr-2 h-4 w-4" /> {event.date}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-16 bg-white dark:bg-slate-900 border rounded-2xl border-dashed">
                                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                    <h3 className="text-lg font-medium">No upcoming events right now.</h3>
                                    <p className="text-muted-foreground">Check back later for the new academic calendar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* DYNAMIC FOOTER */}
                <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
                            <div className="col-span-1 md:col-span-2 space-y-6">
                                <div className="flex items-center gap-3 text-white">
                                    <Building2 className="h-8 w-8 text-primary" />
                                    <span className="font-bold text-2xl tracking-tight">{school.name}</span>
                                </div>
                                <p className="text-slate-400 max-w-sm leading-relaxed">
                                    Providing exceptional education and fostering a community of lifelong learners prepared for the challenges of tomorrow.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-6 text-lg">Contact Info</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                                        <MapPin className="h-5 w-5 text-primary shrink-0" />
                                        <span>{school.address}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                                        <Phone className="h-5 w-5 text-primary shrink-0" />
                                        <span>{school.phone}</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li><Link href={route('login')} className="hover:text-primary transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1"/> Staff Portal</Link></li>
                                    <li><Link href={route('login')} className="hover:text-primary transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1"/> Student Portal</Link></li>
                                    <li><a href="#" className="hover:text-primary transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-1"/> Academic Calendar</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between">
                            <p>&copy; {new Date().getFullYear()} {school.name}. All rights reserved.</p>
                            <p className="mt-2 md:mt-0">Powered by SMS Platform</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
