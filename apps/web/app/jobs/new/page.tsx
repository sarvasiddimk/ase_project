'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WizardState } from './_components/types';
import WizardStepper from './_components/WizardStepper';
import CustomerStep from './_components/CustomerStep';
import VehicleStep from './_components/VehicleStep';
import JobDetailsStep from './_components/JobDetailsStep';
import ReviewStep from './_components/ReviewStep';
import { API_URL } from '../../../lib/api';

const STEPS = ['Customer', 'Vehicle', 'Details', 'Review'];

function NewJobForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const searchParams = useSearchParams();
    const [state, setState] = useState<WizardState>({
        customer: null,
        vehicle: null,
        job: {
            description: '',
        },
        appointmentId: searchParams.get('appointmentId') || undefined,
    });

    useEffect(() => {
        const customerId = searchParams.get('customerId');
        const vehicleId = searchParams.get('vehicleId');

        const fetchData = async () => {
            if (customerId) {
                try {
                    const res = await fetch(`${API_URL}/customers/${customerId}`);
                    if (res.ok) {
                        const customer = await res.json();
                        setState(prev => ({ ...prev, customer }));
                        if (!vehicleId) setCurrentStep(2); // Skip to Vehicle if only Customer
                    }
                } catch (e) { console.error(e); }
            }

            if (vehicleId) {
                try {
                    const res = await fetch(`${API_URL}/vehicles/${vehicleId}`);
                    if (res.ok) {
                        const vehicle = await res.json();
                        setState(prev => ({ ...prev, vehicle }));
                        if (customerId) setCurrentStep(3); // Skip to Details if both present
                    }
                } catch (e) { console.error(e); }
            }
        };

        fetchData();
    }, [searchParams]);

    const updateState = (updates: Partial<WizardState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <WizardStepper currentStep={currentStep} steps={STEPS} />

                    <div className="mt-8">
                        {currentStep === 1 && (
                            <CustomerStep
                                state={state}
                                updateState={updateState}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 2 && (
                            <VehicleStep
                                state={state}
                                updateState={updateState}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 3 && (
                            <JobDetailsStep
                                state={state}
                                updateState={updateState}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {currentStep === 4 && (
                            <ReviewStep
                                state={state}
                                updateState={updateState}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewJobPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <NewJobForm />
        </Suspense>
    );
}
