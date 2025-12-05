'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { StepProps } from './types';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../../lib/api';

export default function ReviewStep({ state, onBack }: StepProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/service-jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: state.customer?.id,
                    vehicleId: state.vehicle?.id,
                    description: state.job.description,
                    appointmentId: state.appointmentId,
                }),
            });

            if (res.ok) {
                const job = await res.json();
                router.push(`/jobs/${job.id}`);
            } else {
                console.error('Failed to create job');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error creating job:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Review & Create</h2>
                <p className="text-gray-500">Double check the details before creating the job.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
                    <div className="font-semibold text-gray-900">{state.customer?.name}</div>
                    <div className="text-gray-600">{state.customer?.email}</div>
                    <div className="text-gray-600">{state.customer?.phone}</div>
                </div>

                <div className="h-px bg-gray-200" />

                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Vehicle</h3>
                    <div className="font-semibold text-gray-900">{state.vehicle?.year} {state.vehicle?.make} {state.vehicle?.model}</div>
                    <div className="text-gray-600 font-mono text-sm">VIN: {state.vehicle?.vin}</div>
                </div>

                <div className="h-px bg-gray-200" />

                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Job Details</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{state.job.description}</p>
                    {state.job.estimatedCost && (
                        <div className="mt-2 text-sm text-gray-600">
                            Estimated Cost: <span className="font-medium text-gray-900">${state.job.estimatedCost.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Create Job
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
