'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, MapPin, Car, FileText, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { API_URL } from '../../../lib/api';

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin: string;
    jobs?: Job[];
}

interface Job {
    id: string;
    description: string;
    status: string;
    createdAt: string;
    vehicle: Vehicle;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    vehicles: Vehicle[];
    jobs: Job[];
}

export default function CustomerDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/customers/${id}`)
                .then(res => res.json())
                .then(data => {
                    setCustomer(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch customer', err);
                    setIsLoading(false);
                });
        }
    }, [id]);

    if (isLoading) return <div className="p-8 text-center">Loading customer details...</div>;
    if (!customer) return <div className="p-8 text-center">Customer not found</div>;

    // Flatten jobs from all vehicles to show history
    const allJobs = customer.vehicles.flatMap(v =>
        (v.jobs || []).map(j => ({ ...j, vehicle: `${v.year} ${v.make} ${v.model}` }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <Link href="/customers" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Customers
            </Link>

            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {customer.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {customer.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {customer.address || 'No address provided'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Future: Edit Customer Button */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vehicles Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Car className="w-4 h-4" />
                                Vehicles
                            </h3>
                            {/* We could link to Add Vehicle modal here, pre-filling customer */}
                        </div>
                        <div className="divide-y divide-gray-100">
                            {customer.vehicles.length > 0 ? (
                                customer.vehicles.map(vehicle => (
                                    <Link
                                        key={vehicle.id}
                                        href={`/vehicles/${vehicle.id}`}
                                        className="block p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        <div className="text-xs text-gray-500 font-mono mt-1">{vehicle.vin}</div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">No vehicles found.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Service History Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Service History
                            </h3>
                            <Link
                                href={`/jobs/new?customerId=${customer.id}`}
                                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                Start New Job
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {allJobs.length > 0 ? (
                                allJobs.map(job => (
                                    <Link
                                        key={job.id}
                                        href={`/jobs/${job.id}`}
                                        className="block p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium text-gray-900">{job.description}</div>
                                                <div className="text-xs text-gray-500 mt-1">{job.vehicle}</div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No service history found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
