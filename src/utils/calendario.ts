const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/** Retorna YYYY-MM-DD em data local (evita bug de fuso em comparações). */
export function dataParaKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

export function ehDiaUtil(data: Date, feriados: Set<string>): boolean {
  const d = data.getDay()
  if (d === 0 || d === 6) return false
  return !feriados.has(dataParaKey(data))
}

export function ehFeriado(data: Date, feriados: Set<string>): boolean {
  return feriados.has(dataParaKey(data))
}

export function ehFimDeSemana(data: Date): boolean {
  const d = data.getDay()
  return d === 0 || d === 6
}

export function cloneData(d: Date): Date {
  return new Date(d.getTime())
}

export function addDias(d: Date, dias: number): Date {
  const r = cloneData(d)
  r.setDate(r.getDate() + dias)
  return r
}

export function formatarDataCurta(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

export function getDiaSemana(data: Date): number {
  return data.getDay()
}

export { DIAS_SEMANA }
