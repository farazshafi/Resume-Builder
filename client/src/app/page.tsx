'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { ResumeGenerator } from '@/components/ResumeGenerator';
import { ResumeUploadGenerator } from '@/components/ResumeUploadGenerator';
import { CreateResumeOptions } from '@/components/CreateResumeOptions';

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'manual' | 'upload'>('dashboard');
  const [showOptions, setShowOptions] = useState(false);
  const [tailoredData, setTailoredData] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Resume Master
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Create humanized, ATS-friendly resumes tailored to your dream job.
        </p>
      </header>

      {view === 'dashboard' ? (
        <Dashboard
          onCreateNew={() => setShowOptions(true)}
          onSelect={(resume) => {
            setTailoredData(resume);
            setIsPreviewMode(false);
            setView('manual');
          }}
        />
      ) : view === 'manual' ? (
        <ResumeGenerator
          onBack={() => {
            setView('dashboard');
            setTailoredData(null);
            setIsPreviewMode(false);
          }}
          initialData={tailoredData}
          previewOnly={isPreviewMode}
        />
      ) : (
        <ResumeUploadGenerator
          onBack={() => setView('dashboard')}
          onSuccess={(resume) => {
            console.log('Resume created:', resume);
            setTailoredData(resume);
            setIsPreviewMode(true);
            setView('manual');
          }}
        />
      )}

      {showOptions && (
        <CreateResumeOptions
          onSelectManual={() => {
            setShowOptions(false);
            setIsPreviewMode(false);
            setView('manual');
          }}
          onSelectUpload={() => {
            setShowOptions(false);
            setView('upload');
          }}
          onCancel={() => setShowOptions(false)}
        />
      )}
    </main>
  );
}
