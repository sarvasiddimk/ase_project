'use client';

import { useState } from 'react';
import { Search, Plus, AlertTriangle, Package, ArrowUpDown } from 'lucide-react';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    reorderLevel: number;
    price: number;
    location: string;
}

export default function InventoryList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState<InventoryItem[]>([
        { id: '1', sku: 'OIL-5W30', name: 'Synthetic Oil 5W-30', quantity: 45, reorderLevel: 20, price: 8.50, location: 'A1' },
        { id: '2', sku: 'FLT-OIL-01', name: 'Oil Filter Type A', quantity: 12, reorderLevel: 15, price: 12.00, location: 'B2' },
        { id: '3', sku: 'BRK-PAD-F', name: 'Front Brake Pads', quantity: 8, reorderLevel: 10, price: 45.00, location: 'C3' },
        { id: '4', sku: 'WIP-22', name: 'Wiper Blade 22"', quantity: 30, reorderLevel: 10, price: 18.00, location: 'D4' },
    ]);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdjustStock = (id: string, amount: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + amount) };
            }
            return item;
        }));
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
                                const isLowStock = item.quantity <= item.reorderLevel;
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
                                                        {item.quantity}
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
                                            ${item.price.toFixed(2)}
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
