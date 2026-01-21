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
    const totalSteps = 5;

    const updateData = (newData: Partial<ResumeData>) => setData({ ...data, ...newData });

    const addExperience = () => {
        const newExp: Experience = { company: '', role: '', duration: '', bullets: [''] };
        updateData({ experience: [...(data.experience || []), newExp] });
    };

    const addEducation = () => {
        const newEdu: Education = { institution: '', degree: '', graduationDate: '' };
        updateData({ education: [...(data.education || []), newEdu] });
    };

    const addProject = () => {
        if ((data.projects?.length || 0) >= 5) return alert('Maximum 5 projects allowed');
        const newProj: any = { title: '', description: '', bullets: [''], technologies: [] };
        updateData({ projects: [...(data.projects || []), newProj] });
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

            if (!createRes.ok) {
                const errorData = await createRes.json();
                throw new Error(errorData.error || 'Failed to create resume');
            }
            const resume = await createRes.json();

            // 2. Generate tailored content
            const generateRes = await fetch(`http://localhost:5000/api/resumes/${resume.id}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription: data.targetJobDescription })
            });

            if (!generateRes.ok) {
                const errorData = await generateRes.json();
                throw new Error(errorData.error || 'Failed to generate content');
            }
            const tailored = await generateRes.json();

            // 3. Update preview with tailored content
            setData(tailored.generatedContent);
            // Store ID for download
            (window as any).__RESUME_ID__ = resume.id;
        } catch (error: any) {
            console.error('Generation failed:', error);
            alert(error.message || 'Generation failed. Please check your connection and try again.');
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
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-400">Professional Summary (Optional)</h4>
                            <textarea
                                className="input-field w-full h-24"
                                placeholder="Briefly describe your professional background..."
                                value={data.summary || ''}
                                onChange={e => updateData({ summary: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Experience (Optional)</h3>

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
                                    <input
                                        className="input-field w-full text-sm opacity-70"
                                        placeholder="Duration (e.g. Jan 2020 - Present)"
                                        value={exp.duration}
                                        onChange={e => {
                                            const newExp = [...(data.experience || [])];
                                            newExp[i].duration = e.target.value;
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
                                        <button
                                            onClick={() => {
                                                const newExp = [...(data.experience || [])];
                                                newExp[i].bullets.push('');
                                                updateData({ experience: newExp });
                                            }}
                                            className="text-xs text-blue-500 hover:text-blue-400"
                                        >
                                            + Add Bullet
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newExp = data.experience?.filter((_, index) => index !== i);
                                            updateData({ experience: newExp });
                                        }}
                                        className="absolute top-2 right-2 text-red-500/50 hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button onClick={addExperience} className="btn-secondary w-full py-4 border-dashed border-2 hover:border-blue-500/50">
                                + Add Experience
                            </button>
                        </div>

                        <h3 className="text-lg font-medium text-blue-400 mt-8">Education</h3>
                        <div className="space-y-4">
                            {data.education?.map((edu, i) => (
                                <div key={i} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5 relative">
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
                                    <input
                                        className="input-field w-full text-sm opacity-70"
                                        placeholder="Degree & Major"
                                        value={edu.degree}
                                        onChange={e => {
                                            const newEdu = [...(data.education || [])];
                                            newEdu[i].degree = e.target.value;
                                            updateData({ education: newEdu });
                                        }}
                                    />
                                    <input
                                        className="input-field w-full text-sm opacity-70"
                                        placeholder="Graduation Date"
                                        value={edu.graduationDate}
                                        onChange={e => {
                                            const newEdu = [...(data.education || [])];
                                            newEdu[i].graduationDate = e.target.value;
                                            updateData({ education: newEdu });
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newEdu = data.education?.filter((_, index) => index !== i);
                                            updateData({ education: newEdu });
                                        }}
                                        className="absolute top-2 right-2 text-red-500/50 hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button onClick={addEducation} className="btn-secondary w-full py-4 border-dashed border-2 hover:border-blue-500/50">
                                + Add Education
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-blue-400">Projects (Optional, up to 5)</h3>
                            <span className="text-xs text-gray-500">{data.projects?.length || 0} / 5</span>
                        </div>

                        <div className="space-y-4">
                            {data.projects?.map((proj, i) => (
                                <div key={i} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5 relative group">
                                    <input
                                        className="input-field w-full bg-transparent border-none p-0 focus:ring-0 text-white font-medium text-lg"
                                        placeholder="Project Title"
                                        value={proj.title}
                                        onChange={e => {
                                            const newProj = [...(data.projects || [])];
                                            newProj[i].title = e.target.value;
                                            updateData({ projects: newProj });
                                        }}
                                    />
                                    <textarea
                                        className="input-field w-full text-sm"
                                        placeholder="Project Brief Description"
                                        value={proj.description}
                                        onChange={e => {
                                            const newProj = [...(data.projects || [])];
                                            newProj[i].description = e.target.value;
                                            updateData({ projects: newProj });
                                        }}
                                    />
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Key Achievements (Bullets)</p>
                                        {proj.bullets.map((bullet: string, bi: number) => (
                                            <input
                                                key={bi}
                                                className="input-field w-full text-sm"
                                                placeholder="What did you build/achieve?"
                                                value={bullet}
                                                onChange={e => {
                                                    const newProj = [...(data.projects || [])];
                                                    newProj[i].bullets[bi] = e.target.value;
                                                    updateData({ projects: newProj });
                                                }}
                                            />
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newProj = [...(data.projects || [])];
                                                newProj[i].bullets.push('');
                                                updateData({ projects: newProj });
                                            }}
                                            className="text-xs text-blue-500 hover:text-blue-400"
                                        >
                                            + Add Bullet
                                        </button>
                                    </div>
                                    <input
                                        className="input-field w-full text-sm"
                                        placeholder="Tech Stack (comma separated)"
                                        value={proj.technologies.join(', ')}
                                        onChange={e => {
                                            const newProj = [...(data.projects || [])];
                                            newProj[i].technologies = e.target.value.split(',').map((s: string) => s.trim());
                                            updateData({ projects: newProj });
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newProj = data.projects?.filter((_, index) => index !== i);
                                            updateData({ projects: newProj });
                                        }}
                                        className="absolute top-2 right-2 text-red-500/50 hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {(data.projects?.length || 0) < 5 && (
                                <button onClick={addProject} className="btn-secondary w-full py-4 border-dashed border-2 hover:border-blue-500/50">
                                    + Add Project
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Skills</h3>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-400">Technical Skills</h4>
                            <textarea
                                className="input-field w-full h-32"
                                placeholder="E.g. React, Node.js, TypeScript, Docker, etc. (comma separated)"
                                value={data.skills?.technical.join(', ')}
                                onChange={e => updateData({ skills: { ...data.skills!, technical: e.target.value.split(',').map(s => s.trim()) } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-400">Soft Skills</h4>
                            <textarea
                                className="input-field w-full h-32"
                                placeholder="E.g. Leadership, Communication, Problem Solving, etc. (comma separated)"
                                value={data.skills?.soft.join(', ')}
                                onChange={e => updateData({ skills: { ...data.skills!, soft: e.target.value.split(',').map(s => s.trim()) } })}
                            />
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-lg font-medium text-blue-400">Target Job</h3>
                        <textarea
                            className="input-field w-full h-64"
                            placeholder="Paste the job description you are applying for..."
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
                    <button onClick={handleGenerate} className="btn-primary bg-linear-to-r from-blue-500 to-purple-600 border-none shadow-blue-600/20">
                        Generate Resume
                    </button>
                )}
            </div>
        </div>
    );
}
