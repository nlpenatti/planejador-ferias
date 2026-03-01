import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Conteúdo exibido quando há erro (fallback). */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  temErro: boolean
  erro: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    temErro: false,
    erro: null,
  }

  static getDerivedStateFromError(erro: Error): ErrorBoundaryState {
    return { temErro: true, erro }
  }

  componentDidCatch(erro: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary capturou erro:', erro, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.temErro && this.state.erro) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-slate-100 dark:bg-[#0a0a0f] text-slate-700 dark:text-slate-400"
          role="alert"
        >
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Algo deu errado
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-500 max-w-md text-center">
            {this.state.erro.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ temErro: false, erro: null })}
            className="px-4 py-2 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
