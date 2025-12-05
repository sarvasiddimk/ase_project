'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { API_URL } from '../../../lib/api';
import { VEHICLE_MAKES } from '../../../lib/vehicle-data';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    preselectedCustomerId?: string;
    initialData?: {
        id: string;
        make: string;
        model: string;
        year: number;
        vin: string;
        customerId: string;
    };
}

export default function AddVehicleModal({ isOpen, onClose, onSuccess, preselectedCustomerId, initialData }: AddVehicleModalProps) {
    const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        customerId: preselectedCustomerId || '',
    });

    const [availableModels, setAvailableModels] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchCustomers();
            if (initialData) {
                setFormData({
                    make: initialData.make,
                    model: initialData.model,
                    year: initialData.year,
                    vin: initialData.vin,
                    customerId: initialData.customerId,
                });
            } else {
                setFormData(prev => ({
                    make: '',
                    model: '',
                    year: new Date().getFullYear(),
                    vin: '',
                    customerId: preselectedCustomerId || prev.customerId
                }));
            }
        }
    }, [isOpen, preselectedCustomerId, initialData]);

    useEffect(() => {
        const selectedMake = VEHICLE_MAKES.find(m => m.make === formData.make);
        setAvailableModels(selectedMake ? selectedMake.models : []);
    }, [formData.make]);

    const fetchCustomers = () => {
        fetch(`${API_URL}/customers`)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error('Failed to fetch customers', err));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = initialData ? `${API_URL}/vehicles/${initialData.id}` : `${API_URL}/vehicles`;
            const method = initialData ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onSuccess();
                onClose();
                if (!initialData) {
                    setFormData({
                        make: '',
                        model: '',
                        year: new Date().getFullYear(),
                        vin: '',
                        customerId: '',
                    });
                }
            } else {
                alert(`Failed to ${initialData ? 'update' : 'create'} vehicle`);
            }
        } catch (error) {
            console.error(`Error ${initialData ? 'updating' : 'creating'} vehicle:`, error);
            alert(`Error ${initialData ? 'updating' : 'creating'} vehicle`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                        <select
                            required
                            className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.customerId}
                            onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                            disabled={!!preselectedCustomerId}
                        >
                            <option value="">Select a customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                            <input
                                type="number"
                                required
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Make</label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.make}
                                onChange={e => setFormData({ ...formData, make: e.target.value, model: '' })}
                            >
                                <option value="">Select Make...</option>
                                {VEHICLE_MAKES.map(m => (
                                    <option key={m.make} value={m.make}>{m.make}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
                            {formData.make === 'Other' ? (
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                />
                            ) : (
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    disabled={!formData.make}
                                >
                                    <option value="">Select Model...</option>
                                    {availableModels.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">VIN</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.vin}
                                onChange={e => setFormData({ ...formData, vin: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
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
                            {isLoading ? 'Saving...' : 'Save Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
