'use client';

import Link from 'next/link';
import { Users, Car, Calendar, LayoutDashboard, Settings, Package, Wrench, Truck, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ThemeToggle } from './theme-toggle';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 hidden md:flex flex-col transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-center">
                    <div className="relative w-40 h-12">
                        <Image
                            src="/logo.png"
                            alt="Red Panther ASE"
                            fill
                            className="object-contain dark:invert"
                            priority
                        />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/" icon={<LayoutDashboard />} label="Dashboard" />
                    <NavLink href="/schedule" icon={<Calendar />} label="Schedule" />
                    <NavLink href="/jobs" icon={<Wrench />} label="Service Jobs" />
                    <NavLink href="/orders" icon={<Truck />} label="Orders" />
                    <NavLink href="/inventory" icon={<Package />} label="Inventory" />
                    <NavLink href="/customers" icon={<Users />} label="Customers" />
                    <NavLink href="/vehicles" icon={<Car />} label="Vehicles" />
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <NavLink href="/settings" icon={<Settings />} label="Settings" />
                    <ThemeToggle />
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative w-32 h-8">
                    <Image
                        src="/logo.png"
                        alt="Red Panther ASE"
                        fill
                        className="object-contain dark:invert"
                        priority
                    />
                </div>
                <ThemeToggle />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-30 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="relative w-32 h-10">
                                <Image
                                    src="/logo.png"
                                    alt="Red Panther ASE"
                                    fill
                                    className="object-contain dark:invert"
                                    priority
                                />
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            <NavLink href="/" icon={<LayoutDashboard />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                            <NavLink href="/schedule" icon={<Calendar />} label="Schedule" onClick={() => setIsMobileMenuOpen(false)} />
                            <NavLink href="/jobs" icon={<Wrench />} label="Service Jobs" onClick={() => setIsMobileMenuOpen(false)} />
                            <NavLink href="/orders" icon={<Truck />} label="Orders" onClick={() => setIsMobileMenuOpen(false)} />
                            <NavLink href="/inventory" icon={<Package />} label="Inventory" onClick={() => setIsMobileMenuOpen(false)} />
                            <NavLink href="/customers" icon={<Users />} label="Customers" onClick={() => setIsMobileMenuOpen(false)} />
                            <NavLink href="/vehicles" icon={<Car />} label="Vehicles" onClick={() => setIsMobileMenuOpen(false)} />
                        </nav>
                        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                            <NavLink href="/settings" icon={<Settings />} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto pt-16 md:pt-0 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
        >
            <span className="h-5 w-5 [&>svg]:h-full [&>svg]:w-full">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
