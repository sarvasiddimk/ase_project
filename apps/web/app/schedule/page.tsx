'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CalendarView from './_components/CalendarView';
import BookingModal from './_components/BookingModal';

export default function SchedulePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage appointments and technician availability.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Appointment
                    </button>
                </div>

                <CalendarView />

                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    );
}
