import { useCallback, useEffect, useRef, useState } from 'react'
import type { Oportunidade } from '@/types/oportunidade'
import type { FeriadoApi } from '@/types/feriado'
import type { MensagemChat, EstadoFluxoChat, StepChat } from '@/types/chat'
import { ANOS_DISPONIVEIS, OPCOES_DIAS_FERIAS } from '@/constants'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'
import { formatarDataCurta } from '@/utils/calendario'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Abreviação para os botões de mês (economiza espaço). */
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function gerarId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function mensagemInicial(): MensagemChat {
  return {
    id: gerarId(),
    tipo: 'bot',
    texto: 'Olá! Para achar as melhores férias, me diga o ano.',
    quickReplies: ANOS_DISPONIVEIS.map(String),
  }
}

function estadoInicial(): EstadoFluxoChat {
  return {
    step: 'ano',
    anoEscolhido: null,
    diasEscolhidos: null,
    mesEscolhido: null,
  }
}

/** Filtra oportunidades que intersectam o mês (0-11). */
function filtrarPorMes(oportunidades: Oportunidade[], mes: number | null): Oportunidade[] {
  if (mes === null) return [...oportunidades]
  return oportunidades.filter(
    (op) => op.inicio.getMonth() <= mes && op.fim.getMonth() >= mes
  )
}

export interface ChatbotPlanejadorProps {
  ano: number
  setAno: (ano: number) => void
  diasDeFerias: number
  setDiasDeFerias: (dias: number) => void
  diasCustomizado: number | null
  setDiasCustomizado: (valor: number | null) => void
  oportunidades: Oportunidade[]
  setOportunidadeSelecionada: (indice: number | null) => void
  feriados: FeriadoApi[] | null
  /** Chamado ao clicar em "Ver no calendário" (fechar chat, scroll, etc.). */
  onVerCalendario?: () => void
}

