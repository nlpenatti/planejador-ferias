/**
 * Classes CSS por tema (light/dark) para evitar repetição de isLight ? '...' : '...'
 */
export function classesTema(isLight: boolean) {
  return {
    pagina: isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#0a0a0f] text-slate-400',
    paginaTitulo: isLight ? 'text-slate-900' : 'text-white',
    paginaSubtitulo: isLight ? 'text-slate-600 text-[13px] mt-0.5' : 'text-slate-500 text-[13px] mt-0.5',
    headerBlur: isLight ? 'bg-emerald-500/10' : 'bg-emerald-500/[0.04]',
    card: isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800/50 bg-slate-900/30',
    cardBorda: isLight ? 'border-slate-200' : 'border-slate-800/50',
    label: isLight ? 'text-slate-600' : 'text-slate-400',
    tituloCard: 'text-slate-500',
    grupoBotoes: isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-700/80 bg-slate-800/50',
    botaoSecundario: isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-500 hover:text-slate-300',
    input: isLight ? 'border-slate-200 bg-white text-slate-900 placeholder-slate-400' : 'border-slate-700/80 bg-slate-800/50 text-white placeholder-slate-500',
    legenda: isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/20 border-slate-800/40',
    erro: isLight ? 'text-red-600' : 'text-red-400/80',
    spinner: isLight ? 'border-slate-200 border-t-emerald-500' : 'border-slate-700 border-t-emerald-500',
    textoMuted: 'text-slate-500',
    listaDivide: isLight ? 'divide-y divide-slate-200' : 'divide-y divide-slate-800/40',
    itemListaTitulo: isLight ? 'text-slate-900' : 'text-white',
    itemListaSubtitulo: isLight ? 'text-slate-600' : 'text-slate-400',
    itemListaHover: isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/30',
    badge: isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/60 text-slate-400',
    badgeNumero: isLight ? 'bg-slate-100' : 'bg-slate-800/60',
    calendarioMes: isLight ? 'text-slate-800' : 'text-white',
    calendarioDiaSemana: isLight ? 'text-slate-500' : 'text-slate-600',
    calendarioForaMes: isLight ? 'text-slate-300' : 'text-slate-800/40',
    calendarioFeriado: isLight ? 'text-amber-600 font-medium' : 'text-amber-500 font-medium',
    calendarioNormal: isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-500 hover:text-slate-300',
    calendarioFeriadoDentro: isLight ? 'border border-white' : 'border border-[#020617]',
    calendarioFeriadoLista: 'text-slate-600 truncate',
  }
}
