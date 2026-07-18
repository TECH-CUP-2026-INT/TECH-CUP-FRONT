import { createContext, useContext, useEffect, useState } from 'react'

export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'

interface ColorblindContextValue {
  mode: ColorblindMode
  setMode: (mode: ColorblindMode) => void
  reset: () => void
}

const STORAGE_KEY = 'techcup-colorblind'
const MODES: ColorblindMode[] = ['none', 'protanopia', 'deuteranopia', 'tritanopia']

const ColorblindContext = createContext<ColorblindContextValue | null>(null)

export function ColorblindProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorblindMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (MODES as string[]).includes(stored || '') ? (stored as ColorblindMode) : 'none'
  })

  useEffect(() => {
    const root = document.documentElement
    for (const m of MODES) root.classList.remove(`cb-${m}`)
    if (mode !== 'none') root.classList.add(`cb-${mode}`)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const reset = () => setMode('none')

  return (
    <ColorblindContext.Provider value={{ mode, setMode, reset }}>
      {children}
    </ColorblindContext.Provider>
  )
}

export function useColorblind(): ColorblindContextValue {
  const ctx = useContext(ColorblindContext)
  if (!ctx) throw new Error('useColorblind must be used within ColorblindProvider')
  return ctx
}
