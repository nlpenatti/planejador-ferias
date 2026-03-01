import { useCallback, useEffect, useState } from 'react'
import { buscarFeriados } from '@/api/feriados-api'
import { useOportunidades } from '@/hooks/useOportunidades'
import { ANOS_DISPONIVEIS, DIAS_FERIAS_INICIAL } from '@/constants'
import type { FeriadoApi } from '@/types/feriado'

export function usePlanejadorFerias() {
  const [ano, setAno] = useState<number>(ANOS_DISPONIVEIS[0])
  const [diasDeFerias, setDiasDeFerias] = useState(DIAS_FERIAS_INICIAL)
  const [diasCustomizado, setDiasCustomizado] = useState<number | null>(null)
  const [feriados, setFeriados] = useState<FeriadoApi[] | null>(null)
  const [erroFeriados, setErroFeriados] = useState<string | null>(null)
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = useState<number | null>(null)
  const [oportunidadeEmHover, setOportunidadeEmHover] = useState<number | null>(null)

  const diasEfetivos = diasCustomizado ?? diasDeFerias
  const oportunidades = useOportunidades(ano, diasEfetivos, feriados)
  const oportunidade =
    oportunidadeSelecionada !== null
      ? oportunidades[oportunidadeSelecionada] ?? null
      : null
  const oportunidadeHover =
    oportunidadeEmHover !== null ? oportunidades[oportunidadeEmHover] ?? null : null

  const recarregarFeriados = useCallback(() => {
    setErroFeriados(null)
    setFeriados(null)
    const controller = new AbortController()
    buscarFeriados(ano, controller.signal)
      .then(setFeriados)
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setErroFeriados(err?.message === 'The user aborted a request.' ? 'Requisição cancelada.' : 'Não foi possível carregar os feriados.')
      })
    return () => controller.abort()
  }, [ano])

  useEffect(() => {
    setErroFeriados(null)
    setFeriados(null)
    const controller = new AbortController()
    buscarFeriados(ano, controller.signal)
      .then(setFeriados)
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setErroFeriados(err?.message === 'The user aborted a request.' ? 'Requisição cancelada.' : 'Não foi possível carregar os feriados.')
      })
    return () => controller.abort()
  }, [ano])

  function limparSelecao() {
    setOportunidadeSelecionada(null)
    setOportunidadeEmHover(null)
  }

  const temSelecao = oportunidadeSelecionada !== null

  return {
    ano,
    setAno,
    diasDeFerias,
    setDiasDeFerias,
    diasCustomizado,
    setDiasCustomizado,
    diasEfetivos,
    feriados,
    erroFeriados,
    oportunidades,
    oportunidadeSelecionada,
    setOportunidadeSelecionada,
    oportunidadeEmHover,
    setOportunidadeEmHover,
    oportunidade,
    oportunidadeHover,
    limparSelecao,
    temSelecao,
    recarregarFeriados,
  }
}
