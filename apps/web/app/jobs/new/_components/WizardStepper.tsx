'use client';

import { Check } from 'lucide-react';

interface WizardStepperProps {
    currentStep: number;
    steps: string[];
}

export default function WizardStepper({ currentStep, steps }: WizardStepperProps) {
    return (
        <div className="flex items-center justify-between relative mb-12">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                    <div key={step} className="flex flex-col items-center gap-2">
                        <div
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                                ${isCompleted ? 'bg-blue-600 text-white scale-110' :
                                    isCurrent ? 'bg-white border-2 border-blue-600 text-blue-600 scale-110 shadow-lg shadow-blue-600/20' :
                                        'bg-white border-2 border-gray-200 text-gray-400'}
                            `}
                        >
                            {isCompleted ? <Check className="w-6 h-6" /> : stepNum}
                        </div>
                        <span className={`
                            text-xs font-medium transition-colors duration-300 absolute -bottom-6 w-32 text-center
                            ${isCurrent ? 'text-blue-600' : 'text-gray-400'}
                        `}>
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
