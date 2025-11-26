'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import { StepProps } from './types';

export default function CustomerStep({ state, updateState, onNext }: StepProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });

    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        if (searchQuery.length > 2) {
            const timer = setTimeout(async () => {
                try {
                    const res = await fetch(`http://localhost:3000/customers?search=${searchQuery}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSearchResults(data);
                    }
                } catch (error) {
                    console.error('Failed to search customers:', error);
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleSelect = (customer: any) => {
        updateState({ customer });
        onNext();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomer),
            });

            if (res.ok) {
                const createdCustomer = await res.json();
                updateState({ customer: createdCustomer });
                onNext();
            } else {
                console.error('Failed to create customer');
            }
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Who is this job for?</h2>
                <p className="text-gray-500">Search for an existing customer or create a new one.</p>
            </div>

            {!isCreating ? (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {searchQuery.length > 2 && (
                        <div className="space-y-2">
                            {searchResults.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleSelect(customer)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold text-gray-900">{customer.name}</div>
                                            <div className="text-sm text-gray-500">{customer.email} • {customer.phone}</div>
                                        </div>
                                        <Check className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Create New Customer
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newCustomer.name}
                            onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newCustomer.email}
                                onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                required
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newCustomer.phone}
                                onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newCustomer.address}
                            onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Customer
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
