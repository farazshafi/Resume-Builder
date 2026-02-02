'use client';

interface CreateResumeOptionsProps {
    onSelectManual: () => void;
    onSelectUpload: () => void;
    onCancel: () => void;
}

export function CreateResumeOptions({ onSelectManual, onSelectUpload, onCancel }: CreateResumeOptionsProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onCancel}
            />

            <div className="relative glass-card w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-white">Choose an option</h2>
                        <p className="text-gray-400">Select how you want to start building your professional resume.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Manual Option */}
                        <button
                            onClick={onSelectManual}
                            className="group glass-card p-8 text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-white space-y-4 ring-1 ring-white/5"
                        >
                            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Manual Entry</h3>
                                <p className="text-gray-400 text-sm">Fill in your details manually using our interactive form.</p>
                            </div>
                        </button>

                        {/* Import Option */}
                        <button
                            onClick={onSelectUpload}
                            className="group glass-card p-8 text-left hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-white space-y-4 ring-1 ring-white/5"
                        >
                            <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Import Resume</h3>
                                <p className="text-gray-400 text-sm">Upload an existing resume and we'll parse the details for you.</p>
                            </div>
                        </button>
                    </div>

                    <div className="pt-4 flex justify-center">
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                        >
                            I'll do it later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
