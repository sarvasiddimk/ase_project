'use client';

import { useState } from 'react';
import { WizardState } from './_components/types';
import WizardStepper from './_components/WizardStepper';
import CustomerStep from './_components/CustomerStep';
import VehicleStep from './_components/VehicleStep';
import JobDetailsStep from './_components/JobDetailsStep';
import ReviewStep from './_components/ReviewStep';

const STEPS = ['Customer', 'Vehicle', 'Details', 'Review'];

export default function NewJobPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [state, setState] = useState<WizardState>({
        customer: null,
        vehicle: null,
        job: {
            description: '',
        },
    });

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
