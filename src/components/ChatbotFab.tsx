import { useRef, useEffect } from 'react'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'

export interface ChatbotFabProps {
  /** Controla se o painel do chat está aberto. */
  aberto: boolean
  onAbrir: () => void
  onFechar: () => void
  children: React.ReactNode
}

export function ChatbotFab({ aberto, onAbrir, onFechar, children }: ChatbotFabProps) {
  const { tema } = useTema()
  const isLight = tema === 'light'
  const c = classesTema(isLight)
  const painelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aberto) {
      painelRef.current?.focus({ preventScroll: true })
    }
  }, [aberto])

  return (
    <>
      {/* FAB: visível quando o painel está fechado */}
      {!aberto && (
        <button
          type="button"
          onClick={onAbrir}
          aria-label="Abrir assistente de planejamento"
          className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            isLight
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-emerald-500/90 text-white hover:bg-emerald-500'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Painel: sheet no mobile, drawer no desktop */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 lg:inset-auto lg:left-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-full lg:max-w-md"
          aria-modal="true"
          role="dialog"
          aria-label="Assistente de planejamento de férias"
        >
          {/* Overlay: cobre a tela no mobile; no desktop cobre só o resto */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity lg:bg-black/30"
            onClick={onFechar}
            aria-hidden
          />
          {/* Sheet (mobile) / Drawer (desktop) */}
          <div
            ref={painelRef}
            tabIndex={-1}
            className={`absolute left-0 right-0 bottom-0 top-auto max-h-[90vh] flex flex-col rounded-t-2xl shadow-2xl lg:top-0 lg:bottom-0 lg:left-auto lg:right-0 lg:max-h-none lg:rounded-none lg:border-l ${c.pagina} ${c.cardBorda} transition-transform duration-300 ease-out`}
          >
            <div className={`flex items-center justify-between gap-3 px-4 py-3 border-b shrink-0 ${c.cardBorda}`}>
              <h2 className={`font-display text-lg font-semibold ${c.paginaTitulo}`}>
                Assistente
              </h2>
              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar assistente"
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl font-medium transition-colors ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-800/80 hover:bg-slate-700/80'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
