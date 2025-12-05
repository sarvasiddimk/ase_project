'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Truck, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '../../lib/api';

interface Order {
    id: string;
    status: string;
    createdAt: string;
    supplier: { name: string };
    items: { quantity: number }[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/orders`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error('Orders data is not an array:', data);
                    setOrders([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch orders', err);
                setOrders([]);
            });
    }, []);

    const filteredOrders = orders.filter(o =>
        o.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RECEIVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'ORDERED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'DRAFT': return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage supplier orders and inventory restocking.</p>
                    </div>
                    <Link
                        href="/orders/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Order
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filteredOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block p-4 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(order.status).replace('text-', 'bg-opacity-20 text-')}`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white">{order.supplier?.name || 'Unknown Supplier'}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="font-mono text-xs">#{order.id.slice(0, 8)}</div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-3 h-3" />
                                                    {order.items.length} Items
                                                </div>
                                                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </Link>
                        ))}
                        {filteredOrders.length === 0 && (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No orders found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
