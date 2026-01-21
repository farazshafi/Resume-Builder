'use client';

interface ResumeCardProps {
    resume: {
        id: string;
        fullName: string;
        email: string;
        updatedAt: string;
    };
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

export function ResumeCard({ resume, onDelete, onView }: ResumeCardProps) {
    return (
        <div className="glass-card p-6 flex flex-col gap-4 group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {resume.fullName}
                    </h3>
                    <p className="text-gray-400 text-sm">{resume.email}</p>
                </div>
                <button
                    onClick={() => onDelete(resume.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-white/5 rounded-full"
                    title="Delete Resume"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500">
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
                <button
                    onClick={() => onView(resume.id)}
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                    View & Edit
                </button>
            </div>
        </div>
    );
}
