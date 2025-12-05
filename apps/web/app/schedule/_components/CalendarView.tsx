'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Car } from 'lucide-react';
import { API_URL } from '../../../lib/api';

interface Appointment {
    id: string;
    customerId?: string;
    vehicleId?: string;
    customerName: string;
    vehicleInfo: string;
    startTime: Date;
    endTime: Date;
    status: string;
    type: string;
    serviceJobId?: string;
}

interface ApiAppointment {
    id: string;
    customer?: { id: string; name: string };
    vehicle?: { id: string; make: string; model: string; year: number };
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
    serviceJobId?: string;
}

type ViewType = 'day' | 'week' | 'month';

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewType>('day');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchAppointments();
    }, [currentDate, view]);

    const fetchAppointments = () => {
        // In a real app, we'd filter by date range here
        fetch(`${API_URL}/scheduling`)
            .then(res => res.json())
            .then((data: ApiAppointment[]) => {
                const mapped = data.map((apt) => ({
                    id: apt.id,
                    customerId: apt.customer?.id,
                    vehicleId: apt.vehicle?.id,
                    customerName: apt.customer?.name || 'Unknown',
                    vehicleInfo: apt.vehicle ? `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}` : 'Unknown',
                    startTime: new Date(apt.startTime),
                    endTime: new Date(apt.endTime),
                    status: apt.status,
                    type: apt.notes || 'Service',
                    serviceJobId: apt.serviceJobId,
                }));
                setAppointments(mapped);
            })
            .catch(err => console.error('Failed to fetch appointments', err));
    };

    const navigate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (view === 'day') {
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (view === 'week') {
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700';
        }
    };

    const handleAppointmentClick = (apt: Appointment) => {
        if (apt.serviceJobId) {
            router.push(`/jobs/${apt.serviceJobId}`);
        } else {
            if (confirm('No job linked to this appointment. Create one?')) {
                // We need to pass the IDs. The mapped Appointment object needs to have them.
                // Let's update the mapping first.
                router.push(`/jobs/new?appointmentId=${apt.id}&customerId=${apt.customerId}&vehicleId=${apt.vehicleId}`);
            }
        }
    };

    const renderDayView = () => {
        const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8); // 8 AM to 4 PM
        return (
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {timeSlots.map((hour) => {
                    const timeString = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                    const slotAppointments = appointments.filter(apt =>
                        apt.startTime.getDate() === currentDate.getDate() &&
                        apt.startTime.getMonth() === currentDate.getMonth() &&
                        apt.startTime.getFullYear() === currentDate.getFullYear() &&
                        apt.startTime.getHours() === hour
                    );

                    return (
                        <div key={hour} className="flex min-h-[100px] group hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                            <div className="w-24 py-4 px-4 border-r border-gray-100 dark:border-slate-800 text-right">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{timeString}</span>
                            </div>
                            <div className="flex-1 p-2 relative">
                                <div className="absolute inset-0 border-b border-gray-50 dark:border-slate-800 pointer-events-none" style={{ top: '50%' }}></div>
                                {slotAppointments.map(apt => (
                                    <AppointmentCard
                                        key={apt.id}
                                        apt={apt}
                                        getStatusColor={getStatusColor}
                                        onClick={() => handleAppointmentClick(apt)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            return d;
        });
        const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8);

        return (
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 border-b border-gray-200 dark:border-slate-800">
                        <div className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-slate-800">Time</div>
                        {weekDays.map((day, i) => (
                            <div key={i} className={`p-4 text-center border-r border-gray-100 dark:border-slate-800 ${day.getDate() === new Date().getDate() ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                <div className={`text-lg font-bold ${day.getDate() === new Date().getDate() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                    {day.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>
                    {timeSlots.map((hour) => (
                        <div key={hour} className="grid grid-cols-8 border-b border-gray-100 dark:border-slate-800 min-h-[80px]">
                            <div className="p-2 text-right text-xs text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-slate-800">
                                {`${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                            </div>
                            {weekDays.map((day, i) => {
                                const slotAppointments = appointments.filter(apt =>
                                    apt.startTime.getDate() === day.getDate() &&
                                    apt.startTime.getMonth() === day.getMonth() &&
                                    apt.startTime.getFullYear() === day.getFullYear() &&
                                    apt.startTime.getHours() === hour
                                );
                                return (
                                    <div key={i} className="border-r border-gray-100 dark:border-slate-800 p-1 relative hover:bg-gray-50 dark:hover:bg-slate-900">
                                        {slotAppointments.map(apt => (
                                            <div
                                                key={apt.id}
                                                onClick={() => handleAppointmentClick(apt)}
                                                className={`text-[10px] p-1 rounded mb-1 truncate cursor-pointer hover:opacity-80 ${getStatusColor(apt.status)}`}
                                            >
                                                {apt.customerName}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday

        const days = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

        return (
            <div className="grid grid-cols-7 border-l border-t border-gray-200 dark:border-slate-800">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
                        {day}
                    </div>
                ))}
                {days.map((date, i) => (
                    <div key={i} className="min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                        {date && (
                            <>
                                <div className={`text-sm font-medium mb-1 ${date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 inline-block px-2 rounded-full' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {date.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {appointments
                                        .filter(apt =>
                                            apt.startTime.getDate() === date.getDate() &&
                                            apt.startTime.getMonth() === date.getMonth() &&
                                            apt.startTime.getFullYear() === date.getFullYear()
                                        )
                                        .map(apt => (
                                            <div
                                                key={apt.id}
                                                onClick={() => handleAppointmentClick(apt)}
                                                className={`text-[10px] px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${getStatusColor(apt.status)}`}
                                            >
                                                {apt.startTime.getHours() > 12 ? apt.startTime.getHours() - 12 : apt.startTime.getHours()}:{apt.startTime.getMinutes().toString().padStart(2, '0')} {apt.customerName}
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        {view === 'month'
                            ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                        }
                    </h2>
                    <div className="flex bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 p-1">
                        <button onClick={() => navigate('prev')} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button onClick={() => navigate('next')} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 bg-gray-200/50 dark:bg-slate-800 p-1 rounded-lg">
                    {(['day', 'week', 'month'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${view === v ? 'bg-white dark:bg-slate-950 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Grid */}
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
        </div>
    );
}

function AppointmentCard({ apt, getStatusColor, onClick }: { apt: Appointment; getStatusColor: (s: string) => string, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`mb-2 p-3 rounded-lg border border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${getStatusColor(apt.status)}`}
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
                <div className="flex items-center gap-1 text-xs font-medium bg-white/50 dark:bg-black/20 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {apt.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {apt.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
