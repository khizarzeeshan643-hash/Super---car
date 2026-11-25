import { useState } from 'react';
import { Camera } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  loading = 'eager',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE6] text-[#5C5954] border border-[#E2DFD7] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="w-6 h-6 mb-2 text-[#8C8881]" strokeWidth={1.5} />
        <p className="font-serif text-sm font-medium text-[#141416]">
          {fallbackTitle || alt}
        </p>
        <p className="text-xs text-[#6E6B65] mt-1">Archival Plate Unavailable</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-90'
      }`}
    />
  );
}
