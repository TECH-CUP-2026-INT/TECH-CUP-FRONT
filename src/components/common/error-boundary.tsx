import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/common/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-5">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] mb-2">
            Algo salió <span className="text-red-400">mal</span>
          </h2>
          <p className="text-sm text-text-muted max-w-md mb-6">
            Ocurrió un error inesperado. Puede ser un problema de conexión o un error en la aplicación.
          </p>
          {this.state.error && (
            <pre className="text-[11px] text-red-400/60 bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6 max-w-md overflow-auto text-left">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleRetry} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-11 px-6 gap-2">
            <RefreshCw size={16} /> Intentar de nuevo
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <p className="font-semibold text-sm mb-1">Error al cargar los datos</p>
      <p className="text-xs text-text-muted mb-5">{message || 'No se pudieron cargar los datos. Intentá de nuevo.'}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark text-xs h-9 px-4 gap-1.5">
          <RefreshCw size={13} /> Reintentar
        </Button>
      )}
    </div>
  )
}
