'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, Clock, Plus, Users, Car, AlertTriangle, ArrowRight, Package } from 'lucide-react';
import { API_URL } from '../lib/api';

interface Job {
  id: string;
  customer: { name: string };
  vehicle: { year: number; make: string; model: string };
  status: string;
  description: string;
}

interface Appointment {
  id: string;
  startTime: string;
  customer: { name: string };
  vehicle: { year: number; make: string; model: string };
  status: string;
  notes: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantityOnHand: number;
  reorderLevel: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ today: 0, inProgress: 0, completed: 0 });
  const [schedule, setSchedule] = useState<Appointment[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Appointments for Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const scheduleRes = await fetch(`${API_URL}/scheduling?start=${today.toISOString()}&end=${tomorrow.toISOString()}`);
        const scheduleData = await scheduleRes.json();
        setSchedule(scheduleData);

        // Fetch Active Jobs
        const jobsRes = await fetch(`${API_URL}/service-jobs`);
        const jobsData: Job[] = await jobsRes.json();

        const inProgress = jobsData.filter(j => j.status === 'IN_PROGRESS').length;
        const completed = jobsData.filter(j => j.status === 'COMPLETED').length;

        setStats({
          today: scheduleData.length,
          inProgress,
          completed
        });

        // Fetch Low Stock Items
        const inventoryRes = await fetch(`${API_URL}/inventory`);
        const inventoryData: InventoryItem[] = await inventoryRes.json();
        const lowStock = inventoryData.filter(i => i.quantityOnHand <= i.reorderLevel);
        setLowStockItems(lowStock.slice(0, 5)); // Top 5

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Technician Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/schedule">
              <StatCard
                title="Appointments Today"
                value={stats.today.toString()}
                icon={<Calendar className="text-blue-500" />}
                color="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-800"
              />
            </Link>
            <Link href="/jobs?status=IN_PROGRESS">
              <StatCard
                title="Jobs In Progress"
                value={stats.inProgress.toString()}
                icon={<Clock className="text-orange-500" />}
                color="bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:border-orange-800"
              />
            </Link>
            <Link href="/jobs?status=COMPLETED">
              <StatCard
                title="Jobs Completed"
                value={stats.completed.toString()}
                icon={<CheckCircle2 className="text-green-500" />}
                color="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-800"
              />
            </Link>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Today&apos;s Schedule
              </h3>
              <Link href="/schedule" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View Calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {schedule.length > 0 ? (
                schedule.map((apt) => (
                  <div key={apt.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{apt.customer?.name || 'Unknown Customer'}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : 'No Vehicle'} • {apt.notes}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-400 dark:text-gray-500 text-sm font-mono bg-gray-50 dark:bg-slate-900 px-2 py-1 rounded">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No appointments scheduled for today.</div>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-red-100 dark:border-red-900/50 overflow-hidden">
              <div className="p-4 border-b border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 flex justify-between items-center">
                <h3 className="font-semibold text-red-900 dark:text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Low Stock Alerts
                </h3>
                <Link href="/inventory" className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                  Manage Inventory <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-red-50 dark:divide-red-900/20">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between items-center hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                          Only {item.quantityOnHand} left (Reorder at {item.reorderLevel})
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/orders/new?inventoryItemId=${item.id}`}
                      className="text-xs bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Order Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="p-2 space-y-1">
              <QuickActionButton href="/jobs/new" icon={<Plus className="w-4 h-4" />} label="New Job" color="text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400" />
              <QuickActionButton href="/customers" icon={<Users className="w-4 h-4" />} label="New Customer" color="text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400" />
              <QuickActionButton href="/vehicles" icon={<Car className="w-4 h-4" />} label="New Vehicle" color="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400" />
              <QuickActionButton href="/schedule" icon={<Calendar className="w-4 h-4" />} label="New Appointment" color="text-teal-600 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/30 dark:text-teal-400" />
              <QuickActionButton href="/orders/new" icon={<Package className="w-4 h-4" />} label="Order Parts" color="text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center justify-between transition-all cursor-pointer ${color}`}>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
        {icon}
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${color}`}
    >
      {icon}
      {label}
    </Link>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'SCHEDULED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'CONFIRMED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    case 'COMPLETED': return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300';
  }
}
