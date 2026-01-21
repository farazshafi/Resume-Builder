'use client';

import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
    data: Partial<ResumeData>;
    isGenerating?: boolean;
}

export function ResumePreview({ data, isGenerating }: ResumePreviewProps) {
    if (isGenerating) {
        return (
            <div className="animate-pulse space-y-4 p-8">
                <div className="h-8 bg-white/5 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
                <div className="space-y-4 pt-8">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                </div>
                <div className="space-y-4 pt-8">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-[#333] p-12 min-h-full font-serif shadow-2xl origin-top transition-all duration-500 scale-[0.95] hover:scale-100">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.fullName || 'Your Name'}</h1>
                <div className="text-sm flex flex-wrap justify-center gap-x-2 text-gray-600">
                    <span>{data.location}</span>
                    {data.location && data.phone && <span>|</span>}
                    <span>{data.phone}</span>
                    {data.phone && data.email && <span>|</span>}
                    <span>{data.email}</span>
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-6">
                    <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b-2 border-gray-800 uppercase mb-3">Professional Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between font-bold">
                                <span>{exp.role}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <div className="italic text-gray-700">{exp.company}</div>
                            <ul className="list-disc ml-5 mt-1 text-sm space-y-1">
                                {exp.bullets.map((bullet, j) => (
                                    <li key={j}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold border-b-2 border-gray-800 uppercase mb-3">Education</h2>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between font-bold">
                                <span>{edu.institution}</span>
                                <span>{edu.graduationDate}</span>
                            </div>
                            <div className="text-sm">{edu.degree}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section>
                    <h2 className="text-lg font-bold border-b-2 border-gray-800 uppercase mb-3">Skills</h2>
                    <div className="text-sm">
                        <p><strong>Technical:</strong> {data.skills.technical.join(', ')}</p>
                        <p className="mt-1"><strong>Soft Skills:</strong> {data.skills.soft.join(', ')}</p>
                    </div>
                </section>
            )}
        </div>
    );
}
