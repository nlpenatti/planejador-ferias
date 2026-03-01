export interface Oportunidade {
  inicio: Date
  fim: Date
  inicioAgendamento: Date
  fimAgendamento: Date
  totalDias: number
  diasUteis: number
  finsDeSemana: number
  feriados: number
  feriadosGastos: number
  descricaoAgendamento: string
}
