import { useEffect, useMemo, useRef } from 'react'

interface ThreeDCarouselProps {
  images: { src: string; alt: string }[]
  /** Seconds for one full turn of the ring. */
  duration?: number
  /** Extra scale applied to whichever card is passing through the front-center. */
  maxScale?: number
  /** Angular half-width (deg) of the front-center zone that triggers the pop. */
  window?: number
}

/**
 * Ring of cards spinning around the Y axis. Rotation is driven by rAF (not a
 * CSS keyframe) so each card's live angle is known every frame: whichever
 * card is crossing the front-center gets an extra scale pop that snaps in
 * fast (attack) and eases back out slowly (release) as it leaves center.
 */
export function ThreeDCarousel({ images, duration = 33.3, maxScale = 2.2, window: windowDeg = 15 }: ThreeDCarouselProps) {
  const count = images.length
  // Repeat 4x for 12 cards like original tutorial
  const cards = [...images, ...images, ...images, ...images]
  const total = cards.length

  const ringRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLImageElement | null)[]>([])
  const angleRef = useRef(0)
  const scalesRef = useRef<number[]>(new Array(total).fill(1))

  // Radius is constant for a given `total` — compute the trig once instead of
  // asking the CSS engine to evaluate tan() inside a calc() every frame.
  const radiusEm = useMemo(() => -(0.5 * 28 + 0.5) / Math.tan(Math.PI / total), [total])

  useEffect(() => {
    const ring = ringRef.current
    if (!ring || total === 0) return

    let raf = 0
    let last = performance.now()
    const degPerSec = 360 / duration
    // Time-constants (seconds), not per-frame rates, so the motion stays
    // identical regardless of the display's refresh rate or frame drops.
    const tauAttack = 0.1
    const tauRelease = 0.45

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      angleRef.current = (angleRef.current + degPerSec * dt) % 360
      ring.style.transform = `rotateY(${angleRef.current}deg)`

      for (let i = 0; i < total; i++) {
        const el = cardRefs.current[i]
        if (!el) continue

        const baseAngle = i * (360 / total)
        let effective = (angleRef.current + baseAngle) % 360
        if (effective > 180) effective -= 360
        const proximity = Math.max(0, 1 - Math.abs(effective) / windowDeg)
        const target = 1 + proximity * (maxScale - 1)

        const cur = scalesRef.current[i]
        if (proximity === 0 && Math.abs(cur - 1) < 0.001) continue // idle — skip the DOM write entirely

        const tau = target > cur ? tauAttack : tauRelease
        const alpha = 1 - Math.exp(-dt / tau)
        const next = cur + (target - cur) * alpha
        scalesRef.current[i] = Math.abs(next - 1) < 0.001 ? 1 : next

        el.style.zIndex = String(Math.round(proximity * 100))
        el.style.transform = `rotateY(${baseAngle}deg) translateZ(${radiusEm}em) scale(${scalesRef.current[i]})`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [total, duration, maxScale, windowDeg, radiusEm])

  if (count === 0) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        perspective: '35em',
        mask: 'linear-gradient(90deg, transparent 2%, red 10% 90%, transparent 98%)',
        WebkitMask: 'linear-gradient(90deg, transparent 2%, red 10% 90%, transparent 98%)',
      }}
    >
      <div
        ref={ringRef}
        className="relative"
        style={{
          width: 'min(50dvw, 480px)',
          aspectRatio: '7/10',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {cards.map((img, i) => (
          <img
            key={i}
            ref={(el) => { cardRefs.current[i] = el }}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              willChange: 'transform',
              transform: `rotateY(${i * (360 / total)}deg) translateZ(${radiusEm}em)`,
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
