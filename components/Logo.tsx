import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Simulated Logo based on uploaded image description */}
      <div className="relative w-14 h-14 bg-brand-black border border-white/20 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full p-2 text-white fill-current">
          {/* Abstract geometric JS logo simulation */}
          <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M50 95 L50 50 L95 25" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M5 25 L50 50" fill="none" stroke="currentColor" strokeWidth="4" />
          <text x="50" y="75" textAnchor="middle" fontSize="35" fontWeight="bold" fill="white" className="font-sans">JS</text>
        </svg>
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold uppercase tracking-tight leading-none text-white">Jaap Schuurmans</h1>
        <span className="text-xs text-brand-accent tracking-widest uppercase mt-1">Meubelmakerij & Interieurbouw</span>
      </div>
    </div>
  );
};