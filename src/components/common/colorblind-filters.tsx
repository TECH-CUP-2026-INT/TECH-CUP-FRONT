/**
 * Hidden SVG filters that re-inject the color information colorblind users
 * can't perceive into channels they can (daltonization), rather than
 * simulating colorblindness. Applied globally via CSS classes on <html>
 * (see cb-* rules in index.css) set by ColorblindProvider.
 */
export function ColorblindFilters() {
  return (
    <svg aria-hidden className="absolute w-0 h-0 overflow-hidden">
      <defs>
        <filter id="cb-protanopia-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1        0        0 0 0
                    0.7      1        0 0 0
                    0.7      0        1 0 0
                    0        0        0 1 0"
          />
        </filter>
        <filter id="cb-deuteranopia-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1        0.7      0 0 0
                    0        1        0 0 0
                    0        0.7      1 0 0
                    0        0        0 1 0"
          />
        </filter>
        <filter id="cb-tritanopia-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1        0        0.7 0 0
                    0        1        0.7 0 0
                    0        0        1   0 0
                    0        0        0   1 0"
          />
        </filter>
      </defs>
    </svg>
  )
}
