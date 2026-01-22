'use client';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDanger?: boolean;
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    isDanger = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative glass-card max-w-md w-full p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <p className="text-gray-400">{message}</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white font-medium"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${isDanger
                            ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-900/20'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
