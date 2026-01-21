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
        <div className="bg-white text-[#1a1a1a] p-12 min-h-full font-sans shadow-2xl origin-top transition-all duration-500 scale-[0.95] hover:scale-100">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">{data.fullName || 'Your Name'}</h1>
                <div className="text-sm flex flex-wrap justify-center gap-x-3 text-gray-500 font-medium">
                    <span>{data.location}</span>
                    {data.location && data.phone && <span className="text-gray-300">|</span>}
                    <span>{data.phone}</span>
                    {data.phone && data.email && <span className="text-gray-300">|</span>}
                    <span>{data.email}</span>
                </div>
            </header>

            {/* Summary */}
            {data.summary && (
                <section className="mb-8">
                    <p className="text-[15px] leading-relaxed text-gray-700 text-justify">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-semibold border-b-[1.5px] border-gray-900 uppercase tracking-[2px] mb-4 text-gray-900 pb-1">Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-6 last:mb-0">
                            <div className="flex justify-between font-bold text-gray-900 text-[15px]">
                                <span>{exp.role}</span>
                                <span className="text-sm font-medium text-gray-500">{exp.duration}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600 text-sm font-medium mb-2">
                                <span className="italic">{exp.company}</span>
                                <span>{exp.location}</span>
                            </div>
                            <ul className="list-disc ml-5 text-[14px] space-y-1.5 text-gray-700">
                                {exp.bullets.map((bullet, j) => (
                                    <li key={j} className="pl-1">{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {data.skills && (
                <section className="mb-8">
                    <h2 className="text-sm font-semibold border-b-[1.5px] border-gray-900 uppercase tracking-[2px] mb-4 text-gray-900 pb-1">Skills</h2>
                    <div className="text-[14px] space-y-2">
                        {data.skills.technical && (
                            typeof data.skills.technical === 'object' && !Array.isArray(data.skills.technical) ? (
                                Object.entries(data.skills.technical).map(([category, skills], i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="font-bold min-w-[120px] text-gray-900">{category}:</span>
                                        <span className="text-gray-700">{(skills as string[]).join(', ')}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex gap-2">
                                    <span className="font-bold min-w-[120px] text-gray-900">Technical:</span>
                                    <span className="text-gray-700">{(data.skills.technical as string[]).join(', ')}</span>
                                </div>
                            )
                        )}
                        {data.skills.soft && data.skills.soft.length > 0 && (
                            <div className="flex gap-2">
                                <span className="font-bold min-w-[120px] text-gray-900">Soft Skills:</span>
                                <span className="text-gray-700">{data.skills.soft.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-semibold border-b-[1.5px] border-gray-900 uppercase tracking-[2px] mb-4 text-gray-900 pb-1">Projects</h2>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-6 last:mb-0">
                            <div className="font-bold text-gray-900 text-[15px] mb-1">{proj.title}</div>
                            <div className="text-[13px] text-gray-500 font-semibold mb-2">{proj.technologies.join(' • ')}</div>
                            <ul className="list-disc ml-5 text-[14px] space-y-1.5 text-gray-700">
                                {proj.bullets.map((bullet, j) => (
                                    <li key={j} className="pl-1">{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-0">
                    <h2 className="text-sm font-semibold border-b-[1.5px] border-gray-900 uppercase tracking-[2px] mb-4 text-gray-900 pb-1">Education</h2>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-4 last:mb-0">
                            <div className="flex justify-between font-bold text-gray-900 text-[15px]">
                                <span>{edu.institution}</span>
                                <span className="text-sm font-medium text-gray-500">{edu.graduationDate}</span>
                            </div>
                            <div className="text-[14px] text-gray-700 font-medium">{edu.degree} {edu.location ? `| ${edu.location}` : ''}</div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
