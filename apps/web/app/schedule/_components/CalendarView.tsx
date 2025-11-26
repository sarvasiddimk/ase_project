'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Car } from 'lucide-react';

interface Appointment {
    id: string;
    customerName: string;
    vehicleInfo: string;
    startTime: Date;
    endTime: Date;
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    type: string;
}

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/scheduling')
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((apt: any) => ({
                    id: apt.id,
                    customerName: apt.customer?.name || 'Unknown',
                    vehicleInfo: apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : 'Unknown',
                    startTime: new Date(apt.startTime),
                    endTime: new Date(apt.endTime),
                    status: apt.status,
                    type: apt.notes || 'Service',
                }));
                setAppointments(mapped);
            })
            .catch(err => console.error('Failed to fetch appointments', err));
    }, []);

    const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8); // 8 AM to 4 PM

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                        {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg transition-colors">Day</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg transition-colors">Week</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg transition-colors">Month</button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="divide-y divide-gray-100">
                {timeSlots.map((hour) => {
                    const timeString = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                    const slotAppointments = appointments.filter(apt => apt.startTime.getHours() === hour);

                    return (
                        <div key={hour} className="flex min-h-[100px] group hover:bg-gray-50 transition-colors">
                            {/* Time Column */}
                            <div className="w-24 py-4 px-4 border-r border-gray-100 text-right">
                                <span className="text-sm font-medium text-gray-500">{timeString}</span>
                            </div>

                            {/* Appointments Column */}
                            <div className="flex-1 p-2 relative">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 border-b border-gray-50 pointer-events-none" style={{ top: '50%' }}></div>

                                {slotAppointments.map(apt => (
                                    <div
                                        key={apt.id}
                                        className={`
                                            mb-2 p-3 rounded-lg border border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all
                                            ${getStatusColor(apt.status)}
                                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-semibold text-sm">{apt.type}</div>
                                                <div className="flex items-center gap-3 mt-1 text-xs opacity-90">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {apt.customerName}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Car className="w-3 h-3" />
                                                        {apt.vehicleInfo}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium bg-white/50 px-2 py-1 rounded">
                                                <Clock className="w-3 h-3" />
                                                {apt.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {apt.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
