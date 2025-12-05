'use client';

import { useState, useEffect, Suspense } from 'react';
import { Search, Plus, Calendar, Car, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '../../lib/api';
import { useSearchParams } from 'next/navigation';

interface Job {
    id: string;
    status: string;
    description: string;
    customer: { name: string };
    vehicle: { year: number; make: string; model: string };
    createdAt: string;
}

function JobsList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status');

    useEffect(() => {
        fetch(`${API_URL}/service-jobs`)
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(err => console.error('Failed to fetch jobs', err));
    }, []);

    const filteredJobs = jobs.filter(j => {
        const matchesSearch =
            j.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.vehicle?.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.vehicle?.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter ? j.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Service Jobs</h1>
                        <p className="text-gray-500">
                            {statusFilter ? `Showing ${statusFilter.replace('_', ' ')} jobs` : 'Manage active and past service jobs.'}
                            {statusFilter && (
                                <Link href="/jobs" className="ml-2 text-sm text-blue-600 hover:underline">
                                    (Clear Filter)
                                </Link>
                            )}
                        </p>
                    </div>
                    <Link
                        href="/jobs/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Job
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredJobs.map((job) => (
                            <Link
                                key={job.id}
                                href={`/jobs/${job.id}`}
                                className="block p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(job.status).replace('text-', 'bg-opacity-20 text-')}`}>
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">{job.description || 'Untitled Job'}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(job.status)}`}>
                                                    {job.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {job.customer?.name || 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Car className="w-3 h-3" />
                                                    {job.vehicle ? `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}` : 'No Vehicle'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </Link>
                        ))}
                        {filteredJobs.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No jobs found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <JobsList />
        </Suspense>
    );
}
