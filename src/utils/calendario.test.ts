import { describe, it, expect } from 'vitest'
import {
  dataParaKey,
  ehDiaUtil,
  ehFeriado,
  ehFimDeSemana,
  cloneData,
  addDias,
  formatarDataCurta,
  getDiaSemana,
} from './calendario'

describe('calendario', () => {
  describe('dataParaKey', () => {
    it('formata data como YYYY-MM-DD', () => {
      expect(dataParaKey(new Date(2026, 0, 1))).toBe('2026-01-01')
      expect(dataParaKey(new Date(2026, 11, 31))).toBe('2026-12-31')
      expect(dataParaKey(new Date(2025, 5, 15))).toBe('2025-06-15')
    })

    it('preenche mês e dia com zero à esquerda', () => {
      expect(dataParaKey(new Date(2026, 0, 5))).toBe('2026-01-05')
      expect(dataParaKey(new Date(2026, 8, 9))).toBe('2026-09-09')
    })
  })

  describe('ehFimDeSemana', () => {
    it('retorna true para sábado (6) e domingo (0)', () => {
      // 3 jan 2026 = sábado
      expect(ehFimDeSemana(new Date(2026, 0, 3))).toBe(true)
      // 4 jan 2026 = domingo
      expect(ehFimDeSemana(new Date(2026, 0, 4))).toBe(true)
    })

    it('retorna false para dias úteis', () => {
      // 5 jan 2026 = segunda
      expect(ehFimDeSemana(new Date(2026, 0, 5))).toBe(false)
      expect(ehFimDeSemana(new Date(2026, 0, 6))).toBe(false)
    })
  })

  describe('ehFeriado', () => {
    it('retorna true quando a data está no set', () => {
      const feriados = new Set(['2026-01-01', '2026-12-25'])
      expect(ehFeriado(new Date(2026, 0, 1), feriados)).toBe(true)
      expect(ehFeriado(new Date(2026, 11, 25), feriados)).toBe(true)
    })

    it('retorna false quando a data não está no set', () => {
      const feriados = new Set(['2026-01-01'])
      expect(ehFeriado(new Date(2026, 0, 2), feriados)).toBe(false)
    })
  })

  describe('ehDiaUtil', () => {
    it('retorna false para fim de semana', () => {
      const feriados = new Set<string>()
      expect(ehDiaUtil(new Date(2026, 0, 3), feriados)).toBe(false) // sábado
      expect(ehDiaUtil(new Date(2026, 0, 4), feriados)).toBe(false) // domingo
    })

    it('retorna false para feriado mesmo em dia de semana', () => {
      const feriados = new Set(['2026-01-05']) // segunda
      expect(ehDiaUtil(new Date(2026, 0, 5), feriados)).toBe(false)
    })

    it('retorna true para dia de semana não feriado', () => {
      const feriados = new Set<string>()
      expect(ehDiaUtil(new Date(2026, 0, 5), feriados)).toBe(true)
    })
  })

  describe('cloneData', () => {
    it('retorna nova instância com mesmo tempo', () => {
      const d = new Date(2026, 0, 15)
      const c = cloneData(d)
      expect(c.getTime()).toBe(d.getTime())
      expect(c).not.toBe(d)
    })
  })

  describe('addDias', () => {
    it('avança N dias', () => {
      const d = new Date(2026, 0, 10)
      expect(dataParaKey(addDias(d, 1))).toBe('2026-01-11')
      expect(dataParaKey(addDias(d, 5))).toBe('2026-01-15')
    })

    it('retrocede com N negativo', () => {
      const d = new Date(2026, 0, 10)
      expect(dataParaKey(addDias(d, -1))).toBe('2026-01-09')
      expect(dataParaKey(addDias(d, -10))).toBe('2025-12-31')
    })

    it('não altera a data original', () => {
      const d = new Date(2026, 0, 10)
      addDias(d, 5)
      expect(dataParaKey(d)).toBe('2026-01-10')
    })
  })

  describe('formatarDataCurta', () => {
    it('retorna dia e mês abreviado em pt-BR', () => {
      const d = new Date(2026, 0, 1)
      expect(formatarDataCurta(d)).toMatch(/1.*jan/i)
    })
  })

  describe('getDiaSemana', () => {
    it('retorna 0-6 (dom-sáb)', () => {
      // 4 jan 2026 = domingo
      expect(getDiaSemana(new Date(2026, 0, 4))).toBe(0)
      // 5 jan 2026 = segunda
      expect(getDiaSemana(new Date(2026, 0, 5))).toBe(1)
    })
  })
})
