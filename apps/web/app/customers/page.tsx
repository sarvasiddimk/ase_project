'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Mail, Phone, MapPin, X, Save, User, Car } from 'lucide-react';
import { API_URL } from '../../lib/api';
import AddVehicleModal from '../vehicles/_components/AddVehicleModal';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [newCustomerId, setNewCustomerId] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        fetch(`${API_URL}/customers`)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error('Failed to fetch customers', err));
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent, shouldAddVehicle: boolean = false) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = editingCustomer ? `${API_URL}/customers/${editingCustomer.id}` : `${API_URL}/customers`;
            const method = editingCustomer ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const savedCustomer = await res.json();
                fetchCustomers();
                closeModal();
                if (shouldAddVehicle) {
                    setNewCustomerId(savedCustomer.id);
                    setIsVehicleModalOpen(true);
                }
            } else {
                alert(`Failed to ${editingCustomer ? 'update' : 'create'} customer`);
            }
        } catch (error) {
            console.error(`Error ${editingCustomer ? 'updating' : 'creating'} customer:`, error);
            alert(`Error ${editingCustomer ? 'updating' : 'creating'} customer`);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setFormData({ name: '', email: '', phone: '', address: '' });
        setEditingCustomer(undefined);
        setIsAddModalOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address || '',
        });
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingCustomer(undefined);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your customer base.</p>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Customer
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between cursor-pointer"
                                onClick={() => handleEdit(customer)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {customer.address || 'No address'}
                                </div>
                            </div>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No customers found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
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
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    <Car className="w-4 h-4" />
                                    Save & Add Vehicle
                                </button>
                                <button
                                    type="submit"
                                    onClick={(e) => handleSubmit(e, false)}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    <Save className="w-4 h-4" />
                                    {isLoading ? 'Saving...' : 'Save Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AddVehicleModal
                isOpen={isVehicleModalOpen}
                onClose={() => setIsVehicleModalOpen(false)}
                onSuccess={() => {
                    // Maybe refresh customers to show updated vehicle count if we had that?
                    // For now just close.
                }}
                preselectedCustomerId={newCustomerId}
            />
        </div>
    );
}
