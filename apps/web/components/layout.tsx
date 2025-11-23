import Link from 'next/link';
import { Wrench, Users, Car, Calendar, LayoutDashboard, Settings } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <Wrench className="h-6 w-6" />
                        Red Panther
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/" icon={<LayoutDashboard />} label="Dashboard" />
                    <NavLink href="/jobs" icon={<Calendar />} label="Service Jobs" />
                    <NavLink href="/customers" icon={<Users />} label="Customers" />
                    <NavLink href="/vehicles" icon={<Car />} label="Vehicles" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <NavLink href="/settings" icon={<Settings />} label="Settings" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200 p-4 md:hidden">
                    <h1 className="text-lg font-bold text-red-600">Red Panther ASE</h1>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
        >
            {/* Clone icon to enforce size if needed, but standard size is usually fine */}
            <span className="h-5 w-5 [&>svg]:h-full [&>svg]:w-full">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