export function ChatbotPlanejador({
  ano: _ano,
  setAno,
  diasDeFerias,
  setDiasDeFerias,
  diasCustomizado,
  setDiasCustomizado,
  oportunidades,
  setOportunidadeSelecionada,
  feriados: _feriados,
  onVerCalendario,
}: ChatbotPlanejadorProps) {
  const diasASolicitar = diasCustomizado ?? diasDeFerias
  const { tema } = useTema()
  const isLight = tema === 'light'
  const c = classesTema(isLight)
  const [mensagens, setMensagens] = useState<MensagemChat[]>(() => [mensagemInicial()])
  const [estadoFluxo, setEstadoFluxo] = useState<EstadoFluxoChat>(estadoInicial)
  const [valorOutroDias, setValorOutroDias] = useState<string>('')
  const listaRef = useRef<HTMLDivElement>(null)
  const inputOutroRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensagens])

  const adicionarMensagens = useCallback((usuario: MensagemChat, bot: MensagemChat | null) => {
    setMensagens((prev) => {
      const next = [...prev, usuario]
      if (bot) next.push(bot)
      return next
    })
  }, [])

  const processarAno = useCallback(
    (valor: string) => {
      const num = parseInt(valor, 10)
      if (!ANOS_DISPONIVEIS.includes(num as 2026 | 2027)) return
      const usuario: MensagemChat = { id: gerarId(), tipo: 'usuario', texto: String(num) }
      setAno(num)
      setEstadoFluxo((e) => ({ ...e, step: 'dias', anoEscolhido: num }))
      const bot: MensagemChat = {
        id: gerarId(),
        tipo: 'bot',
        texto: 'Quantos dias de férias você tem (CLT)?',
        quickReplies: [...OPCOES_DIAS_FERIAS.map(String), 'Outro'],
      }
      adicionarMensagens(usuario, bot)
    },
    [setAno, adicionarMensagens]
  )

  const processarDias = useCallback(
    (valor: string) => {
      if (valor === 'Outro') {
        const num = parseInt(valorOutroDias, 10)
        if (num >= 1 && num <= 30) {
          const usuario: MensagemChat = { id: gerarId(), tipo: 'usuario', texto: `${num} dias` }
          setDiasDeFerias(num)
          setDiasCustomizado(num)
          setValorOutroDias('')
          setEstadoFluxo((e) => ({ ...e, step: 'mes_ou_todos', diasEscolhidos: num }))
          const bot: MensagemChat = {
            id: gerarId(),
            tipo: 'bot',
            texto: 'Quer ver um mês específico ou todas as opções do ano?',
            quickReplies: ['Ver todos os meses', ...MESES],
          }
          adicionarMensagens(usuario, bot)
        }
        return
      }
      const num = parseInt(valor, 10)
      if (!OPCOES_DIAS_FERIAS.includes(num as 5 | 10 | 15 | 20 | 30)) return
      const usuario: MensagemChat = { id: gerarId(), tipo: 'usuario', texto: `${valor} dias` }
      setDiasDeFerias(num)
      setDiasCustomizado(null)
      setEstadoFluxo((e) => ({ ...e, step: 'mes_ou_todos', diasEscolhidos: num }))
      const bot: MensagemChat = {
        id: gerarId(),
        tipo: 'bot',
        texto: 'Quer ver um mês específico ou todas as opções do ano?',
        quickReplies: ['Ver todos os meses', ...MESES],
      }
      adicionarMensagens(usuario, bot)
    },
    [
      valorOutroDias,
      setDiasDeFerias,
      setDiasCustomizado,
      adicionarMensagens,
    ]
  )

  const processarMesOuTodos = useCallback(
    (valor: string) => {
      const mesIndex = MESES.indexOf(valor)
      const mesEscolhido = valor === 'Ver todos os meses' ? null : (mesIndex >= 0 ? mesIndex : null)
      if (valor !== 'Ver todos os meses' && mesIndex < 0) return
      const usuario: MensagemChat = {
        id: gerarId(),
        tipo: 'usuario',
        texto: valor === 'Ver todos os meses' ? valor : MESES[mesIndex],
      }
      setEstadoFluxo((e) => ({ ...e, step: 'resultado', mesEscolhido }))
      const filtradas = filtrarPorMes(oportunidades, mesEscolhido)
      const indices = filtradas.map((op) => oportunidades.indexOf(op))
      const dias = diasCustomizado ?? diasDeFerias
      const textoResultado =
        filtradas.length === 0
          ? 'Não encontrei oportunidades para esse mês com os critérios escolhidos. Tente outro mês ou "Ver todos os meses".'
          : `Encontrei ${filtradas.length} opção(ões). Em todas você solicita ${dias} dias de férias; em cada card veja o período e quantos dias off você ganha.`
      const bot: MensagemChat = {
        id: gerarId(),
        tipo: 'bot',
        texto: textoResultado,
        payload: filtradas.length > 0 ? { tipo: 'listaOportunidades', indices } : undefined,
      }
      adicionarMensagens(usuario, bot)
    },
    [oportunidades, adicionarMensagens, diasDeFerias, diasCustomizado]
  )

  const handleQuickReply = useCallback(
    (valor: string) => {
      if (estadoFluxo.step === 'ano') processarAno(valor)
      else if (estadoFluxo.step === 'dias') processarDias(valor)
      else if (estadoFluxo.step === 'mes_ou_todos') processarMesOuTodos(valor)
    },
    [estadoFluxo.step, processarAno, processarDias, processarMesOuTodos]
  )

  const handleVerCalendario = useCallback(
    (indice: number) => {
      setOportunidadeSelecionada(indice)
      onVerCalendario?.()
    },
    [setOportunidadeSelecionada, onVerCalendario]
  )

  const stepAtual: StepChat = estadoFluxo.step
  const mostraInputOutro = stepAtual === 'dias'
  const ultimaMensagem = mensagens[mensagens.length - 1]
  const opcoesAtuais = ultimaMensagem?.tipo === 'bot' ? ultimaMensagem.quickReplies : null

  /** Label exibido para cada valor de quick reply (melhora UX). */
  const labelOpcao = (valor: string): string => {
    if (stepAtual === 'dias') return valor === 'Outro' ? 'Outro' : `${valor} dias`
    if (stepAtual === 'mes_ou_todos' && valor !== 'Ver todos os meses') {
      const idx = MESES.indexOf(valor)
      return idx >= 0 ? MESES_ABREV[idx] : valor
    }
    return valor
  }

  /** Chips suaves, integrados à bolha (sem borda forte, estilo conversacional). */
  const classeChip = isLight
    ? 'bg-black/[0.06] text-slate-700 hover:bg-black/[0.1]'
    : 'bg-white/[0.08] text-slate-200 hover:bg-white/[0.12]'

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={listaRef}
        className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3"
        role="log"
        aria-label="Conversa do assistente"
      >
        {mensagens.map((msg) => {
          const ehUltimaComOpcoes =
            msg.id === ultimaMensagem?.id &&
            msg.tipo === 'bot' &&
            opcoesAtuais &&
            stepAtual !== 'resultado'
          return (
            <div
              key={msg.id}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.tipo === 'usuario'
                    ? isLight
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-500/80 text-white'
                    : isLight
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-slate-800/80 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.texto}</p>

                {/* Opções dentro da bolha do bot (quick replies) */}
                {ehUltimaComOpcoes && (
                  <div className="mt-3 pt-3 border-t border-current/10">
                    {stepAtual === 'ano' && (
                      <div className="flex flex-wrap gap-2">
                        {opcoesAtuais.map((opcao) => (
                          <button
                            key={opcao}
                            type="button"
                            onClick={() => handleQuickReply(opcao)}
                            className={`min-h-[36px] px-4 rounded-full text-sm font-medium transition-colors ${classeChip}`}
                          >
                            {opcao}
                          </button>
                        ))}
                      </div>
                    )}
                    {stepAtual === 'dias' && (
                      <div className="flex flex-wrap gap-2">
                        {opcoesAtuais.filter((o) => o !== 'Outro').map((opcao) => (
                          <button
                            key={opcao}
                            type="button"
                            onClick={() => handleQuickReply(opcao)}
                            className={`min-h-[36px] px-4 rounded-full text-sm font-medium transition-colors ${classeChip}`}
                          >
                            {labelOpcao(opcao)}
                          </button>
                        ))}
                      </div>
                    )}
                    {stepAtual === 'mes_ou_todos' && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleQuickReply('Ver todos os meses')}
                          className={`w-full min-h-[36px] px-4 rounded-full text-sm font-medium transition-colors ${classeChip}`}
                        >
                          Ver todos os meses
                        </button>
                        <div className="grid grid-cols-4 gap-1.5">
                          {opcoesAtuais
                            .filter((o) => o !== 'Ver todos os meses')
                            .map((opcao) => (
                              <button
                                key={opcao}
                                type="button"
                                onClick={() => handleQuickReply(opcao)}
                                className={`min-h-[32px] px-2 rounded-full text-xs font-medium transition-colors ${classeChip}`}
                              >
                                {labelOpcao(opcao)}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {msg.tipo === 'bot' && msg.payload?.tipo === 'listaOportunidades' && Array.isArray(msg.payload.indices) && (
                  <div className="mt-3 space-y-3">
                    {[...(msg.payload.indices as number[])]
                      .sort((a, b) => (oportunidades[b]?.totalDias ?? 0) - (oportunidades[a]?.totalDias ?? 0))
                      .map((indice) => {
                      const op = oportunidades[indice]
                      if (!op) return null
                      return (
                        <div
                          key={indice}
                          className={`rounded-2xl border overflow-hidden text-left ${c.card}`}
                        >
                          <div className="p-4 sm:p-3">
                            <div className="flex flex-col gap-3 sm:gap-2">
                              <div>
                                <p className={`text-[10px] sm:text-[11px] uppercase tracking-wider ${c.textoMuted}`}>
                                  Agendar
                                </p>
                                <p className={`text-[13px] sm:text-[12px] font-medium leading-snug ${c.itemListaTitulo}`}>
                                  {formatarDataCurta(op.inicioAgendamento)} a {formatarDataCurta(op.fimAgendamento)}
                                </p>
                                {op.descricaoAgendamento && (
                                  <p className="text-[12px] sm:text-[11px] text-amber-600 mt-0.5">{op.descricaoAgendamento}</p>
                                )}
                              </div>
                              <div className={`flex items-center justify-between gap-2 flex-wrap ${c.cardBorda} border-t pt-3 sm:pt-2`}>
                                <div>
                                  <p className={`text-[10px] sm:text-[11px] uppercase tracking-wider ${c.textoMuted}`}>
                                    Total de férias
                                  </p>
                                  <p className={`text-[13px] sm:text-[12px] font-medium ${c.itemListaSubtitulo}`}>
                                    {formatarDataCurta(op.inicio)} a {formatarDataCurta(op.fim)}
                                  </p>
                                </div>
                                <div className={`rounded-xl px-3 py-1.5 text-center shrink-0 ${c.badgeNumero}`}>
                                  <span className={`text-lg sm:text-base font-bold tabular-nums ${c.itemListaTitulo}`}>{op.totalDias}</span>
                                  <span className={`text-[10px] sm:text-[11px] font-medium block leading-none ${c.textoMuted}`}>dias off</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className={`rounded-lg px-2.5 py-1 text-[12px] sm:text-[11px] font-medium ${c.badge}`}>
                                  {op.diasUteis} úteis
                                </span>
                                <span className={`rounded-lg px-2.5 py-1 text-[12px] sm:text-[11px] font-medium ${c.badge}`}>
                                  {op.finsDeSemana} fds
                                </span>
                                {op.feriados > 0 && (
                                  <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-[12px] sm:text-[11px] font-medium text-amber-600">
                                    {op.feriados} feriados
                                  </span>
                                )}
                                {op.feriadosGastos > 0 && (
                                  <span className="rounded-lg bg-red-500/10 px-2.5 py-1 text-[12px] sm:text-[11px] font-medium text-red-600">
                                    −{op.feriadosGastos} engolido{op.feriadosGastos > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleVerCalendario(indice)}
                            className={`w-full min-h-[48px] sm:min-h-0 py-3 sm:py-2.5 px-4 rounded-b-2xl sm:rounded-b-xl text-sm font-semibold transition-colors active:scale-[0.99] ${
                              isLight
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-emerald-500/90 text-white hover:bg-emerald-500'
                            }`}
                          >
                            Ver no calendário
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Só o campo "Outro" para dias fica embaixo */}
      {mostraInputOutro && (
        <div className={`shrink-0 p-4 pt-0 border-t ${c.cardBorda}`}>
          <div className={`rounded-xl border p-3 ${c.card}`}>
            <label htmlFor="chat-outro-dias" className={`block text-xs font-medium mb-2 ${c.label}`}>
              Outro número de dias (1 a 30)
            </label>
            <div className="flex gap-2">
              <input
                id="chat-outro-dias"
                ref={inputOutroRef}
                type="number"
                min={1}
                max={30}
                placeholder="Ex: 12"
                value={valorOutroDias}
                onChange={(e) => setValorOutroDias(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') processarDias('Outro')
                }}
                className={`flex-1 min-w-0 rounded-lg border px-3 py-2.5 text-sm ${c.input}`}
                aria-label="Quantidade de dias (1 a 30)"
              />
              <button
                type="button"
                onClick={() => processarDias('Outro')}
                disabled={!valorOutroDias || parseInt(valorOutroDias, 10) < 1 || parseInt(valorOutroDias, 10) > 30}
                className={`shrink-0 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isLight
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50'
                    : 'bg-emerald-500/80 text-white hover:bg-emerald-500 disabled:opacity-50'
                }`}
              >
                Usar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
