import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function Careers() {
  useEffect(() => {
    // Immediate redirect
    const timer = setTimeout(() => {
      window.location.replace('https://localsm.tech');
    }, 1200); // Short delay for premium brand transition feel
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans flex flex-col justify-center items-center px-6 selection:bg-[#0055ff]/10 selection:text-black">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Premium Pulsing Brand Mark / Loader */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-black/5"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-[#0055ff] animate-spin"></div>
          <span className="text-xs font-mono font-bold tracking-tight text-black">
            L<span className="text-[#f4b000]">S</span>
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-light tracking-tight leading-tight">
            Redirecting to Careers
          </h1>
          <p className="text-sm text-black/60 font-light max-w-xs mx-auto leading-relaxed">
            Please wait while we connect you to our official talent portal at <span className="font-mono text-black font-semibold">localsm.tech</span>.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="https://localsm.tech"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0055ff] hover:underline hover:text-[#0055ff]/80 transition-colors"
          >
            Click here to open directly <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
