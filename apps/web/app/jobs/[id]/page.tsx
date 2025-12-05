'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Car, Calendar, FileText, CheckCircle, Plus, X, Package, Wrench, Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import BookingModal from '../../schedule/_components/BookingModal';
import { API_URL } from '../../../lib/api';

interface JobItem {
    id: string;
    type: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface Job {
    id: string;
    status: string;
    description: string;
    customer: { id: string; name: string; email: string; phone: string };
    vehicle: { id: string; year: number; make: string; model: string; vin: string };
    items: JobItem[];
    invoice?: { id: string; status: string; totalAmount: number };
    createdAt: string;
}

interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantityOnHand: number;
}

const JOB_STEPS = [
    { id: 'PENDING', label: 'Draft' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'PAID', label: 'Paid' }
];

export default function JobDetail() {
    const params = useParams();
    const id = params?.id as string;
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    // Modals
    const [isPartModalOpen, setIsPartModalOpen] = useState(false);
    const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Forms
    const [partForm, setPartForm] = useState({ inventoryItemId: '', quantity: 1 });
    const [laborForm, setLaborForm] = useState({ description: '', hours: 1, rate: 80 });

    useEffect(() => {
        if (id) {
            fetchJob();
            fetchInventory();
        }
    }, [id]);

    const fetchJob = () => {
        if (!id) return;
        fetch(`${API_URL}/service-jobs/${id}`)
            .then(async res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        setJob(null);
                    }
                    throw new Error('Failed to fetch job');
                }
                return res.json();
            })
            .then(data => {
                setJob({ ...data, items: data.items || [] });
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch job', err);
                setIsLoading(false);
            });
    };

    const fetchInventory = () => {
        fetch(`${API_URL}/inventory`)
            .then(res => res.json())
            .then(data => setInventory(data))
            .catch(err => console.error('Failed to fetch inventory', err));
    };

    const handleAddPart = async (e: React.FormEvent) => {
        e.preventDefault();
        const item = inventory.find(i => i.id === partForm.inventoryItemId);
        if (!item) return;

        try {
            const res = await fetch(`${API_URL}/job-items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceJobId: job?.id,
                    type: 'PART',
                    description: item.name,
                    quantity: partForm.quantity,
                    unitPrice: item.price,
                    inventoryItemId: item.id
                }),
            });

            if (res.ok) {
                fetchJob();
                setIsPartModalOpen(false);
                setPartForm({ inventoryItemId: '', quantity: 1 });
            } else {
                const err = await res.json();
                alert(`Failed to add part: ${err.message}`);
            }
        } catch (error) {
            console.error('Error adding part:', error);
        }
    };

    const handleAddLabor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/job-items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceJobId: job?.id,
                    type: 'LABOR',
                    description: laborForm.description,
                    quantity: laborForm.hours,
                    unitPrice: laborForm.rate,
                }),
            });

            if (res.ok) {
                fetchJob();
                setIsLaborModalOpen(false);
                setLaborForm({ description: '', hours: 1, rate: 80 });
            } else {
                alert('Failed to add labor');
            }
        } catch (error) {
            console.error('Error adding labor:', error);
        }
    };

    const handleGenerateInvoice = async () => {
        if (!job) return;
        try {
            const res = await fetch(`${API_URL}/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId: job.id }),
            });
            if (res.ok) {
                fetchJob();
            } else {
                alert('Failed to generate invoice');
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        if (!job) return;
        try {
            const res = await fetch(`${API_URL}/service-jobs/${job.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                fetchJob();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading job details...</div>;
    if (!job) return <div className="p-8 text-center">Job not found</div>;

    const total = job.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    const currentStepIndex = JOB_STEPS.findIndex(s => s.id === job.status);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <Link href="/jobs" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Jobs
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Job #{job.id.slice(0, 8)}</h1>
                            <p className="text-gray-500">{job.description}</p>
                        </div>
                        <div className="flex gap-2">
                            {job.status === 'COMPLETED' && !job.invoice && (
                                <button
                                    onClick={handleGenerateInvoice}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Generate Invoice
                                </button>
                            )}
                            {job.invoice && (
                                <Link
                                    href={`/invoices/${job.invoice.id}`}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    View Invoice
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Status Stepper */}
                    <div className="w-full px-4 md:px-12">
                        <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 -z-10" />
                            <div
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-500 ease-in-out"
                                style={{ width: `${(currentStepIndex / (JOB_STEPS.length - 1)) * 100}%` }}
                            />
                            {JOB_STEPS.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => handleUpdateStatus(step.id)}
                                        className={`group flex flex-col items-center gap-2 bg-white px-2 transition-colors ${isCompleted ? 'text-blue-600' : 'text-gray-400'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-110'
                                            : 'bg-white border-gray-200 group-hover:border-gray-300'
                                            }`}>
                                            {index < currentStepIndex ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <span className="text-xs font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium ${isCurrent ? 'text-blue-700 font-bold' : ''}`}>
                                            {step.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50">
                    <div className="p-4 flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
                            <p className="font-medium text-gray-900">{job.customer?.name}</p>
                            <p className="text-xs text-gray-500">{job.customer?.phone}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <Car className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Vehicle</p>
                            <p className="font-medium text-gray-900">{job.vehicle ? `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}` : 'N/A'}</p>
                            <p className="text-xs text-gray-500 font-mono">{job.vehicle?.vin}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Created</p>
                            <p className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Job Items */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Job Items & Services</h3>
                        {job.status !== 'COMPLETED' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsPartModalOpen(true)}
                                    className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                    <Package className="w-3 h-3" />
                                    Add Part
                                </button>
                                <button
                                    onClick={() => setIsLaborModalOpen(true)}
                                    className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                    <Wrench className="w-3 h-3" />
                                    Add Labor
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3 w-24 text-center">Type</th>
                                    <th className="px-4 py-3 w-24 text-center">Qty/Hrs</th>
                                    <th className="px-4 py-3 w-32 text-right">Rate</th>
                                    <th className="px-4 py-3 w-32 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {job.items.length > 0 ? (
                                    job.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                                            <td className="px-4 py-3 text-center text-xs text-gray-500">{item.type}</td>
                                            <td className="px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-500">${Number(item.unitPrice).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                ${Number(item.totalPrice).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No items added to this job yet.
                                        </td>
                                    </tr>
                                )}
                                <tr className="bg-gray-50 font-bold border-t border-gray-200">
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-900">Total Estimated</td>
                                    <td className="px-4 py-3 text-right text-blue-600">${total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Invoice Section */}
                {job.invoice && (
                    <div className="p-6 border-t border-gray-100 bg-green-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Invoice Generated</h3>
                                <p className="text-sm text-gray-600">
                                    Invoice #{job.invoice.id.slice(0, 8)} • Status: <span className="font-medium uppercase">{job.invoice.status}</span>
                                </p>
                            </div>
                            <div className="ml-auto">
                                <Link
                                    href={`/invoices/${job.invoice.id}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                                >
                                    View Details &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Part Modal */}
            {isPartModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Add Part</h3>
                            <button onClick={() => setIsPartModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPart} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Select Part</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={partForm.inventoryItemId}
                                    onChange={e => setPartForm({ ...partForm, inventoryItemId: e.target.value })}
                                >
                                    <option value="">Select a part...</option>
                                    {inventory.map(item => (
                                        <option key={item.id} value={item.id} disabled={item.quantityOnHand <= 0}>
                                            {item.name} ({item.quantityOnHand} in stock) - ${item.price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={partForm.quantity}
                                    onChange={e => setPartForm({ ...partForm, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPartModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Add Part
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Labor Modal */}
            {isLaborModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Add Labor</h3>
                            <button onClick={() => setIsLaborModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddLabor} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Oil Change Labor"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={laborForm.description}
                                    onChange={e => setLaborForm({ ...laborForm, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Hours</label>
                                    <input
                                        type="number"
                                        required
                                        min="0.5"
                                        step="0.5"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={laborForm.hours}
                                        onChange={e => setLaborForm({ ...laborForm, hours: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Rate ($/hr)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={laborForm.rate}
                                        onChange={e => setLaborForm({ ...laborForm, rate: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsLaborModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Add Labor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialData={{
                    customerId: job.customer?.id,
                    vehicleId: job.vehicle?.id,
                    serviceJobId: job.id,
                    customerName: job.customer?.name,
                }}
            />
        </div>
    );
}
