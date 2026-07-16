# 🎨 TechCup — Sistema de Diseño

## Colores

### Tema base (oscuro)

| Token | Hex | Muestra | Uso |
|---|---|---|---|
| `black` | `#0B0B0F` | `bg-black` | Fondo principal |
| `purple-black` | `#160B24` | `bg-purple-black` | Fondos de tarjetas, overlays |
| `surface` | `#1F1F28` | `bg-surface` | Superficies elevadas |
| `surface-2` | `#262633` | `bg-surface-2` | Superficies hover/active |
| `border` | `rgba(255,255,255,.08)` | `border-border` | Bordes genericos |
| `purple-deep` | `#3B1264` | `bg-purple-deep` | Gradientes dark |
| `purple-deep2` | `#4C1D95` | `bg-purple-deep2` | Gradientes dark |
| `purple-mid` | `#6D28D9` | `bg-purple-mid` | Acentos, highlights, checkboxes |
| `gold` | `#F5A623` | `bg-gold / text-gold` | **Color principal de marca** — CTAs, hover states, highlights |
| `gold-2` | `#F59E0B` | `bg-gold-2` | Variante gold |
| `gold-dark` | `#D97706` | `hover:bg-gold-dark` | Hover de botones gold |
| `gray-light` | `#E5E7EB` | `text-gray-light` | Texto principal |
| `text-muted` | `#9B98A8` | `text-text-muted` | Texto secundario |
| `text-faint` | `#6E6B80` | `text-text-faint` | Texto terciario, labels, placeholders |

### Colores de equipo (cancha táctica)

| Equipo | Hex | Clase Tailwind |
|---|---|---|
| **Sistemas** (local) | `#22C55E` (green-500) | `text-green-400 bg-green-500/15 border-green-500/20` |
| **Civil** (visitante) | `#EF4444` (red-500) | `text-red-400 bg-red-500/15 border-red-500/20` |

### Estados de cancha (Campus)

| Estado | Hex | Clase |
|---|---|---|
| Disponible | `#22C55E` | `text-green-400 bg-green-500/10 border-green-500/20` |
| Ocupado | `#EF4444` | `text-red-400 bg-red-500/10 border-red-500/20` |
| Mantenimiento | `#F59E0B` | `text-amber-400 bg-amber-500/10 border-amber-500/20` |

---

## Tipografía

| Rol | Font | Clase |
|---|---|---|
| Display / Títulos | `Oswald` | `font-[family-name:var(--font-display)]` |
| Display alt | `Archivo Black` | `font-[family-name:var(--font-display-alt)]` |
| Cuerpo | `Inter` | `font-[family-name:var(--font-body)]` (default) |

---

## Sombras & Glows

```css
/* Sombras de tarjetas glass */
shadow-sm:  0 2px 8px rgba(0,0,0,0.08)
shadow-md:  0 4px 16px rgba(0,0,0,0.10)
shadow-lg:  0 8px 32px rgba(0,0,0,0.12)
shadow-xl:  0 16px 48px rgba(0,0,0,0.16)

/* Glows de fondo (background blur) */
.glow-purple:  bg-purple-mid/15 blur-[150px]
.glow-gold:    bg-gold/15 blur-[120px]
.glow-green:   bg-green-500/10 blur-[150px]
```

---

## Layout

```
┌─────────────────────────────────────┐
│  Sidebar (260px / 72px collapsed)   │
│  ↓                                  │
│  Nav links con icono                │
│  Promo "Crear equipo"               │
│  Perfil usuario                     │
├─────────────────────────────────────┤
│  AppTopbar (título + menú hamburg)  │
├─────────────────────────────────────┤
│  main (p-8, max-md:p-5)            │
│  ┌─── background glow layers ────┐  │
│  │   Content (cards, grids)      │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### Sidebar

- **Ancho**: 260px abierta, 72px colapsada
- **Auto-show**: hover en borde izquierdo (< 25px)
- **Overlay**: fondo negro 60% cuando se abre manualmente en mobile
- **Nav**: `text-gray-light`, hover `text-white`, active `bg-purple-mid/22 text-white border-l-gold`
- **Scrollbar**: estilizado oscuro

### Padding responsivo

```css
main {
  padding: 2rem;          /* desktop */
  padding: 1.25rem;       /* mobile (max-md) */
  padding-bottom: 60px;
}
```

---

## Componentes clave

### GlassCard → LiquidGlassCard

El `GlassCard` original fue reemplazado por `LiquidGlassCard` (inspirado en 21st.dev / Apple Liquid Glass).

```tsx
import { LiquidGlassCard } from '@/components/ui/liquid-weather-glass'

<LiquidGlassCard
  shadowIntensity="md"     // none | xs | sm | md | lg
  borderRadius="16px"
  glowIntensity="sm"       // none | xs | sm | md | lg
  className="p-6"
