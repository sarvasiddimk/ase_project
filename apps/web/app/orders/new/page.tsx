'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '../../../lib/api';

interface InventoryItem {
    id: string;
    name: string;
    sku: string;
}

interface OrderItem {
    inventoryItemId: string;
    quantity: number;
    costPrice: number;
}

function NewOrderForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [supplierId, setSupplierId] = useState('');
    const [items, setItems] = useState<OrderItem[]>([{
        inventoryItemId: searchParams.get('inventoryItemId') || '',
        quantity: 1,
        costPrice: 0
    }]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch suppliers
        fetch(`${API_URL}/orders/suppliers`)
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error('Failed to fetch suppliers', err));

        // Fetch inventory for item selection
        fetch(`${API_URL}/inventory`)
            .then(res => res.json())
            .then(data => setInventory(data))
            .catch(err => console.error('Failed to fetch inventory', err));
    }, []);

    const handleAddItem = () => {
        setItems([...items, { inventoryItemId: '', quantity: 1, costPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Note: Since I didn't implement GET /suppliers, I can't get real UUIDs.
        // I will need to implement GET /suppliers in the backend to make this work properly.
        // For now, I will fail if I try to submit with fake IDs.
        // I should probably fix the backend to expose suppliers.

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ supplierId, items }),
            });

            if (res.ok) {
                router.push('/orders');
            } else {
                alert('Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error creating order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/orders" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Orders
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Supplier</label>
                        <select
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={supplierId}
                            onChange={e => setSupplierId(e.target.value)}
                        >
                            <option value="">Select a supplier...</option>
                            {/* This will be empty until I fix the supplier fetching */}
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-red-500">Note: Suppliers need to be fetched from API. (I need to add GET /suppliers)</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Order Items</h3>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Item</label>
                                        <select
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white"
                                            value={item.inventoryItemId}
                                            onChange={e => updateItem(index, 'inventoryItemId', e.target.value)}
                                        >
                                            <option value="">Select Item...</option>
                                            {inventory.map(i => (
                                                <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Qty</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                                            value={item.quantity}
                                            onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Cost ($)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                                            value={item.costPrice}
                                            onChange={e => updateItem(index, 'costPrice', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="mt-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Creating...' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function NewOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <NewOrderForm />
        </Suspense>
    );
}
