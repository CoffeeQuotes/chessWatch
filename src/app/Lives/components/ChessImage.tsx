// components/ChessImage.tsx
import Image from 'next/image';

export default function ChessImage({ src, alt, ...props }: any) {
  const isExternal = src.startsWith('http');
  
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={isExternal}
      onError={(e) => {
        e.currentTarget.src = "/chess-fallback.png";
      }}
      {...props}
    />
  );
}