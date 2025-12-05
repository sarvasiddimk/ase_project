'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Car, Plus } from 'lucide-react';
import { API_URL } from '../../../lib/api';
import AddVehicleModal from '../../vehicles/_components/AddVehicleModal';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        customerId?: string;
        vehicleId?: string;
        serviceJobId?: string;
        customerName?: string;
        vehicleInfo?: string; // Just for display if needed, though we fetch details
    };
}

export default function BookingModal({ isOpen, onClose, initialData }: BookingModalProps) {
    const [formData, setFormData] = useState({
        customerId: initialData?.customerId || '',
        vehicleId: initialData?.vehicleId || '',
        serviceJobId: initialData?.serviceJobId || '',
        date: '',
        time: '',
        serviceType: 'Oil Change',
        notes: ''
    });
    const [customerSearch, setCustomerSearch] = useState(initialData?.customerName || '');
    const [customers, setCustomers] = useState<{ id: string; name: string; email: string }[]>([]);
    const [vehicles, setVehicles] = useState<{ id: string; make: string; model: string; year: number }[]>([]);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(prev => ({
                ...prev,
                customerId: initialData.customerId || '',
                vehicleId: initialData.vehicleId || '',
                serviceJobId: initialData.serviceJobId || '',
            }));
            if (initialData.customerName) setCustomerSearch(initialData.customerName);
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (customerSearch.length > 2) {
            const timer = setTimeout(() => {
                fetch(`${API_URL}/customers?search=${customerSearch}`)
                    .then(res => res.json())
                    .then(data => setCustomers(data));
            }, 300);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setCustomers([]), 0);
            return () => clearTimeout(timer);
        }
    }, [customerSearch]);

    const fetchVehicles = () => {
        if (formData.customerId) {
            fetch(`${API_URL}/vehicles?customerId=${formData.customerId}`)
                .then(res => res.json())
                .then(data => setVehicles(data));
        } else {
            setVehicles([]);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [formData.customerId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const startTime = new Date(`${formData.date}T${formData.time}`);
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour

            const res = await fetch(`${API_URL}/scheduling`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: formData.customerId,
                    vehicleId: formData.vehicleId,
                    serviceJobId: formData.serviceJobId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    notes: `${formData.serviceType} - ${formData.notes}`,
                }),
            });

            if (res.ok) {
                onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to book appointment', error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">New Appointment</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Customer & Vehicle Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search customer..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                    />
                                    {customers.length > 0 && !formData.customerId && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {customers.map(customer => (
                                                <button
                                                    key={customer.id}
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                    onClick={() => {
                                                        setFormData({ ...formData, customerId: customer.id });
                                                        setCustomerSearch(customer.name);
                                                        setCustomers([]);
                                                    }}
                                                >
                                                    {customer.name} ({customer.email})
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <select
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                            value={formData.vehicleId}
                                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                            disabled={!formData.customerId}
                                        >
                                            <option value="">Select a vehicle...</option>
                                            {vehicles.map(vehicle => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddVehicleModalOpen(true)}
                                        disabled={!formData.customerId}
                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Add New Vehicle"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="time"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.serviceType}
                                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            >
                                <option>Oil Change</option>
                                <option>Brake Service</option>
                                <option>Tire Rotation</option>
                                <option>General Inspection</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Additional details..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isAddVehicleModalOpen}
                onClose={() => setIsAddVehicleModalOpen(false)}
                onSuccess={fetchVehicles}
                preselectedCustomerId={formData.customerId}
            />
        </>
    );
}
