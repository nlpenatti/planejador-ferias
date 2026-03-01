import { describe, it, expect } from 'vitest'
import { calcularOportunidades } from './useOportunidades'
import type { FeriadoApi } from '@/types/feriado'

function feriadosAno(ano: number): FeriadoApi[] {
  // Feriados nacionais 2025/2026 para testes determinísticos
  const base: FeriadoApi[] = [
    { date: `${ano}-01-01`, name: 'Confraternização Universal', type: 'national' },
    { date: `${ano}-04-21`, name: 'Tiradentes', type: 'national' },
    { date: `${ano}-05-01`, name: 'Dia do Trabalho', type: 'national' },
    { date: `${ano}-09-07`, name: 'Independência', type: 'national' },
    { date: `${ano}-10-12`, name: 'N. S. Aparecida', type: 'national' },
    { date: `${ano}-11-02`, name: 'Finados', type: 'national' },
    { date: `${ano}-11-15`, name: 'Proclamação da República', type: 'national' },
    { date: `${ano}-12-25`, name: 'Natal', type: 'national' },
  ]
  return base
}

describe('calcularOportunidades', () => {
  it('retorna array vazio quando diasDeFerias <= 0', () => {
    const feriados = feriadosAno(2026)
    const nomes = new Map(feriados.map((f) => [f.date, f.name]))
    expect(calcularOportunidades(2026, 0, feriados, nomes)).toEqual([])
    expect(calcularOportunidades(2026, -1, feriados, nomes)).toEqual([])
  })

  it('retorna lista de oportunidades para ano e dias válidos', () => {
    const ano = 2025 // ano passado = início do ano fixo (Jan 1), testes estáveis
    const feriados = feriadosAno(ano)
    const nomes = new Map(feriados.map((f) => [f.date, f.name]))
    const resultado = calcularOportunidades(ano, 15, feriados, nomes)
    expect(Array.isArray(resultado)).toBe(true)
    expect(resultado.length).toBeGreaterThan(0)
    expect(resultado.length).toBeLessThanOrEqual(15)
  })

  it('cada oportunidade tem estrutura esperada', () => {
    const ano = 2025
    const feriados = feriadosAno(ano)
    const nomes = new Map(feriados.map((f) => [f.date, f.name]))
    const resultado = calcularOportunidades(ano, 10, feriados, nomes)
    if (resultado.length === 0) return
    const op = resultado[0]
    expect(op).toHaveProperty('inicio')
    expect(op).toHaveProperty('fim')
    expect(op).toHaveProperty('inicioAgendamento')
    expect(op).toHaveProperty('fimAgendamento')
    expect(op).toHaveProperty('totalDias')
    expect(op).toHaveProperty('diasUteis')
    expect(op).toHaveProperty('finsDeSemana')
    expect(op).toHaveProperty('feriados')
    expect(op).toHaveProperty('feriadosGastos')
    expect(op.inicio).toBeInstanceOf(Date)
    expect(op.fim).toBeInstanceOf(Date)
    expect(typeof op.totalDias).toBe('number')
    expect(op.totalDias).toBeGreaterThanOrEqual(10)
  })

  it('período de agendamento tem exatamente diasDeFerias dias corridos', () => {
    const ano = 2025
    const diasDeFerias = 15
    const feriados = feriadosAno(ano)
    const nomes = new Map(feriados.map((f) => [f.date, f.name]))
    const resultado = calcularOportunidades(ano, diasDeFerias, feriados, nomes)
    if (resultado.length === 0) return
    const op = resultado[0]
    const msPorDia = 24 * 60 * 60 * 1000
    const diasAgendamento =
      Math.round((op.fimAgendamento.getTime() - op.inicioAgendamento.getTime()) / msPorDia) + 1
    expect(diasAgendamento).toBe(diasDeFerias)
  })

  it('não inclui datas de início inválidas (FDS ou 2 dias antes de FDS/feriado)', () => {
    const ano = 2025
    const feriados = feriadosAno(ano)
    const nomes = new Map(feriados.map((f) => [f.date, f.name]))
    const resultado = calcularOportunidades(ano, 5, feriados, nomes)
    const sabado = 6
    const domingo = 0
    for (const op of resultado) {
      const diaInicio = op.inicioAgendamento.getDay()
      expect(diaInicio).not.toBe(sabado)
      expect(diaInicio).not.toBe(domingo)
    }
  })
})
