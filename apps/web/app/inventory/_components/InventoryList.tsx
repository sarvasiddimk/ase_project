'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, Package, X, Save, Edit2 } from 'lucide-react';
import { API_URL } from '../../../lib/api';

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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        sku: '',
        name: '',
        quantityOnHand: 0,
        reorderLevel: 5,
        sellPrice: 0,
        location: '',
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = () => {
        fetch(`${API_URL}/inventory`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error('Failed to fetch inventory', err));
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdjustStock = async (id: string, amount: number) => {
        try {
            const res = await fetch(`${API_URL}/inventory/${id}/adjust`, {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = editingItem
                ? `${API_URL}/inventory/${editingItem.id}`
                : `${API_URL}/inventory`;

            const method = editingItem ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchInventory();
                closeModal();
            } else {
                alert('Failed to save item');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item');
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setFormData({
            sku: '',
            name: '',
            quantityOnHand: 0,
            reorderLevel: 5,
            sellPrice: 0,
            location: '',
        });
        setEditingItem(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (item: InventoryItem) => {
        setFormData(item);
        setEditingItem(item);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingItem(null);
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Details</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Level</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredItems.map((item) => {
                                const isLowStock = item.quantityOnHand <= item.reorderLevel;
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{item.location}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-bold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
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
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        onClick={() => handleAdjustStock(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-medium text-gray-900 dark:text-white">
                                            ${Number(item.sellPrice).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-end gap-1"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingItem ? 'Edit Item' : 'Add New Item'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        disabled={!editingItem} // Disable for new items
                                        className={`w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${!editingItem ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400' : ''}`}
                                        value={formData.quantityOnHand}
                                        onChange={e => setFormData({ ...formData, quantityOnHand: parseInt(e.target.value) })}
                                    />
                                    {!editingItem && <p className="text-xs text-gray-500 dark:text-gray-400">Initial stock is 0. Use Orders to add stock.</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reorder Level</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.reorderLevel}
                                        onChange={e => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sell Price ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.sellPrice}
                                        onChange={e => setFormData({ ...formData, sellPrice: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    <Save className="w-4 h-4" />
                                    {isLoading ? 'Saving...' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
