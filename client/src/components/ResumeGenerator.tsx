'use client';

import { useState, useEffect } from 'react';
import { ResumeForm } from './ResumeForm';
import { ResumePreview } from './ResumePreview';
import { ResumeData } from '@/types/resume';

interface ResumeGeneratorProps {
    onBack: () => void;
}

export function ResumeGenerator({ onBack }: ResumeGeneratorProps) {
    const [data, setData] = useState<Partial<ResumeData>>({
        education: [],
        experience: [],
        projects: [],
        skills: { technical: [], soft: [] }
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);
    const [initialStep, setInitialStep] = useState(1);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('resume_builder_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(prev => ({ ...prev, ...parsed }));

                // Determine start step logic
                // If we have basic info and at least one experience or education, assume we can skip to the end
                // Or easier: if we have a name and email, defaulting to the last step is usually safe as the user can go back
                if (parsed.fullName && parsed.email) {
                    setInitialStep(5);
                }
            } catch (e) {
                console.error('Failed to parse saved resume data', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('resume_builder_data', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const handleDownload = async () => {
        const id = (window as any).__RESUME_ID__;
        if (!id) return alert('Please generate a resume first');

        window.open(`http://localhost:5000/api/resumes/${id}/download`, '_blank');
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-2xl font-bold">Manual Resume Entry</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <section className="space-y-8">
                    <div className="glass-card p-8">
                        <h3 className="text-2xl font-semibold mb-6">Tell us about yourself</h3>
                        <ResumeForm
                            data={data}
                            setData={setData}
                            setIsGenerating={setIsGenerating}
                            initialStep={initialStep}
                        />
                    </div>
                </section>

                <section className="sticky top-12 space-y-8">
                    <div className="glass-card p-1 aspect-[1/1.414] overflow-hidden flex flex-col group">
                        <div className="bg-white/10 backdrop-blur-sm p-4 border-b border-white/5 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">Live Preview</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors border border-white/5"
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-white/5 overflow-y-auto">
                            <ResumePreview data={data} isGenerating={isGenerating} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
