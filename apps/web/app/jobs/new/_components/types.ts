export interface WizardState {
    customer: {
        id?: string;
        name: string;
        email: string;
        phone: string;
        address?: string;
    } | null;
    vehicle: {
        id?: string;
        vin: string;
        make: string;
        model: string;
        year: number;
    } | null;
    job: {
        description: string;
        estimatedCost?: number;
    };
}

export interface StepProps {
    state: WizardState;
    updateState: (updates: Partial<WizardState>) => void;
    onNext: () => void;
    onBack: () => void;
}
