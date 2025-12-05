'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, FileText, Plus, User, Calendar, Hash, Pencil } from 'lucide-react';
import { useParams } from 'next/navigation';
import { API_URL } from '../../../lib/api';
import AddVehicleModal from '../_components/AddVehicleModal';

interface Job {
    id: string;
    status: string;
    description: string;
    createdAt: string;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    customer: Customer;
    jobs: Job[];
}

export default function VehicleDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchVehicle = () => {
        if (!id) return;
        setIsLoading(true);
        fetch(`${API_URL}/vehicles/${id}`)
            .then(res => res.json())
            .then(data => {
                setVehicle(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch vehicle', err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchVehicle();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center">Loading vehicle details...</div>;
    if (!vehicle) return <div className="p-8 text-center">Vehicle not found</div>;

    const sortedJobs = (vehicle.jobs || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <Link href="/vehicles" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Vehicles
            </Link>

            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            <Car className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2 font-mono bg-gray-50 px-2 py-1 rounded">
                                    <Hash className="w-3 h-3 text-gray-400" />
                                    {vehicle.vin}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Vehicle
                    </button>
                </div>

                {/* Owner Info Bar */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Owner:</span>
                    {vehicle.customer ? (
                        <Link href={`/customers/${vehicle.customer.id}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {vehicle.customer.name}
                        </Link>
                    ) : (
                        <span className="text-gray-400 italic">Unknown Owner</span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Service History
                        </h3>
                        <Link
                            href={`/jobs/new?vehicleId=${vehicle.id}&customerId=${vehicle.customer?.id}`}
                            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" />
                            Start New Job
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {sortedJobs.length > 0 ? (
                            sortedJobs.map(job => (
                                <Link
                                    key={job.id}
                                    href={`/jobs/${job.id}`}
                                    className="block p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium text-gray-900">{job.description}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No service history found for this vehicle.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    fetchVehicle();
                }}
                initialData={{
                    ...vehicle,
                    customerId: vehicle.customer?.id
                }}
            />
        </div>
    );
}
