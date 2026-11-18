import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 text-stone-200 p-4 text-center ${className}`}
      >
        <BookOpen className="w-6 h-6 text-amber-300/80 mb-2 shrink-0" />
        <span className="text-xs font-medium text-stone-200 line-clamp-2 max-w-[220px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
