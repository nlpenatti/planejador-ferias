import type { Oportunidade } from '@/types/oportunidade'
import { formatarDataCurta } from '@/utils/calendario'

/**
 * Formata uma oportunidade para exibição em texto (chat, card).
 * Ex.: "12 jan – 20 jan · 18 dias off · 7 úteis, 4 fds, 2 feriados"
 */
export function formatarOportunidadeTexto(op: Oportunidade): string {
  const periodo = `${formatarDataCurta(op.inicio)} – ${formatarDataCurta(op.fim)}`
  const diasOff = `${op.totalDias} dias off`
  const partes: string[] = [periodo, diasOff]
  const detalhes: string[] = []
  if (op.diasUteis > 0) detalhes.push(`${op.diasUteis} úteis`)
  if (op.finsDeSemana > 0) detalhes.push(`${op.finsDeSemana} fds`)
  if (op.feriados > 0) detalhes.push(`${op.feriados} feriados`)
  if (op.feriadosGastos > 0) detalhes.push(`−${op.feriadosGastos} engolido${op.feriadosGastos > 1 ? 's' : ''}`)
  if (detalhes.length > 0) partes.push(detalhes.join(', '))
  return partes.join(' · ')
}

/**
 * Retorna linha curta: período + dias off (para título de card).
 */
export function formatarOportunidadeTitulo(op: Oportunidade): string {
  return `${formatarDataCurta(op.inicio)} – ${formatarDataCurta(op.fim)} · ${op.totalDias} dias off`
}
