'use client';

import { useEffect, useState } from 'react';
import InventoryList from './_components/InventoryList';
import { Package, AlertTriangle, DollarSign } from 'lucide-react';
import { API_URL } from '../../lib/api';

export default function InventoryPage() {
    const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, totalValue: 0 });

    useEffect(() => {
        fetch(`${API_URL}/inventory`)
            .then(res => res.json())
            .then(data => {
                const totalItems = data.length;
                const lowStock = data.filter((i: any) => i.quantityOnHand <= i.reorderLevel).length;
                const totalValue = data.reduce((sum: number, i: any) => sum + (i.quantityOnHand * i.sellPrice), 0);
                setStats({ totalItems, lowStock, totalValue });
            })
            .catch(err => console.error('Failed to fetch inventory stats', err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track parts, manage stock levels, and handle reordering.</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Items"
                        value={stats.totalItems.toString()}
                        icon={<Package className="text-blue-500" />}
                    />
                    <StatCard
                        title="Low Stock Alerts"
                        value={stats.lowStock.toString()}
                        icon={<AlertTriangle className="text-red-500" />}
                        alert={stats.lowStock > 0}
                    />
                    <StatCard
                        title="Total Value"
                        value={`$${stats.totalValue.toFixed(2)}`}
                        icon={<DollarSign className="text-green-500" />}
                    />
                </div>

                <InventoryList />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, alert }: { title: string; value: string; icon: React.ReactNode; alert?: boolean }) {
    return (
        <div className={`bg-white dark:bg-slate-950 p-6 rounded-xl shadow-sm border ${alert ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'border-gray-200 dark:border-slate-800'} flex items-center justify-between transition-colors`}>
            <div>
                <p className={`text-sm font-medium ${alert ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>{title}</p>
                <p className={`text-2xl font-bold ${alert ? 'text-red-900 dark:text-red-300' : 'text-gray-900 dark:text-white'}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${alert ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-slate-900'}`}>
                {icon}
            </div>
        </div>
    );
}
