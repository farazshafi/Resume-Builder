'use client';

import { useState } from 'react';
import { ProcessingModal } from './ProcessingModal';
import api from '@/lib/api';

interface ResumeUploadGeneratorProps {
    onBack: () => void;
    onSuccess: (resume: any) => void;
}

export function ResumeUploadGenerator({ onBack, onSuccess }: ResumeUploadGeneratorProps) {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStep(2);
        }
    };

    const handleGenerate = async () => {
        if (!file || !jobDescription) return;

        setIsProcessing(true);
        setError(null);
        delete (window as any).__ANIMATION_DONE__;

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            console.log('Sending upload request to backend...');
            const response = await api.post('/resumes/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const resume = response.data;
            // Store the resume in state
            (window as any).__PENDING_RESUME__ = resume;

            // If animation already finished, complete now
            if ((window as any).__ANIMATION_DONE__) {
                setIsProcessing(false);
                onSuccess(resume);
                delete (window as any).__PENDING_RESUME__;
                delete (window as any).__ANIMATION_DONE__;
            }
        } catch (err: any) {
            setIsProcessing(false);
            setError(err.response?.data?.error || err.message || 'Failed to process resume');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h2 className="text-3xl font-bold text-white">Upload & Optimize</h2>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step 1: Upload */}
                <div className={`glass-card p-8 space-y-6 transition-all duration-300 ${step === 1 ? 'ring-2 ring-blue-500/50' : 'opacity-60'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>1</div>
                        <h3 className="text-xl font-bold text-white">Upload Resume</h3>
                    </div>

                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/5'}`}>
                            <div className="mb-4 flex justify-center">
                                {file ? (
                                    <div className="bg-green-500/20 p-4 rounded-2xl">
                                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="bg-blue-500/20 p-4 rounded-2xl">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="text-white font-medium">{file ? file.name : 'Select PDF Resume'}</p>
                            <p className="text-gray-400 text-sm mt-1">Drag and drop or click to browse</p>
                        </div>
                    </div>
                </div>

                {/* Step 2: Job Description */}
                <div className={`glass-card p-8 space-y-6 transition-all duration-300 ${step === 2 ? 'ring-2 ring-blue-500/50' : 'opacity-60'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>2</div>
                        <h3 className="text-xl font-bold text-white">Job Description</h3>
                    </div>

                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={8}
                        disabled={step < 2}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={!file || !jobDescription || isProcessing}
                        className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                        Generate Optimized Resume
                    </button>
                </div>
            </div>

            <ProcessingModal
                isOpen={isProcessing}
                steps={[
                    "Extracting content from PDF...",
                    "Structuring resume data...",
                    "Removing unrelated skills & projects...",
                    "Optimizing summary and experience...",
                    "Categorizing technical skills...",
                    "Finalizing tailored resume..."
                ]}
                onComplete={() => {
                    (window as any).__ANIMATION_DONE__ = true;
                    const resume = (window as any).__PENDING_RESUME__;
                    if (resume) {
                        setIsProcessing(false);
                        onSuccess(resume);
                        delete (window as any).__PENDING_RESUME__;
                        delete (window as any).__ANIMATION_DONE__;
                    }
                }}
            />
        </div>
    );
}
