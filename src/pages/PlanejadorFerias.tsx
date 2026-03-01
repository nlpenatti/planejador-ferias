import { useState } from 'react'
import { CalendarioAnual } from '@/components/CalendarioAnual'
import { CalendarioSkeleton } from '@/components/CalendarioSkeleton'
import { SidebarPlanejador } from '@/components/SidebarPlanejador'
import { usePlanejadorFerias } from '@/hooks/usePlanejadorFerias'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'

export function PlanejadorFerias() {
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const { tema, alternarTema } = useTema()
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

          {/* Drawer mobile: configuração e lista de oportunidades */}
          {sidebarAberta && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              aria-modal="true"
              role="dialog"
              aria-label="Configuração e oportunidades"
            >
              <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={() => setSidebarAberta(false)}
                aria-hidden
              />
              <div
                className={`absolute top-0 right-0 bottom-0 w-full max-w-sm flex flex-col shadow-xl transition-transform ${c.pagina}`}
              >
                <div className={`flex items-center justify-between gap-3 p-4 border-b shrink-0 ${c.cardBorda}`}>
                  <h2 className={`font-display text-lg font-semibold ${c.paginaTitulo}`}>Configuração</h2>
                  <button
                    type="button"
                    onClick={() => setSidebarAberta(false)}
                    aria-label="Fechar configuração"
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl font-medium transition-colors ${
                      isLight ? 'bg-slate-200 hover:bg-slate-300' : 'bg-slate-800/80 hover:bg-slate-700/80'
                    }`}
                  >
                    Fechar
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="p-4">
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
                        setSidebarAberta(false)
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
        </div>
      </div>
    </div>
  )
}