>
  {/* contenido */}
</LiquidGlassCard>
```

**Efectos**:
- `backdrop-blur-xl` + `bg-white/[0.06]` para el vidrio
- Conic-gradient animado rotando 360° (ola líquida)
- Shine sweep diagonal cada 4s
- Mouse tracking con radial-gradient en `--mouse-x` / `--mouse-y`

### SpotlightCard

```tsx
import { SpotlightCard } from '@/components/ui/spotlight-card'

<SpotlightCard accent="purple" className="p-5 bg-surface border-border rounded-2xl">
  {/* contenido */}
</SpotlightCard>
```

Props: `accent: 'gold' | 'purple'`

### Cancha táctica (MatchDetail)

- **SVG viewBox**: `300x400` (3:4 aspect ratio)
- **Marcación**: área chica (18%), área grande (12.5%-87.5%), círculo central, punto penal
- **Jugadores**: `PlayerDot` con DiceBear avatar + número + glow del equipo
- **Filtro**: `selectedTeam: 'local' | 'visitor' | 'both'`
- **Ambiente**: gradas de estadio, reflectores, vignette

---

## Animaciones

| Nombre | Duración | Uso |
|---|---|---|
| `aurora` | 60s linear infinite | Fondo aurora |
| `marquee` | var(--duration, 40s) | Carruseles |
| `ping` | 1s | Indicador "en vivo" (cancha ocupada) |
| Shine sweep | 4s | LiquidGlassCard |
| Conic rotate | 8s | LiquidGlassCard wave |
| Fade in (motion) | 0.3-0.5s | Entrada de páginas y secciones |

---

## Patrones

### Background glow layers (casi todas las páginas)

```tsx
<div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
<div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
```

### Sidebar + AppTopbar + Footer (layout estándar)

```tsx
export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0">
        <AppTopbar title="Título" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-8 pb-[60px] max-md:p-5 relative">
          {/* glows */}
          {/* contenido */}
        </main>
        <Footer />
      </div>
    </div>
  )
}
```

---

## Datos

| Archivo | Contenido |
|---|---|
| `src/data/partidos.ts` | Partidos, posiciones |
| `src/data/campus.ts` | Canchas del campus (disponibles/ocupadas) |
| `src/data/torneos.ts` | Torneos (si existe) |

---

## Íconos

Usamos [**Lucide React**](https://lucide.dev/icons/) — importás directo:

```tsx
import { MapPin, Fence, ShieldCheck, Users, Wrench } from 'lucide-react'
```

---

## Efecto Glass en inputs (Login)

```css
/* Inputs dentro de LiquidGlassCard */
bg-black/30 border-border/60 rounded-xl pl-10 h-12
focus-visible:border-purple-mid

/* Botón gold (CTA principal) */
rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark
shadow-lg shadow-gold/20 hover:shadow-gold/30
```

---

## 📘 Manual de Identidad — Pasos para armarlo

Este `DESIGN.md` es la base técnica. El **Manual de Identidad** es el documento visual y estratégico que define la marca. Estos son los pasos para armarlo:

### 1. Definir la marca

| Elemento | Qué documentar |
|---|---|
| **Nombre** | TechCup |
| **Tagline** | "La pasión nos conecta" / "La pasión nos une, la ingeniería nos impulsa" |
| **Misión** | Plataforma oficial de torneos de fútbol de la Decanatura de Ingeniería de Sistemas |
| **Público** | Estudiantes, docentes, egresados de Ingeniería de Sistemas |
| **Tono de voz** | Apasionado, directo, universitario, con personalidad (ver AGENTS.md) |

### 2. Logotipo

Crear variantes del logo y documentar:

- [ ] **Logo principal** — Escudo/balón + TECH CUP + INGENIERÍA DE SISTEMAS (horizontal)
- [ ] **Logo simplificado** — Solo el escudo/balón (favicon, avatar)
- [ ] **Variante oscura** — Para fondos claros (si aplica)
- [ ] **Área de resguardo** — Mínimo 20% del ancho del logo alrededor
- [ ] **Tamaño mínimo** — 24px para el simplificado, 120px para el completo
- [ ] **Usos incorrectos** — No rotar, no distorsionar, no cambiar colores, no poner sobre fondos que compitan

### 3. Paleta de color corporativa

| Rol | Token | Hex | RGB |
|---|---|---|---|
| **Principal** | gold | `#F5A623` | `rgb(245,166,35)` |
| **Secundario** | purple-mid | `#6D28D9` | `rgb(109,40,217)` |
| **Fondo** | black | `#0B0B0F` | `rgb(11,11,15)` |
| **Superficie** | surface | `#1F1F28` | `rgb(31,31,40)` |
| **Acento 1** | purple-deep | `#3B1264` | `rgb(59,18,100)` |
| **Acento 2** | purple-deep2 | `#4C1D95` | `rgb(76,29,149)` |
| **Texto principal** | gray-light | `#E5E7EB` | `rgb(229,231,235)` |
| **Texto secundario** | text-muted | `#9B98A8` | `rgb(155,152,168)` |

