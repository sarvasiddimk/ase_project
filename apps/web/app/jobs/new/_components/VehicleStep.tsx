'use client';

import { useState, useEffect } from 'react';
import { Car, Plus, Check } from 'lucide-react';
import { StepProps } from './types';
import { API_URL } from '../../../../lib/api';
import AddVehicleModal from '../../../vehicles/_components/AddVehicleModal';

interface Vehicle {
    id: string;
    vin: string;
    make: string;
    model: string;
    year: number;
}

export default function VehicleStep({ state, updateState, onNext, onBack }: StepProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerVehicles, setCustomerVehicles] = useState<Vehicle[]>([]);

    const fetchVehicles = () => {
        if (state.customer?.id) {
            fetch(`${API_URL}/vehicles?customerId=${state.customer.id}`)
                .then(res => res.json())
                .then(data => setCustomerVehicles(data))
                .catch(err => console.error('Failed to fetch vehicles', err));
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [state.customer?.id]);

    const handleSelect = (vehicle: Vehicle) => {
        updateState({ vehicle });
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Which vehicle?</h2>
                <p className="text-gray-500">Select a vehicle for {state.customer?.name}.</p>
            </div>

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
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Vehicle
                    </button>
                </div>
            </div>

            <button
                onClick={onBack}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
                Back to Customer Selection
            </button>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchVehicles}
                preselectedCustomerId={state.customer?.id}
            />
        </div>
    );
}
