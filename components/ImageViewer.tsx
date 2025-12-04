import React, { useState } from 'react';
import { ZoomIn, Move } from 'lucide-react';

interface ImageViewerProps {
  imageBase64: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageBase64 }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div className="glass-panel p-4 rounded-xl mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ZoomIn className="w-5 h-5 text-brand-accent" /> Technische Tekening
        </h3>
        <span className="text-xs text-brand-accent uppercase tracking-wider">
          {isZoomed ? 'Klik om uit te zoomen' : 'Klik om te inspecteren'}
        </span>
      </div>

      <div 
        className={`relative w-full overflow-hidden rounded-lg cursor-crosshair border border-white/10 transition-all duration-300 ${isZoomed ? 'h-[600px]' : 'h-[300px]'}`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img 
          src={imageBase64} 
          alt="Technische Tekening"
          className={`w-full h-full object-contain transition-transform duration-200 ${isZoomed ? 'scale-150 origin-center' : 'scale-100'}`}
          style={isZoomed ? { transformOrigin: `${position.x}% ${position.y}%` } : {}}
        />
        
        {!isZoomed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
              <Move className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
