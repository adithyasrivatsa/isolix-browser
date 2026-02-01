import React, { useState } from 'react';
import { X, ArrowDown, ArrowLeft, MousePointerClick } from 'lucide-react';

interface OnboardingTutorialProps {
    onComplete: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else onComplete();
    };

    return (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
            <div className="absolute inset-0" onClick={nextStep} /> {/* Click outside to advance */}

            {/* Step 1: Welcome */}
            {step === 1 && (
                <div className="relative z-10 max-w-md bg-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-2xl text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-white font-bold text-xl">I</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Isolix</h2>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        Your new distraction-free, isolated workspace. <br />
                        Let's get you familiar with the layout.
                    </p>
                    <button
                        onClick={nextStep}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25"
                    >
                        Start Tour
                    </button>
                </div>
            )}

            {/* Step 2: Sidebar (Positioned near left) */}
            {step === 2 && (
                <div className="absolute top-20 left-20 z-10 flex gap-4 items-center animate-slideInLeft">
                    <ArrowLeft className="text-cyan-400 animate-bounce-horizontal" size={32} />
                    <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-xl shadow-xl max-w-xs">
                        <h3 className="text-white font-semibold mb-1">Workspaces</h3>
                        <p className="text-sm text-slate-400">
                            Hover near the left edge to manage your workspaces.
                            Isolate your tasks, accounts, and contexts here.
                        </p>
                        <button onClick={nextStep} className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium uppercase tracking-wide">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Dock (Positioned near bottom) */}
            {step === 3 && (
                <div className="absolute bottom-24 z-10 flex flex-col items-center gap-4 animate-slideInUp">
                    <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-xl shadow-xl max-w-sm text-center">
                        <h3 className="text-white font-semibold mb-1">Quick Dock & Broadcast</h3>
                        <p className="text-sm text-slate-400 mb-2">
                            Launch apps instantly from the dock.
                            Type to broadcast messages to all panels, or use <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">@name</code> to speak to one.
                        </p>
                        <button
                            onClick={onComplete}
                            className="mt-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 font-bold py-1.5 px-4 rounded-lg transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                    <ArrowDown className="text-cyan-400 animate-bounce" size={32} />
                </div>
            )}
        </div>
    );
};

export default OnboardingTutorial;
