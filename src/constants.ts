/** Anos disponíveis no seletor do planejador. */
export const ANOS_DISPONIVEIS = [2026, 2027] as const

/** Quantidade máxima de oportunidades exibidas na lista. */
export const LIMITE_OPORTUNIDADES = 15

/** Timeout em ms para a requisição da API de feriados (aborta após esse tempo). */
export const API_FERIADOS_TIMEOUT_MS = 8000

/** URL base da API de feriados (Brasil API). */
export const API_FERIADOS_BASE = 'https://brasilapi.com.br/api/feriados/v1'

/** Valor inicial de dias de férias no seletor. */
export const DIAS_FERIAS_INICIAL = 15

/** Opções de dias no seletor (presets). */
export const OPCOES_DIAS_FERIAS = [5, 10, 15, 20, 30] as const
