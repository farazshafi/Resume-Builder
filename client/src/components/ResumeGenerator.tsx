'use client';

import { useState, useEffect } from 'react';
import { ResumeForm } from './ResumeForm';
import { ResumePreview } from './ResumePreview';
import { ResumeData } from '@/types/resume';

interface ResumeGeneratorProps {
    onBack: () => void;
    initialData?: any;
    previewOnly?: boolean;
}

export function ResumeGenerator({ onBack, initialData, previewOnly = false }: ResumeGeneratorProps) {
    const [data, setData] = useState<Partial<ResumeData>>({
        education: [],
        experience: [],
        projects: [],
        skills: { technical: {}, soft: [] }
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);
    const [initialStep, setInitialStep] = useState(1);

    // Load from local storage or initialData on mount
    useEffect(() => {
        if (initialData) {
            const content = initialData.generatedContent || initialData;
            setData(content);
            (window as any).__RESUME_ID__ = initialData.id;
            setIsLoaded(true);
            return;
        }

        const saved = localStorage.getItem('resumeData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Failed to parse saved resume data', e);
            }
        }
        setIsLoaded(true);
    }, [initialData]);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('resumeData', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const handleDownload = async () => {
        const id = (window as any).__RESUME_ID__;
        if (!id) return alert('Please generate a resume first');

        const url = `${process.env.NEXT_PUBLIC_API_URL}/resumes/${id}/download`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${id}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                <h2 className="text-2xl font-bold">{previewOnly ? 'Generated Resume Preview' : 'Manual Resume Entry'}</h2>
            </div>

            <div className={`grid grid-cols-1 ${previewOnly ? 'max-w-4xl mx-auto' : 'lg:grid-cols-2'} gap-12 items-start`}>
                {!previewOnly && (
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
                )}

                <section className={`${!previewOnly ? 'sticky top-12' : ''} space-y-8 transition-all duration-500`}>
                    <div className="glass-card p-1 aspect-[1/1.414] overflow-hidden flex flex-col group shadow-2xl">
                        <div className="bg-white/10 backdrop-blur-sm p-4 border-b border-white/5 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">Live Preview</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-4 py-2 rounded-lg transition-colors border border-blue-500/30 font-medium flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
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
