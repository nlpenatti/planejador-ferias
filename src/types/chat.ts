/** Etapa do fluxo do chatbot (máquina de estados). */
export type StepChat =
  | 'ano'
  | 'dias'
  | 'mes_ou_todos'
  | 'resultado'

/** Mensagem exibida no chat. */
export interface MensagemChat {
  id: string
  tipo: 'bot' | 'usuario'
  texto: string
  /** Botões de resposta rápida (apenas em mensagens do bot). */
  quickReplies?: string[]
  /** Dados extras para ações (ex.: índice da oportunidade em "Ver no calendário"). */
  payload?: Record<string, unknown>
}

/** Estado interno do fluxo do chat (valores já escolhidos pelo usuário). */
export interface EstadoFluxoChat {
  step: StepChat
  anoEscolhido: number | null
  diasEscolhidos: number | null
  /** 0-11 para Janeiro-Dezembro; null = todos os meses. */
  mesEscolhido: number | null
}