Para cada color documentar:
- Código HEX, RGB, HSL
- Cuándo usarlo (fondo, texto, borde, hover, estado)
- Contraste sobre fondo negro (todos pasan AA/AAA)
- Variantes hover/active/disabled

### 4. Tipografía corporativa

| Rol | Fuente | Peso | Tamaños | Uso |
|---|---|---|---|---|
| **Títulos grandes** | Oswald | 700 | 24-48px | H1, hero, displays |
| **Títulos medios** | Oswald | 600 | 16-24px | H2, H3, tarjetas |
| **Display alt** | Archivo Black | 400 | 24-48px | Variante hero |
| **Cuerpo** | Inter | 400, 500, 600, 700 | 12-16px | Párrafos, labels, botones |
| **Mono (futuro)** | JetBrains Mono | — | — | Código, datos |

Documentar:
- Jerarquía tipográfica completa (display-xl, display-lg, h1-h6, body, small, caption)
- Altura de línea y tracking para cada nivel
  - Títulos: `leading-tight` (1.1), `tracking-[.5px]`
  - Cuerpo: `leading-relaxed` (1.625)
- Contraste de pesos (usar bold solo para énfasis real)

### 5. Sistema de espaciado y grid

| Token | Valor | Uso |
|---|---|---|
| `gap-3` | 12px | Entre elementos relacionados |
| `gap-5` | 20px | Separación entre componentes |
| `gap-8` | 32px | Secciones |
| `p-8` | 32px | Padding de página |
| `p-5` | 20px | Padding de tarjeta |
| `max-w-[420px]` | — | Ancho de formularios |

- **Grid**: 4 columnas → 2 columnas → 1 columna responsivo
- **Breakpoints**: `md: 768px`, `lg: 1024px`

### 6. Iconografía

- **Librería**: Lucide React (open source, consistente)
- **Tamaños**: 16px (inline), 20px (nav), 24px+ (decorativo)
- **Estilo**: Line icons, stroke-width 2, sin relleno
- **Color**: Heredan del texto, o `text-gold`/`text-purple-mid` para acentos

### 7. Fotografía e imágenes

- **Estilo**: Oscuras, dramáticas, con gradientes overlay
- **Fondo de cancha**: SVGs con viewBox 300x400, marcación blanca opacidad 15%
- **Avatares**: DiceBear avataaars (SVG) para jugadores placeholder
- **Banners**: Imagen de cancha/estadio con overlay purple-black 80-90%
- **Tratamiento**: Siempre overlay gradiente, nunca imagen directa sin editar

### 8. Estados de componentes

| Componente | Normal | Hover | Active | Disabled |
|---|---|---|---|---|
| **Btn gold** | `bg-gold text-[#1A1206] shadow-gold/20` | `bg-gold-dark shadow-gold/30` | `scale-[0.97]` | `opacity-50 cursor-not-allowed` |
| **Btn outline** | `bg-white/5 border-border` | `bg-white/10 text-white` | — | `opacity-50` |
| **Input** | `bg-black/30 border-border/60` | — | `focus-visible:border-purple-mid ring-ring/50` | `opacity-50` |
| **Nav link** | `text-gray-light border-transparent` | `bg-white/5 text-white` | `bg-purple-mid/22 text-white border-l-gold` | — |
| **Checkbox** | `border-border` | — | `bg-purple-mid border-purple-mid` | `opacity-50` |

### 9. Aplicaciones específicas

Documentar con capturas de pantalla:

- [ ] **Landing page** — Hero con video, torneos, stats, footer
- [ ] **Dashboard** — Hero, stats cards, próximos partidos, tabla de posiciones
- [ ] **Login / Registro** — LiquidGlassCard con efecto vidrio, luces de fondo
- [ ] **Calendario** — Timeline de partidos con hero de estadio
- [ ] **MatchDetail** — Header VS estilo Paramount+, cancha táctica con filtro por equipo
- [ ] **Campus** — Grid de canchas disponibles/ocupadas con indicador en vivo
- [ ] **Sidebar** — Navegación colapsable con auto-show, perfil, promo
- [ ] **Mobile** — Sidebar como overlay, topbar con hamburguesa, layout fluido

### 10. Checklist de entrega

- [ ] PDF del manual listo para imprimir (mínimo 20 páginas)
- [ ] Archivo fuente (.ai, .fig, o .sketch)
- [ ] Kit de logos (PNG, SVG, favicon.ico)
- [ ] Paleta exportada (.ase, .clr)
- [ ] Tipografías enlazadas (Google Fonts) o empaquetadas
- [ ] Componentes en Storybook (opcional)
- [ ] Token CSS exportable ```
