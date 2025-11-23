import Link from 'next/link';
import { ArrowLeft, Calendar, User, Car, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function JobDetail({ params }: { params: { id: string } }) {
    // Mock data - in real app, fetch from API based on params.id
    const job = {
        id: params.id,
        customer: 'Alice Smith',
        vehicle: '2018 Toyota Camry',
        vin: 'JT123456789',
        status: 'IN_PROGRESS',
        description: 'Oil Change & Brake Inspection',
        items: [
            { id: 1, type: 'LABOR', description: 'Oil Change Service', quantity: 1, price: 45.00 },
            { id: 2, type: 'PART', description: 'Synthetic Oil (5W-30)', quantity: 5, price: 8.50 },
            { id: 3, type: 'PART', description: 'Oil Filter', quantity: 1, price: 12.00 },
        ]
    };

    const total = job.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Job #{job.id}</h1>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                In Progress
                            </span>
                        </div>
                        <p className="text-gray-500">{job.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                            Add Note
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">
                            Complete Job
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50">
                    <div className="p-4 flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
                            <p className="font-medium text-gray-900">{job.customer}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <Car className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Vehicle</p>
                            <p className="font-medium text-gray-900">{job.vehicle}</p>
                            <p className="text-xs text-gray-500">VIN: {job.vin}</p>
                        </div>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Scheduled</p>
                            <p className="font-medium text-gray-900">Today, 10:00 AM</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Job Items</h3>
                    <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3 w-24 text-center">Type</th>
                                    <th className="px-4 py-3 w-24 text-center">Qty</th>
                                    <th className="px-4 py-3 w-32 text-right">Price</th>
                                    <th className="px-4 py-3 w-32 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {job.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                                        <td className="px-4 py-3 text-center text-xs text-gray-500">{item.type}</td>
                                        <td className="px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-gray-500">${item.price.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan={4} className="px-4 py-3 text-right text-gray-900">Total</td>
                                    <td className="px-4 py-3 text-right text-red-600">${total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
