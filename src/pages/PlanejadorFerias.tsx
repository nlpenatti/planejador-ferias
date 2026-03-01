import { useState, useRef, useEffect } from 'react'
import { CalendarioAnual } from '@/components/CalendarioAnual'
import { CalendarioSkeleton } from '@/components/CalendarioSkeleton'
import { SidebarPlanejador } from '@/components/SidebarPlanejador'
import { usePlanejadorFerias } from '@/hooks/usePlanejadorFerias'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'

const LIMIAR_FECHAR_ARRASTO_PX = 120

export function PlanejadorFerias() {
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [arrastoY, setArrastoY] = useState(0)
  const [sheetVisivel, setSheetVisivel] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const touchInicio = useRef<{ y: number; arrastoInicial: number } | null>(null)
  const { tema, alternarTema } = useTema()

  useEffect(() => {
    if (sidebarAberta) {
      setArrastoY(0)
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setSheetVisivel(true))
      })
      return () => cancelAnimationFrame(id)
    }
    setSheetVisivel(false)
  }, [sidebarAberta])

  const fecharSheet = () => {
    setSheetVisivel(false)
    const id = setTimeout(() => setSidebarAberta(false), 280)
    return () => clearTimeout(id)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchInicio.current = { y: e.touches[0].clientY, arrastoInicial: arrastoY }
    setArrastando(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchInicio.current) return
    const delta = e.touches[0].clientY - touchInicio.current.y
    const novo = touchInicio.current.arrastoInicial + delta
    setArrastoY(Math.max(0, novo))
  }

  const handleTouchEnd = () => {
    setArrastando(false)
    if (!touchInicio.current) return
    if (arrastoY >= LIMIAR_FECHAR_ARRASTO_PX) {
      setSheetVisivel(false)
      setTimeout(() => setSidebarAberta(false), 280)
    } else {
      setArrastoY(0)
    }
    touchInicio.current = null
  }
  const {
    ano,
    setAno,
    diasDeFerias,
    setDiasDeFerias,
    diasCustomizado,
    setDiasCustomizado,
    diasEfetivos,
    feriados,
    erroFeriados,
    oportunidades,
    oportunidadeSelecionada,
    setOportunidadeSelecionada,
    oportunidadeEmHover,
    setOportunidadeEmHover,
    oportunidade,
    oportunidadeHover,
    limparSelecao,
    temSelecao,
    recarregarFeriados,
  } = usePlanejadorFerias()

  const isLight = tema === 'light'
  const c = classesTema(isLight)

  return (
    <div
      className={`min-h-screen font-sans selection:bg-emerald-500/20 antialiased px-4 py-4 sm:px-6 sm:py-6 transition-colors ${c.pagina}`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] rounded-full ${c.headerBlur}`} />
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 relative">
        <header className="flex justify-between items-center gap-3">
          <div className="min-w-0">
            <h1 className={`font-display text-2xl font-semibold tracking-tight ${c.paginaTitulo}`}>
              Planejador de Férias
            </h1>
            <p className={`${c.paginaSubtitulo}`}>
              Combine férias com feriados e fins de semana.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarAberta(true)}
              aria-label="Abrir configuração"
              className={`lg:hidden flex items-center gap-2 min-h-[44px] px-4 rounded-xl font-medium transition-colors ${
                isLight
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="sr-only sm:not-sr-only sm:inline">Configuração</span>
            </button>
            <button
              type="button"
              onClick={alternarTema}
              aria-label={isLight ? 'Ativar tema escuro' : 'Ativar tema claro'}
              className={`min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center p-2 rounded-xl transition-colors ${
              isLight
                ? 'bg-slate-200 text-amber-600 hover:bg-slate-300'
                : 'bg-slate-800/80 text-amber-400 hover:bg-slate-700/80'
            }`}
          >
            {isLight ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <div className="hidden lg:block">
            <SidebarPlanejador
            ano={ano}
            setAno={setAno}
            diasDeFerias={diasDeFerias}
            setDiasDeFerias={setDiasDeFerias}
            diasCustomizado={diasCustomizado}
            setDiasCustomizado={setDiasCustomizado}
            diasEfetivos={diasEfetivos}
            oportunidades={oportunidades}
            oportunidadeSelecionada={oportunidadeSelecionada}
            setOportunidadeSelecionada={setOportunidadeSelecionada}
            oportunidadeEmHover={oportunidadeEmHover}
            setOportunidadeEmHover={setOportunidadeEmHover}
            limparSelecao={limparSelecao}
            temSelecao={temSelecao}
            />
          </div>

          {/* Bottom sheet mobile: sobe de baixo, arrastar para fechar */}
          {sidebarAberta && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              aria-modal="true"
              role="dialog"
              aria-label="Configuração e oportunidades"
            >
              <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={fecharSheet}
                aria-hidden
              />
              <div
                className={`fixed left-0 right-0 bottom-0 max-h-[90vh] flex flex-col rounded-t-2xl shadow-2xl ${c.pagina} ${!arrastando ? 'transition-transform duration-300 ease-out' : ''}`}
                style={{
                  transform: sheetVisivel ? `translateY(${arrastoY}px)` : 'translateY(100%)',
                }}
              >
                {/* Alça para arrastar com o dedo */}
                <div
                  className="flex shrink-0 flex-col items-center pt-3 pb-2 touch-none cursor-grab active:cursor-grabbing"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  role="button"
                  tabIndex={0}
                  aria-label="Arrastar para fechar"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fecharSheet()
                  }}
                >
                  <div
                    className={`w-12 h-1 rounded-full shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}
                    aria-hidden
                  />
                </div>
                <div className={`flex items-center justify-between gap-3 px-4 pb-3 border-b shrink-0 ${c.cardBorda}`}>
                  <h2 className={`font-display text-lg font-semibold ${c.paginaTitulo}`}>Configuração</h2>
                  <button
                    type="button"
                    onClick={fecharSheet}
                    aria-label="Fechar configuração"
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl font-medium transition-colors ${
                      isLight ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-800/80 hover:bg-slate-700/80'
                    }`}
                  >
                    Fechar
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                  <div className="p-4 pb-8">
                    <SidebarPlanejador
                      ano={ano}
                      setAno={setAno}
                      diasDeFerias={diasDeFerias}
                      setDiasDeFerias={setDiasDeFerias}
                      diasCustomizado={diasCustomizado}
                      setDiasCustomizado={setDiasCustomizado}
                      diasEfetivos={diasEfetivos}
                      oportunidades={oportunidades}
                      oportunidadeSelecionada={oportunidadeSelecionada}
                      setOportunidadeSelecionada={(v) => {
                        setOportunidadeSelecionada(v)
                        fecharSheet()
                      }}
                      oportunidadeEmHover={oportunidadeEmHover}
                      setOportunidadeEmHover={setOportunidadeEmHover}
                      limparSelecao={limparSelecao}
                      temSelecao={temSelecao}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Área Principal (Calendário) */}
          <section className="flex flex-col gap-4">
            {(oportunidade || oportunidadeHover) && (
              <div className={`flex flex-wrap gap-3 px-3 py-2 border rounded-lg ${c.legenda}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs sm:text-[9px] font-medium text-slate-500 uppercase tracking-wider">Agendar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full border border-emerald-500/50 bg-emerald-500/10" />
                  <span className="text-xs sm:text-[9px] font-medium text-slate-500 uppercase tracking-wider">Emenda</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs sm:text-[9px] font-medium text-slate-500 uppercase tracking-wider">Feriado</span>
                </div>
              </div>
            )}

            <div className={`rounded-2xl border p-4 ${c.card}`}>
              {feriados ? (
                <CalendarioAnual
                  ano={ano}
                  feriados={feriados}
                  oportunidadeSelecionada={oportunidade}
                  oportunidadeEmHover={oportunidadeHover}
                />
              ) : erroFeriados ? (
                <div className={`h-[420px] flex flex-col items-center justify-center gap-4 text-[13px] font-medium ${c.erro}`} role="alert">
                  <p>{erroFeriados}</p>
                  <button
                    type="button"
                    onClick={() => recarregarFeriados()}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      isLight
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-emerald-500/80 text-white hover:bg-emerald-500'
                    }`}
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : (
                <div className="h-[420px] overflow-hidden">
                  <CalendarioSkeleton />
                </div>
              )}
            </div>
          </section>

          <footer className={`mt-8 pt-6 border-t flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${c.cardBorda}`}>
            <span className={`text-sm ${c.textoMuted}`}>Feito por Nicolas Penatti</span>
            <a
              href="https://www.linkedin.com/in/nicolaspenatti"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de Nicolas Penatti"
              className={`inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </footer>
        </div>
      </div>
    </div>
  )
}
