import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface GalleryImage {
  src: string
  alt: string
}

interface GalleryCarouselProps {
  images: GalleryImage[]
  interval?: number
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -600 : 600,
    opacity: 0,
    scale: 0.92,
  }),
}

export function GalleryCarousel({ images, interval = 4500 }: GalleryCarouselProps) {
  const [[page, dir], setPage] = useState([0, 0])
  const [paused, setPaused] = useState(false)
  const i = ((page % images.length) + images.length) % images.length

  const go = useCallback(
    (delta: number) => setPage(([p, _d]) => [p + delta, delta]),
    []
  )

  const goTo = useCallback((idx: number) => {
    setPage(([p, _d]) => [p + idx - (((p % images.length) + images.length) % images.length), idx - (((p % images.length) + images.length) % images.length)])
  }, [images.length])

  // Auto-play
  useEffect(() => {
    if (paused || images.length <= 1) return
    const t = setInterval(() => go(1), interval)
    return () => clearInterval(t)
  }, [paused, interval, images.length, go])

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full max-w-[900px] mx-auto select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image container */}
      <div       className="relative aspect-[16/9] rounded-2xl overflow-hidden group
        border border-white/10 dark:border-white/10
        shadow-[0_30px_80px_-20px_rgba(109,40,217,0.5)]
        dark:shadow-[0_30px_80px_-20px_rgba(109,40,217,0.5)]
        bg-surface">
        
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <img
              src={images[i].src}
              alt={images[i].alt}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Counter badge */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full
          bg-black/50 backdrop-blur-sm border border-white/15
          text-white text-xs font-bold tracking-wider">
          {i + 1} / {images.length}
        </div>

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 z-10 p-6"
          >
            <p className="text-white/90 text-sm font-semibold tracking-wide">
              {images[i].alt}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Left arrow */}
        <button
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 rounded-full flex items-center justify-center
            bg-black/40 backdrop-blur-sm border border-white/15
            text-white hover:bg-gold hover:border-gold hover:text-black
            transition-all duration-200 opacity-60 group-hover:opacity-100
            hover:scale-110"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 rounded-full flex items-center justify-center
            bg-black/40 backdrop-blur-sm border border-white/15
            text-white hover:bg-gold hover:border-gold hover:text-black
            transition-all duration-200 opacity-60 group-hover:opacity-100
            hover:scale-110"
          aria-label="Siguiente"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === i
                  ? 'w-8 bg-gold'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          key={i}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: 'linear' }}
          className="h-full origin-left bg-gradient-to-r from-gold to-purple-mid rounded-full"
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </div>
  )
}
