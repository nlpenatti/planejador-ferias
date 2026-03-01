import { useMemo } from 'react'
import type { FeriadoApi } from '@/types/feriado'
import { LIMITE_OPORTUNIDADES } from '@/constants'
import type { Oportunidade } from '@/types/oportunidade'
import {
  addDias,
  cloneData,
  dataParaKey,
  ehFeriado,
  ehFimDeSemana,
} from '@/utils/calendario'

function feriadosParaSet(feriados: FeriadoApi[]): Set<string> {
  const set = new Set<string>()
  feriados.forEach((f) => set.add(f.date))
  return set
}

function contarNoPeriodo(
  inicio: Date,
  fim: Date,
  feriadosSet: Set<string>,
): { diasUteis: number; finsDeSemana: number; feriados: number } {
  let diasUteis = 0
  let finsDeSemana = 0
  let feriados = 0
  let d = cloneData(inicio)
  while (d <= fim) {
    if (ehFeriado(d, feriadosSet)) feriados++
    else if (ehFimDeSemana(d)) finsDeSemana++
    else diasUteis++
    d = addDias(d, 1)
  }
  return { diasUteis, finsDeSemana, feriados }
}

/** Estende o período para incluir fins de semana e feriados adjacentes (emenda). */
function estenderPeriodo(
  inicio: Date,
  fim: Date,
  feriadosSet: Set<string>,
): { inicioCompleto: Date; fimCompleto: Date } {
  let inicioCompleto = cloneData(inicio)
  let fimCompleto = cloneData(fim)
  // Estende para trás
  while (true) {
    const anterior = addDias(inicioCompleto, -1)
    if (ehFimDeSemana(anterior) || ehFeriado(anterior, feriadosSet)) {
      inicioCompleto = anterior
    } else break
  }
  // Estende para frente
  while (true) {
    const proximo = addDias(fimCompleto, 1)
    if (ehFimDeSemana(proximo) || ehFeriado(proximo, feriadosSet)) {
      fimCompleto = proximo
    } else break
  }
  return { inicioCompleto, fimCompleto }
}

function diasEntreInclusivo(inicio: Date, fim: Date): number {
  return Math.round((fim.getTime() - inicio.getTime()) / (24 * 60 * 60 * 1000)) + 1
}

function dataNoIntervalo(data: Date, inicio: Date, fim: Date): boolean {
  return data.getTime() >= inicio.getTime() && data.getTime() <= fim.getTime()
}

function proporcaoSobreposicao(a: Oportunidade, b: Oportunidade): number {
  const inicioInter = Math.max(a.inicio.getTime(), b.inicio.getTime())
  const fimInter = Math.min(a.fim.getTime(), b.fim.getTime())
  if (fimInter < inicioInter) return 0
  const diasInter = Math.round((fimInter - inicioInter) / (24 * 60 * 60 * 1000)) + 1
  const menorBloco = Math.min(diasEntreInclusivo(a.inicio, a.fim), diasEntreInclusivo(b.inicio, b.fim))
  return diasInter / menorBloco
}

function pontuarOportunidade(
  oportunidade: Oportunidade,
  diasDeFerias: number,
  feriadosEmendados: number,
  fdsEmendados: number,
): number {
  const emendasTotais = Math.max(0, oportunidade.totalDias - diasDeFerias)
  const feriadosEngolidos = oportunidade.feriadosGastos
  const fdsEngolidos = Math.max(0, oportunidade.finsDeSemana - fdsEmendados)

  return (
    emendasTotais * 10 +
    feriadosEmendados * 14 +
    fdsEmendados * 4 -
    feriadosEngolidos * 18 -
    fdsEngolidos * 3
  )
}

/**
 * Emendas inteligentes:
 * 1. Férias são dias CORRIDOS (padrão CLT).
 * 2. Regra CLT: Não pode começar 2 dias antes de feriado ou FDS (Art. 134).
 */
