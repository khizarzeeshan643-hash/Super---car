import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { GalleryPhoto } from '../types/car';
import { ResilientImage } from './ResilientImage';

export interface LightboxItem extends GalleryPhoto {
  vehicleTitle: string;
}

interface LightboxModalProps {
  items: LightboxItem[];
  initialIndex: number;
  onClose: () => void;
}

export function LightboxModal({ items, initialIndex, onClose }: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  const total = items.length;
  const active = items[currentIndex] ?? items[0];

  useEffect(() => {
    setZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, total]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B0B0D]/97 text-[#FAF9F6] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery lightbox: ${active.vehicleTitle}`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 border-b border-white/10 shrink-0">
        <div className="min-w-0">
          <p className="font-serif text-base sm:text-lg font-medium text-white truncate">
            {active.vehicleTitle}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">
            {active.figureNumber} · {active.location}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs tabular-nums text-neutral-400 mr-2">
            {currentIndex + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? 'Reset zoom' : 'Zoom photograph'}
            className="p-2 rounded-md border border-white/15 text-neutral-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="p-2 rounded-md border border-white/15 text-neutral-200 hover:bg-[#C81E1E] hover:border-[#C81E1E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16 py-4 overflow-hidden">
        {total > 1 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + total) % total)}
            aria-label="Previous photograph"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-md bg-black/60 border border-white/15 text-white hover:bg-[#C81E1E] hover:border-[#C81E1E] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center overflow-auto">
          <ResilientImage
            src={active.src}
            alt={active.alt}
            fallbackTitle={active.vehicleTitle}
            className={`max-h-full max-w-full object-contain select-none transition-transform duration-200 ${
              zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
            }`}
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % total)}
            aria-label="Next photograph"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-md bg-black/60 border border-white/15 text-white hover:bg-[#C81E1E] hover:border-[#C81E1E] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Caption & EXIF Metadata Footer */}
      <div className="border-t border-white/10 bg-[#070708] px-5 sm:px-8 py-4 shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm text-neutral-200 leading-relaxed">{active.caption}</p>
            <p className="font-mono text-xs text-neutral-400 mt-1.5 tabular-nums">
              {active.exif.camera} · {active.exif.lens} · {active.exif.focalLength} ·{' '}
              {active.exif.aperture} · {active.exif.shutter} · ISO {active.exif.iso}
            </p>
          </div>

          {/* Filmstrip Thumbnails */}
          {total > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {items.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`View ${item.figureNumber}`}
                  className={`w-16 h-11 rounded overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-[#C81E1E] opacity-100'
                      : 'border-white/15 opacity-50 hover:opacity-85'
                  }`}
                >
                  <ResilientImage
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
