'use client';

import { useState } from 'react';
import { ResumeData, Experience, Education } from '@/types/resume';

interface ResumeFormProps {
    data: Partial<ResumeData>;
    setData: (data: Partial<ResumeData>) => void;
    setIsGenerating: (is: boolean) => void;
}

export function ResumeForm({ data, setData, setIsGenerating }: ResumeFormProps) {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const updateData = (newData: Partial<ResumeData>) => setData({ ...data, ...newData });

    const addExperience = () => {
        const newExp: Experience = { company: '', role: '', duration: '', bullets: [''] };
        updateData({ experience: [...(data.experience || []), newExp] });
    };

    const addEducation = () => {
        const newEdu: Education = { institution: '', degree: '', graduationDate: '' };
        updateData({ education: [...(data.education || []), newEdu] });
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // 1. Create/Update resume record
            const createRes = await fetch('http://localhost:5000/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const resume = await createRes.json();

            // 2. Generate tailored content
            const generateRes = await fetch(`http://localhost:5000/api/resumes/${resume.id}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription: data.targetJobDescription })
            });
            const tailored = await generateRes.json();

            // 3. Update preview with tailored content
            setData(tailored.generatedContent);
            // Store ID for download
            (window as any).__RESUME_ID__ = resume.id;
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-blue-500' : 'bg-white/10'
                            }`}
                    />
                ))}
            </div>

            <div className="min-h-[500px]">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="input-field col-span-2"
                                placeholder="Full Name"
                                value={data.fullName || ''}
                                onChange={e => updateData({ fullName: e.target.value })}
                            />
                            <input
                                className="input-field"
                                placeholder="Email Address"
                                value={data.email || ''}
                                onChange={e => updateData({ email: e.target.value })}
                            />
                            <input
                                className="input-field"
                                placeholder="Phone Number"
                                value={data.phone || ''}
                                onChange={e => updateData({ phone: e.target.value })}
                            />
                            <input
                                className="input-field col-span-2"
                                placeholder="Location (e.g. New York, NY)"
                                value={data.location || ''}
                                onChange={e => updateData({ location: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Experience & Education</h3>

                        <div className="space-y-4">
                            {data.experience?.map((exp, i) => (
                                <div key={i} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5 relative group">
                                    <input
                                        className="input-field w-full bg-transparent border-none p-0 focus:ring-0 text-white font-medium text-lg"
                                        placeholder="Company Name"
                                        value={exp.company}
                                        onChange={e => {
                                            const newExp = [...(data.experience || [])];
                                            newExp[i].company = e.target.value;
                                            updateData({ experience: newExp });
                                        }}
                                    />
                                    <input
                                        className="input-field w-full text-sm opacity-70"
                                        placeholder="Role (e.g. Software Engineer)"
                                        value={exp.role}
                                        onChange={e => {
                                            const newExp = [...(data.experience || [])];
                                            newExp[i].role = e.target.value;
                                            updateData({ experience: newExp });
                                        }}
                                    />
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Bullets</p>
                                        {exp.bullets.map((bullet, bi) => (
                                            <input
                                                key={bi}
                                                className="input-field w-full text-sm"
                                                placeholder="Achieved X by doing Y resulting in Z"
                                                value={bullet}
                                                onChange={e => {
                                                    const newExp = [...(data.experience || [])];
                                                    newExp[i].bullets[bi] = e.target.value;
                                                    updateData({ experience: newExp });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addExperience} className="btn-secondary w-full py-4 border-dashed border-2 hover:border-blue-500/50">
                                + Add Experience
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.education?.map((edu, i) => (
                                <div key={i} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5">
                                    <input
                                        className="input-field w-full bg-transparent border-none p-0 focus:ring-0 text-white font-medium"
                                        placeholder="Institution"
                                        value={edu.institution}
                                        onChange={e => {
                                            const newEdu = [...(data.education || [])];
                                            newEdu[i].institution = e.target.value;
                                            updateData({ education: newEdu });
                                        }}
                                    />
                                </div>
                            ))}
                            <button onClick={addEducation} className="btn-secondary w-full py-4 border-dashed border-2 hover:border-blue-500/50">
                                + Add Education
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Skills & Projects</h3>
                        <textarea
                            className="input-field w-full h-32"
                            placeholder="Technical Skills (comma separated)"
                            value={data.skills?.technical.join(', ')}
                            onChange={e => updateData({ skills: { ...data.skills!, technical: e.target.value.split(',').map(s => s.trim()) } })}
                        />
                        <textarea
                            className="input-field w-full h-32"
                            placeholder="Soft Skills (comma separated)"
                            value={data.skills?.soft.join(', ')}
                            onChange={e => updateData({ skills: { ...data.skills!, soft: e.target.value.split(',').map(s => s.trim()) } })}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Target Job</h3>
                        <textarea
                            className="input-field w-full h-64"
                            placeholder="Paste job description here..."
                            value={data.targetJobDescription || ''}
                            onChange={e => updateData({ targetJobDescription: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-8">
                <button
                    onClick={() => setStep(s => Math.max(s - 1, 1))}
                    disabled={step === 1}
                    className="btn-secondary disabled:opacity-50"
                >
                    Previous
                </button>
                {step < totalSteps ? (
                    <button onClick={() => setStep(s => s + 1)} className="btn-primary">
                        Next Step
                    </button>
                ) : (
                    <button onClick={handleGenerate} className="btn-primary bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-blue-600/20">
                        Generate Resume
                    </button>
                )}
            </div>
        </div>
    );
}
