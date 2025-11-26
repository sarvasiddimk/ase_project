'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, Package, ArrowUpDown } from 'lucide-react';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    quantityOnHand: number;
    reorderLevel: number;
    sellPrice: number;
    location: string;
}

export default function InventoryList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState<InventoryItem[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/inventory')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error('Failed to fetch inventory', err));
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdjustStock = async (id: string, amount: number) => {
        try {
            const res = await fetch(`http://localhost:3000/inventory/${id}/adjust`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: amount, reason: 'Manual Adjustment' }),
            });

            if (res.ok) {
                const updatedItem = await res.json();
                setItems(items.map(item => item.id === id ? updatedItem : item));
            }
        } catch (error) {
            console.error('Failed to adjust stock', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by SKU or Name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Level</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => {
                                const isLowStock = item.quantityOnHand <= item.reorderLevel;
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{item.location}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {item.quantityOnHand}
                                                    </span>
                                                    {isLowStock && (
                                                        <div className="group relative">
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                Low Stock (Reorder: {item.reorderLevel})
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleAdjustStock(item.id, -1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        onClick={() => handleAdjustStock(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-medium text-gray-900">
                                            ${Number(item.sellPrice).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
