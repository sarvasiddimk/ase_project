'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, DollarSign, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { API_URL } from '../../../lib/api';

interface OrderItem {
    id: string;
    inventoryItem: {
        name: string;
        sku: string;
        price: number;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    costPrice: number;
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
    supplier: { name: string; email: string; phone: string }; // Re-adding supplier as it's used in the JSX
}

export default function OrderDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrder = () => {
        if (!id) return;
        fetch(`${API_URL}/orders/${id}`)
            .then(res => res.json())
            .then(data => {
                setOrder(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch order', err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleReceiveOrder = async () => {
        if (!order) return;
        try {
            const res = await fetch(`${API_URL}/orders/${order.id}/receive`, {
                method: 'POST',
            });
            if (res.ok) {
                fetchOrder();
            } else {
                alert('Failed to receive order');
            }
        } catch (error) {
            console.error('Error receiving order:', error);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center">Order not found (Did you implement GET /orders/:id?)</div>;

    const totalCost = order.items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <Link href="/orders" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Orders
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'RECEIVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500">Supplier: {order.supplier?.name}</p>
                    </div>
                    <div>
                        {order.status !== 'RECEIVED' && (
                            <button
                                onClick={handleReceiveOrder}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Receive Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50">
                    <div className="p-4 flex items-center gap-3">
                        <Truck className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Supplier Details</p>
                            <p className="font-medium text-gray-900">{order.supplier?.name}</p>
                            <p className="text-xs text-gray-500">{order.supplier?.email} • {order.supplier?.phone}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Order Date</p>
                            <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3 w-24 text-center">Qty</th>
                                    <th className="px-4 py-3 w-32 text-right">Cost</th>
                                    <th className="px-4 py-3 w-32 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{item.inventoryItem?.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{item.inventoryItem?.sku}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-gray-500">${Number(item.costPrice).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            ${(item.quantity * item.costPrice).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold border-t border-gray-200">
                                    <td colSpan={3} className="px-4 py-3 text-right text-gray-900">Total Cost</td>
                                    <td className="px-4 py-3 text-right text-blue-600">${totalCost.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
