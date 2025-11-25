'use client';

import { StepProps } from './types';

export default function JobDetailsStep({ state, updateState, onNext, onBack }: StepProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                <p className="text-gray-500">Describe the work needed.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description of Issue / Service</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="e.g. Customer states brakes are squeaking..."
                        value={state.job.description}
                        onChange={e => updateState({ job: { ...state.job, description: e.target.value } })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (Optional)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={state.job.estimatedCost || ''}
                            onChange={e => updateState({ job: { ...state.job, estimatedCost: parseFloat(e.target.value) } })}
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Review Job
                    </button>
                </div>
            </form>
        </div>
    );
}
