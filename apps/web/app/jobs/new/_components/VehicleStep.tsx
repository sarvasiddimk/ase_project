'use client';

import { useState, useEffect } from 'react';
import { Car, Plus, Check } from 'lucide-react';
import { StepProps } from './types';

export default function VehicleStep({ state, updateState, onNext, onBack }: StepProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ vin: '', make: '', model: '', year: new Date().getFullYear() });

    const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);

    useEffect(() => {
        if (state.customer?.id) {
            fetch(`http://localhost:3000/vehicles?customerId=${state.customer.id}`)
                .then(res => res.json())
                .then(data => setCustomerVehicles(data))
                .catch(err => console.error('Failed to fetch vehicles', err));
        }
    }, [state.customer?.id]);

    const handleSelect = (vehicle: any) => {
        updateState({ vehicle });
        onNext();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newVehicle, customerId: state.customer?.id }),
            });
            if (res.ok) {
                const createdVehicle = await res.json();
                updateState({ vehicle: createdVehicle });
                onNext();
            }
        } catch (error) {
            console.error('Error creating vehicle:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Which vehicle?</h2>
                <p className="text-gray-500">Select a vehicle for {state.customer?.name}.</p>
            </div>

            {!isCreating ? (
                <div className="space-y-4">
                    {customerVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {customerVehicles.map((vehicle) => (
                                <button
                                    key={vehicle.id}
                                    onClick={() => handleSelect(vehicle)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                                        <Car className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        <div className="text-sm text-gray-500">VIN: {vehicle.vin}</div>
                                    </div>
                                    <Check className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No vehicles found for this customer.</p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Vehicle
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                            value={newVehicle.vin}
                            onChange={e => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newVehicle.make}
                                onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newVehicle.model}
                                onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                            required
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newVehicle.year}
                            onChange={e => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
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
                            Add Vehicle
                        </button>
                    </div>
                </form>
            )}

            {!isCreating && (
                <button
                    onClick={onBack}
                    className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                    Back to Customer Selection
                </button>
            )}
        </div>
    );
}
