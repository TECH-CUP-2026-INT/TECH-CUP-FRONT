import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeroCarouselProps {
  images: { src: string; alt: string }[]
  interval?: number
  onImageChange?: (src: string) => void
}

export function HeroCarousel({ images, interval = 4000, onImageChange }: HeroCarouselProps) {
  const [idx, setIdx] = useState(0)
  const onChangeRef = useRef(onImageChange)
  onChangeRef.current = onImageChange

  const next = useCallback(() => {
    setIdx(i => {
      const nextIdx = (i + 1) % images.length
      onChangeRef.current?.(images[nextIdx].src)
      return nextIdx
    })
  }, [images])

  useEffect(() => {
    onChangeRef.current?.(images[idx].src)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(next, interval)
    return () => clearInterval(t)
  }, [next, interval, images.length])

  if (images.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={images[idx].src}
            alt={images[idx].alt}
            className="w-full h-full object-contain"
            draggable={false}
          />
          {/* Gradient overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-black/80 via-purple-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
