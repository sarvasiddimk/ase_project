'use client';

import { useState, useEffect } from 'react';
import { Search, Car, Plus, User } from 'lucide-react';
import { API_URL } from '../../lib/api';
import AddVehicleModal from './_components/AddVehicleModal';

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    customer: { id: string; name: string };
}

interface Customer {
    id: string;
    name: string;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = () => {
        fetch(`${API_URL}/vehicles`)
            .then(res => res.json())
            .then(data => setVehicles(data))
            .catch(err => console.error('Failed to fetch vehicles', err));
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingVehicle(undefined);
    };

    const filteredVehicles = vehicles.filter(v =>
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage fleet and customer vehicles.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Vehicle
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by Make, Model, or VIN..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filteredVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between cursor-pointer"
                                onClick={() => handleEdit(vehicle)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">VIN: {vehicle.vin}</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {vehicle.customer?.name || 'Unknown Owner'}
                                </div>
                            </div>
                        ))}
                        {filteredVehicles.length === 0 && (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No vehicles found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchVehicles}
                initialData={editingVehicle ? {
                    ...editingVehicle,
                    customerId: editingVehicle.customer?.id
                } : undefined}
            />
        </div>
    );
}
