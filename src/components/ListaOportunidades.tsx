import { useCallback } from 'react'
import type { Oportunidade } from '@/types/oportunidade'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'
import { formatarDataCurta } from '@/utils/calendario'

const ID_LISTA = 'lista-oportunidades'
const idOpcao = (i: number) => `oportunidade-${i}`

interface ListaOportunidadesProps {
  ano: number
  oportunidades: Oportunidade[]
  diasDeFerias: number
  selecionada: number | null
  /** Índice ativo (hover ou seleção) para aria-activedescendant */
  indiceAtivo?: number | null
  onSelecionar: (indice: number | null) => void
  onHover?: (indice: number | null) => void
}

export function ListaOportunidades({
  ano,
  oportunidades,
  diasDeFerias,
  selecionada,
  indiceAtivo = null,
  onSelecionar,
  onHover,
}: ListaOportunidadesProps) {
  const { tema } = useTema()
  const isLight = tema === 'light'
  const c = classesTema(isLight)

  const indiceAtivoFinal = indiceAtivo ?? selecionada

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (oportunidades.length === 0) return
      const max = oportunidades.length - 1
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const proximo = indiceAtivoFinal === null ? 0 : Math.min(indiceAtivoFinal + 1, max)
        onHover?.(proximo)
        document.getElementById(idOpcao(proximo))?.scrollIntoView({ block: 'nearest' })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const anterior = indiceAtivoFinal === null ? max : Math.max(indiceAtivoFinal - 1, 0)
        onHover?.(anterior)
        document.getElementById(idOpcao(anterior))?.scrollIntoView({ block: 'nearest' })
      } else if (e.key === 'Enter' && indiceAtivoFinal !== null) {
        e.preventDefault()
        onSelecionar(selecionada === indiceAtivoFinal ? null : indiceAtivoFinal)
      }
    },
    [oportunidades.length, indiceAtivoFinal, selecionada, onSelecionar, onHover]
  )

  if (oportunidades.length === 0) {
    return (
      <div className={`px-4 py-10 text-center text-[13px] ${c.textoMuted}`}>
        Nenhuma oportunidade para {diasDeFerias} dias em {ano}.
      </div>
    )
  }

  return (
    <ul
      id={ID_LISTA}
      role="listbox"
      tabIndex={0}
      aria-label="Oportunidades de férias para combinar com feriados"
      aria-activedescendant={
        indiceAtivoFinal !== null ? idOpcao(indiceAtivoFinal) : undefined
      }
      className={`scroll-combine max-h-[480px] overflow-y-auto ${c.listaDivide}`}
      onKeyDown={onKeyDown}
    >
      {oportunidades.map((op, i) => (
        <li key={i} role="presentation">
          <button
            type="button"
            role="option"
            id={idOpcao(i)}
            aria-selected={selecionada === i}
            onClick={() => onSelecionar(selecionada === i ? null : i)}
            onMouseEnter={() => onHover?.(i)}
            onMouseLeave={() => onHover?.(null)}
            className={`w-full px-4 py-3.5 text-left transition-all duration-150 border-l-2 ${
              selecionada === i
                ? 'bg-emerald-500/10 border-emerald-500'
                : `${c.itemListaHover} border-transparent`
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className={`font-semibold text-[13px] tracking-tight ${c.itemListaTitulo}`}>
                  {formatarDataCurta(op.inicio)} — {formatarDataCurta(op.fim)}
                </div>
                <div className={`mt-1 text-[11px] ${c.itemListaSubtitulo}`}>
                  Agendar: <span className="text-emerald-600">{formatarDataCurta(op.inicioAgendamento)} – {formatarDataCurta(op.fimAgendamento)}</span>
                  {op.descricaoAgendamento && (
                    <span className="text-amber-600 ml-1">· {op.descricaoAgendamento}</span>
                  )}
                </div>
              </div>
              <div className={`shrink-0 rounded-lg px-2.5 py-1.5 text-center ${c.badgeNumero}`}>
                <span className={`text-base font-bold tabular-nums ${c.itemListaTitulo}`}>{op.totalDias}</span>
                <span className={`text-[10px] font-medium block leading-none ${c.textoMuted}`}>dias off</span>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${c.badge}`}>
                {op.diasUteis} úteis
              </span>
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${c.badge}`}>
                {op.finsDeSemana} fds
              </span>
              {op.feriados > 0 && (
                <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                  {op.feriados} feriados
                </span>
              )}
              {op.feriadosGastos > 0 && (
                <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
                  −{op.feriadosGastos} engolido{op.feriadosGastos > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
