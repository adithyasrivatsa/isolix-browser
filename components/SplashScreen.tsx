import React, { useEffect, useState } from 'react';
import { Hexagon } from 'lucide-react';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start exit animation after 2.5s
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 2500);

        // Complete after animation finishes (total 3s)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`
      fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]
      transition-opacity duration-700 ease-in-out
      ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}
    `}>
            <div className="relative flex flex-col items-center">
                {/* Glowing Background Effect */}
                <div className="absolute -inset-10 bg-cyan-500/20 blur-[100px] rounded-full opacity-50 animate-pulse" />

                {/* Logo Icon */}
                <div className={`
          relative z-10 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl
          flex items-center justify-center
          animate-[bounce_3s_infinite]
        `}>
                    <Hexagon size={64} className="text-cyan-400 animate-[spin_10s_linear_infinite]" strokeWidth={1.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-cyan-200 font-bold text-2xl animate-pulse">I</div>
                    </div>
                </div>

                {/* Text */}
                <h1 className="mt-8 text-4xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-400 to-indigo-500 animate-[pulse_3s_ease-in-out_infinite]">
                    ISOLIX
                </h1>

                <p className="mt-2 text-slate-500 text-sm tracking-widest uppercase opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
                    Productivity Isolated
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
