'use client';

import { useState, useEffect } from 'react';

interface ProcessingModalProps {
    isOpen: boolean;
    steps: string[];
    onComplete: () => void;
}

export function ProcessingModal({ isOpen, steps, onComplete }: ProcessingModalProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayedSteps, setDisplayedSteps] = useState<{ text: string, completed: boolean }[]>([]);

    const initialSteps = [
        "Analyzing Job Description...",
        "Identifying key requirements...",
        "Scanning resume for relevance..."
    ];

    useEffect(() => {
        if (isOpen) {
            setCurrentStepIndex(0);
            setDisplayedSteps([]);

            // Start with initial steps
            let index = 0;
            const interval = setInterval(() => {
                if (index < initialSteps.length) {
                    setDisplayedSteps(prev => [
                        ...prev.map(s => ({ ...s, completed: true })),
                        { text: initialSteps[index], completed: false }
                    ]);
                    index++;
                } else if (steps.length > 0) {
                    // Add actual steps from AI
                    const aiStepIndex = index - initialSteps.length;
                    if (aiStepIndex < steps.length) {
                        setDisplayedSteps(prev => [
                            ...prev.map(s => ({ ...s, completed: true })),
                            { text: steps[aiStepIndex], completed: false }
                        ]);
                        index++;
                    } else {
                        // All steps done
                        setDisplayedSteps(prev => prev.map(s => ({ ...s, completed: true })));
                        clearInterval(interval);
                        setTimeout(onComplete, 1000);
                    }
                }
            }, 1200);

            return () => clearInterval(interval);
        }
    }, [isOpen, steps]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="glass-card p-10 max-w-md w-full mx-4 space-y-8 relative overflow-hidden">
                {/* Background pulse */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 animate-shimmer" />

                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                        Tailoring Your Resume
                    </h3>
                    <p className="text-gray-400 text-sm">Our AI is optimizing every detail for the JD...</p>
                </div>

                <div className="space-y-4">
                    {displayedSteps.map((step, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-4 transition-all duration-500 animate-in slide-in-from-bottom-4 ${step.completed ? 'opacity-100' : 'opacity-100 scale-105'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${step.completed ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                                }`}>
                                {step.completed ? (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                            <span className={`text-[15px] ${step.completed ? 'text-gray-300' : 'text-white font-medium'}`}>
                                {step.text}
                            </span>
                        </div>
                    ))}

                    {/* Skeleton loader for next step */}
                    {steps.length === 0 && displayedSteps.length >= initialSteps.length && (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-6 h-6 rounded-full bg-white/10" />
                            <div className="h-4 bg-white/10 rounded w-2/3" />
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-center">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
