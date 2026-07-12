interface ThreeDCarouselProps {
  images: { src: string; alt: string }[]
}

export function ThreeDCarousel({ images }: ThreeDCarouselProps) {
  const count = images.length
  if (count === 0) return null

  // Repeat 4x for 12 cards like original tutorial
  const cards = [...images, ...images, ...images, ...images]
  const total = cards.length

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        perspective: '35em',
        mask: 'linear-gradient(90deg, transparent, red 15% 85%, transparent)',
        WebkitMask: 'linear-gradient(90deg, transparent, red 15% 85%, transparent)',
      }}
    >
      <div
        className="relative"
        style={{
          width: 'min(28dvw, 260px)',
          aspectRatio: '7/10',
          transformStyle: 'preserve-3d',
          animation: 'rr-spin 40s linear infinite',
        }}
      >
        {cards.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              borderRadius: '1.5em',
              border: '1.5px solid rgba(0,0,0,0.15)',
              boxShadow: '0 0 30px rgba(231,173,48,0.15), 0 8px 30px rgba(0,0,0,0.2)',
              filter: 'brightness(1.06) contrast(1.06)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: `rotateY(${i * (360 / total)}deg) translateZ(calc(-1 * (.5 * 20em + .5em) / tan(.5 * (360deg / ${total}))))`,
            }}
            draggable={false}
          />
        ))}
      </div>

      <style>{`
        @keyframes rr-spin {
          to { transform: rotateY(1turn); }
        }
      `}</style>
    </div>
  )
}
