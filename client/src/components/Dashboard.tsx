'use client';

import { useState, useEffect } from 'react';
import { ResumeCard } from './ResumeCard';
import { ConfirmationModal } from './ConfirmationModal';

interface DashboardProps {
    onCreateNew: () => void;
}

export function Dashboard({ onCreateNew }: DashboardProps) {
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/resumes');
            if (!response.ok) throw new Error('Failed to fetch resumes');
            const data = await response.ok ? await response.json() : [];
            setResumes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleDelete = (id: string) => {
        setResumeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!resumeToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/resumes/${resumeToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete resume');
            setResumes(resumes.filter(r => r.id !== resumeToDelete));
            setIsDeleteModalOpen(false);
            setResumeToDelete(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleView = (id: string) => {
        // For now, we'll just alert. In a real app, this would navigate to an edit page.
        // Or we could trigger the Manual mode with the resume data.
        alert('Viewing resume ' + id);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-white">Your Resumes</h2>
                    <p className="text-gray-400">Manage and optimize your professional documents.</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Resume
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400">
                    {error}
                </div>
            )}

            {resumes.length === 0 && !loading ? (
                <div className="glass-card p-20 text-center space-y-6">
                    <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-white">No resumes found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">Get started by creating your first resume using our AI-powered builder.</p>
                    </div>
                    <button
                        onClick={onCreateNew}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        Create your first resume &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resumes.map(resume => (
                        <ResumeCard
                            key={resume.id}
                            resume={resume}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Resume"
                message="Are you sure you want to delete this resume? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setResumeToDelete(null);
                }}
                isDanger={true}
            />
        </div>
    );
}
