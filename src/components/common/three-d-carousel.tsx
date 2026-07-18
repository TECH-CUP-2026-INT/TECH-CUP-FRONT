import { useEffect, useMemo, useRef } from 'react'

interface ThreeDCarouselProps {
  images: { src: string; alt: string }[]
  /** Seconds for one full turn of the ring. */
  duration?: number
  /** Extra scale applied to whichever image is passing through the front-center. */
  maxScale?: number
  /** Angular half-width (deg) of the front-center zone that triggers the pop. */
  window?: number
  /** CSS width of the center spotlight at rest (before maxScale). Defaults to
   *  the ring's own width, but callers with limited vertical room (e.g. a
   *  short hero next to a fixed navbar) can shrink just the spotlight
   *  without affecting the background ring. */
  spotlightWidth?: string
  /** Extra vertical offset (px) applied to the central spotlight image only —
   *  useful when a fixed navbar overlaps the ring's vertical center and the
   *  spotlight needs to sit lower without moving the background ring. */
  spotlightOffsetY?: number
}

const CROSSFADE_MS = 450

/**
 * Ring of cards spinning around the Y axis, rotated via rAF (not a CSS
 * keyframe) so the live angle of every slot is known each frame. The ring
 * itself never scales its cards — instead, whichever slot is nearest
 * front-center is looked up back to its original image index and mirrored
 * into a flat `spotlight` pair that sits as plain siblings *outside* the
 * ring's `preserve-3d` context. Because they aren't part of the 3D scene,
 * normal DOM-order stacking always paints them above the whole ring, so the
 * pop (attack fast, release slow) reliably covers the neighboring cards
 * instead of fighting z-index/depth-sort quirks inside preserve-3d.
 *
 * The spotlight is actually two stacked <img>s: whichever card is nearest
 * center swaps into the *hidden* one, which then crossfades in over the
 * previous one, so the change between center images is a dissolve instead
 * of an instant cut.
 */
export function ThreeDCarousel({ images, duration = 55, maxScale = 2.2, window: windowDeg = 15, spotlightWidth = 'min(50dvw, 480px)', spotlightOffsetY = 0 }: ThreeDCarouselProps) {
  const count = images.length
  // Repeat 4x for 12 cards like original tutorial
  const cards = [...images, ...images, ...images, ...images]
  const total = cards.length

  const ringRef = useRef<HTMLDivElement>(null)
  const spotlightRefs = useRef<(HTMLImageElement | null)[]>([null, null])
  const activeSpotlightRef = useRef(0)
  const angleRef = useRef(0)
  const spotlightScaleRef = useRef(1)
  const spotlightImageIndexRef = useRef(-1)

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

      // Find the slot nearest front-center; a duplicated slot's original
      // image identity is just its index modulo the source image count.
      let bestSlot = 0
      let bestAbs = Infinity
      for (let i = 0; i < total; i++) {
        const baseAngle = i * (360 / total)
        let effective = (angleRef.current + baseAngle) % 360
        if (effective > 180) effective -= 360
        const absEffective = Math.abs(effective)
        if (absEffective < bestAbs) {
          bestAbs = absEffective
          bestSlot = i
        }
      }

      const imageIndex = bestSlot % count
      if (spotlightImageIndexRef.current !== imageIndex) {
        spotlightImageIndexRef.current = imageIndex
        const nextLayer = 1 - activeSpotlightRef.current
        const incoming = spotlightRefs.current[nextLayer]
        const outgoing = spotlightRefs.current[activeSpotlightRef.current]
        if (incoming) {
          incoming.src = images[imageIndex].src
          incoming.alt = images[imageIndex].alt
          incoming.style.opacity = '1'
        }
        if (outgoing) outgoing.style.opacity = '0'
        activeSpotlightRef.current = nextLayer
      }

      const proximity = Math.max(0, 1 - bestAbs / windowDeg)
      const target = 1 + proximity * (maxScale - 1)
      const cur = spotlightScaleRef.current
      const tau = target > cur ? tauAttack : tauRelease
      const alpha = 1 - Math.exp(-dt / tau)
      const next = cur + (target - cur) * alpha
      spotlightScaleRef.current = Math.abs(next - 1) < 0.001 ? 1 : next
      // Both layers share the same scale so the dissolve never jumps in size.
      for (const el of spotlightRefs.current) {
        if (el) el.style.transform = `scale(${spotlightScaleRef.current})`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [total, count, images, duration, maxScale, windowDeg])

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
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: 'contain',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: `rotateY(${i * (360 / total)}deg) translateZ(${radiusEm}em)`,
            }}
            draggable={false}
          />
        ))}
      </div>

      {/* Central container: mirrors whichever card is nearest front-center,
          living outside the ring's preserve-3d context so it always paints
          above the whole carousel. Two stacked layers crossfade between
          images instead of cutting instantly. */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: spotlightWidth,
          aspectRatio: '7/10',
          transform: spotlightOffsetY ? `translateY(${spotlightOffsetY}px)` : undefined,
        }}
      >
        {[0, 1].map((layer) => (
          <img
            key={layer}
            ref={(el) => { spotlightRefs.current[layer] = el }}
            src={images[0].src}
            alt={images[0].alt}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              objectFit: 'contain',
              opacity: layer === 0 ? 1 : 0,
              transition: `opacity ${CROSSFADE_MS}ms ease`,
              willChange: 'transform, opacity',
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
