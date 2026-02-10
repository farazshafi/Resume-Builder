'use client';

import { useState, useRef, useEffect } from 'react';

interface ResumeCardProps {
    resume: {
        id: string;
        title?: string;
        fullName: string;
        email: string;
        updatedAt: string;
    };
    onDelete: (id: string) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
}

export function ResumeCard({ resume, onDelete, onView, onEdit }: ResumeCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="glass-card p-6 flex flex-col gap-4 group hover:border-white/20 transition-all relative">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[200px]">
                        {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">{resume.fullName}</p>
                </div>

                <button
                    onClick={() => onView(resume.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-400/10 rounded-full flex items-center justify-center"
                    title="View PDF Preview"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                </span>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        title="Options"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-100">
                            <button
                                onClick={() => {
                                    onEdit(resume.id);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Resume
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(resume.id);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-white/5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Resume
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
