import type { FeriadoApi } from '@/types/feriado'
import { API_FERIADOS_BASE, API_FERIADOS_TIMEOUT_MS } from '@/constants'

const cachePorAno = new Map<number, FeriadoApi[]>()

/**
 * Cria um AbortSignal que cancela após o timeout configurado.
 * O signal externo (ex.: do useEffect) também é respeitado.
 */
function signalComTimeout(
  timeoutMs: number,
  signalExterno?: AbortSignal
): { signal: AbortSignal; abort: () => void } {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  if (signalExterno?.aborted) {
    clearTimeout(id)
    controller.abort()
    return { signal: controller.signal, abort: () => {} }
  }
  signalExterno?.addEventListener('abort', () => {
    clearTimeout(id)
    controller.abort()
  })

  return {
    signal: controller.signal,
    abort: () => {
      clearTimeout(id)
      controller.abort()
    },
  }
}

export async function buscarFeriados(
  ano: number,
  signal?: AbortSignal
): Promise<FeriadoApi[]> {
  const cached = cachePorAno.get(ano)
  if (cached) return cached

  const { signal: signalCompleto } = signalComTimeout(
    API_FERIADOS_TIMEOUT_MS,
    signal
  )

  const res = await fetch(`${API_FERIADOS_BASE}/${ano}`, {
    signal: signalCompleto,
  })
  if (!res.ok) throw new Error('Falha ao buscar feriados')
  const dados: FeriadoApi[] = await res.json()
  cachePorAno.set(ano, dados)
  return dados
}
