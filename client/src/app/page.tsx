'use client';

import { useState } from 'react';
import { ResumeForm } from '@/components/ResumeForm';
import { ResumePreview } from '@/components/ResumePreview';
import { ResumeData } from '@/types/resume';

export default function Home() {
  const [data, setData] = useState<Partial<ResumeData>>({
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [] }
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const id = (window as any).__RESUME_ID__;
    if (!id) return alert('Please generate a resume first');

    window.open(`http://localhost:5000/api/resumes/${id}/download`, '_blank');
  };

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Resume Master
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Create a humanized, ATS-friendly resume tailored to your dream job in minutes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <section className="space-y-8">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6">Tell us about yourself</h2>
            <ResumeForm data={data} setData={setData} setIsGenerating={setIsGenerating} />
          </div>
        </section>

        <section className="sticky top-12 space-y-8">
          <div className="glass-card p-1 aspect-[1/1.414] overflow-hidden flex flex-col group">
            <div className="bg-white/10 backdrop-blur-sm p-4 border-b border-white/5 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">Live Preview</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors border border-white/5"
                >
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
    </main>
  );
}