export function calcularOportunidades(
  ano: number,
  diasDeFerias: number,
  feriados: FeriadoApi[],
  nomesFeriados: Map<string, string>,
): Oportunidade[] {
  if (diasDeFerias <= 0) return []
  const feriadosSet = feriadosParaSet(feriados)
  const inicioAno = new Date()
  const inicioBusca = inicioAno.getFullYear() === ano ? inicioAno : new Date(ano, 0, 1)
  const fimAno = new Date(ano, 11, 31)
  const oportunidadesAvaliadas: Array<{
    oportunidade: Oportunidade
    pontuacao: number
  }> = []

  // Percorre a partir da data atual (se for o ano selecionado) ou do início do ano
  let dataAtual = cloneData(inicioBusca)
  while (dataAtual <= fimAno) {
    // Regra CLT: Não pode começar no FDS ou feriado
    // E não pode começar 2 dias antes (ex: se sexta é feriado, não pode começar qua/qui)
    const ehFdsOuFeriado = ehFimDeSemana(dataAtual) || ehFeriado(dataAtual, feriadosSet)
    
    let podeComecar = !ehFdsOuFeriado
    if (podeComecar) {
      const d1 = addDias(dataAtual, 1)
      const d2 = addDias(dataAtual, 2)
      if (ehFeriado(d1, feriadosSet) || ehFimDeSemana(d1) || ehFeriado(d2, feriadosSet) || ehFimDeSemana(d2)) {
        podeComecar = false
      }
    }

    if (podeComecar) {
      const inicioAgendamento = cloneData(dataAtual)
      const fimAgendamento = addDias(inicioAgendamento, diasDeFerias - 1)

      if (fimAgendamento <= fimAno) {
        const { inicioCompleto, fimCompleto } = estenderPeriodo(
          inicioAgendamento,
          fimAgendamento,
          feriadosSet,
        )

        const totalDiasRest = diasEntreInclusivo(inicioCompleto, fimCompleto)
        
        // Contagem interna (apenas para exibição)
        const contagem = contarNoPeriodo(inicioAgendamento, fimAgendamento, feriadosSet)
        const contagemCompleta = contarNoPeriodo(inicioCompleto, fimCompleto, feriadosSet)
        const feriadosEmendados = Math.max(0, contagemCompleta.feriados - contagem.feriados)
        const fdsEmendados = Math.max(0, contagemCompleta.finsDeSemana - contagem.finsDeSemana)

        const partesFeriado: string[] = []
        let d = cloneData(inicioCompleto)
        while (d <= fimCompleto) {
          const estaNoAgendamento = dataNoIntervalo(d, inicioAgendamento, fimAgendamento)
          if (ehFeriado(d, feriadosSet) && !estaNoAgendamento) {
            partesFeriado.push(nomesFeriados.get(dataParaKey(d)) || 'Feriado')
          }
          d = addDias(d, 1)
        }

        const oportunidade: Oportunidade = {
          inicio: inicioCompleto,
          fim: fimCompleto,
          inicioAgendamento,
          fimAgendamento,
          totalDias: totalDiasRest,
          diasUteis: contagem.diasUteis,
          finsDeSemana: contagemCompleta.finsDeSemana,
          feriados: contagemCompleta.feriados,
          feriadosGastos: contagem.feriados,
          descricaoAgendamento: Array.from(new Set(partesFeriado)).slice(0, 2).join(' + '),
        }

        const pontuacao = pontuarOportunidade(
          oportunidade,
          diasDeFerias,
          feriadosEmendados,
          fdsEmendados,
        )
        oportunidadesAvaliadas.push({ oportunidade, pontuacao })
      }
    }
    dataAtual = addDias(dataAtual, 1)
  }

  // Remove duplicatas e evita sugestões quase iguais para melhorar diversidade.
  const filtradas: Oportunidade[] = []
  const vistos = new Set<string>()
  
  oportunidadesAvaliadas.sort((a, b) => {
    if (b.pontuacao !== a.pontuacao) return b.pontuacao - a.pontuacao
    if (b.oportunidade.totalDias !== a.oportunidade.totalDias) {
      return b.oportunidade.totalDias - a.oportunidade.totalDias
    }
    return a.oportunidade.inicio.getTime() - b.oportunidade.inicio.getTime()
  })

  for (const { oportunidade: op } of oportunidadesAvaliadas) {
    const key = `${dataParaKey(op.inicio)}_${dataParaKey(op.fim)}`
    const muitoParecida = filtradas.some((existente) => proporcaoSobreposicao(existente, op) >= 0.9)
    if (!vistos.has(key) && !muitoParecida) {
      filtradas.push(op)
      vistos.add(key)
    }
    if (filtradas.length >= LIMITE_OPORTUNIDADES) break
  }

  return filtradas
}

export function useOportunidades(
  ano: number,
  diasDeFerias: number,
  feriados: FeriadoApi[] | null,
): Oportunidade[] {
  return useMemo(() => {
    if (!feriados?.length || diasDeFerias <= 0) return []
    const nomes = new Map<string, string>()
    feriados.forEach((f) => nomes.set(f.date, f.name))
    return calcularOportunidades(ano, diasDeFerias, feriados, nomes)
  }, [ano, diasDeFerias, feriados])
}
