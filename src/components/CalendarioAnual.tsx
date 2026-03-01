import type { FeriadoApi } from '@/types/feriado'
import type { Oportunidade } from '@/types/oportunidade'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'
import { addDias, dataParaKey, ehFeriado } from '@/utils/calendario'

interface CalendarioAnualProps {
  ano: number
  feriados: FeriadoApi[]
  oportunidadeSelecionada: Oportunidade | null
  /** Em hover na lista, mostra esta oportunidade no calendário (preview). */
  oportunidadeEmHover?: Oportunidade | null
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function CalendarioAnual({
  ano,
  feriados,
  oportunidadeSelecionada,
  oportunidadeEmHover = null,
}: CalendarioAnualProps) {
  const { tema } = useTema()
  const isLight = tema === 'light'
  const c = classesTema(isLight)
  const feriadosSet = new Set(feriados.map((f) => f.date))

  const oportunidadeExibida = oportunidadeEmHover ?? oportunidadeSelecionada
  const diasAgendamento = new Set<string>()
  const diasFolgaCompleta = new Set<string>()
  if (oportunidadeExibida) {
    let d = new Date(oportunidadeExibida.inicioAgendamento.getTime())
    const fimA = oportunidadeExibida.fimAgendamento.getTime()
    while (d.getTime() <= fimA) {
      diasAgendamento.add(dataParaKey(d))
      d = addDias(d, 1)
    }
    let d2 = new Date(oportunidadeExibida.inicio.getTime())
    const fimC = oportunidadeExibida.fim.getTime()
    while (d2.getTime() <= fimC) {
      diasFolgaCompleta.add(dataParaKey(d2))
      d2 = addDias(d2, 1)
    }
  }
  const ehPreview = Boolean(oportunidadeEmHover)

  const dataAtual = new Date()
  const mesAtual = dataAtual.getFullYear() === ano ? dataAtual.getMonth() : -1

  return (
    <div className={`w-full transition-opacity duration-200 ${ehPreview ? 'opacity-90' : 'opacity-100'}`}>
      {ehPreview && (
        <p className={`text-[9px] font-medium uppercase tracking-widest mb-2 ${c.tituloCard}`}>
          Pré-visualização ao passar o mouse
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
        {MESES.map((nomeMes, indiceMes) => {
          if (indiceMes < mesAtual) return null

          const primeiroDia = new Date(ano, indiceMes, 1)
          const ultimoDia = new Date(ano, indiceMes + 1, 0)
          const inicioGrid = new Date(primeiroDia)
          const diaSemana = primeiroDia.getDay()
          inicioGrid.setDate(inicioGrid.getDate() - diaSemana)
          
          const feriadosDoMes = feriados.filter((f) => {
            const [y, m] = f.date.split('-').map(Number)
            return y === ano && m === indiceMes + 1
          })

          const celulas: Date[] = []
          let d = new Date(inicioGrid.getTime())
          const numDias = ultimoDia.getDate() + diaSemana
          const numLinhas = Math.ceil(numDias / 7)
          for (let i = 0; i < numLinhas * 7; i++) {
            celulas.push(new Date(d.getTime()))
            d = addDias(d, 1)
          }

          const letrasDias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

          return (
            <div key={indiceMes} className="flex flex-col gap-2.5">
              <div className={`font-semibold text-sm tracking-tight ${c.calendarioMes}`}>{nomeMes}</div>
              
              <div className="grid grid-cols-7 gap-y-1.5 text-center">
                {letrasDias.map((letra, idx) => (
                  <div key={idx} className={`text-[10px] font-medium uppercase ${c.calendarioDiaSemana}`}>
                    {letra}
                  </div>
                ))}

                {celulas.map((data, i) => {
                  const key = dataParaKey(data)
                  const foraDoMes = data.getMonth() !== indiceMes
                  const ehFeriadoDia = ehFeriado(data, feriadosSet)
                  const ehAgendado = diasAgendamento.has(key)
                  const ehFolga = diasFolgaCompleta.has(key)
                  
                  if (foraDoMes) {
                    return (
                      <div key={i} className={`h-6 w-6 mx-auto flex items-center justify-center text-[9px] ${c.calendarioForaMes}`}>
                        {data.getDate()}
                      </div>
                    )
                  }

                  let classes = "relative flex h-6 w-6 mx-auto items-center justify-center rounded-full text-[9px] transition-all "
                  
                  if (ehAgendado) {
                    classes += "bg-emerald-500 text-white font-bold shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  } else if (ehFolga) {
                    if (ehFeriadoDia) {
                      classes += "bg-amber-500 text-white font-bold shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                    } else {
                      classes += "border border-emerald-500/50 text-emerald-600 font-medium bg-emerald-500/10"
                    }
                  } else if (ehFeriadoDia) {
                    classes += c.calendarioFeriado
                  } else {
                    classes += c.calendarioNormal
                  }

                  return (
                    <div key={i} className={classes}>
                      {data.getDate()}
                      {ehFeriadoDia && ehAgendado && (
                        <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full ${c.calendarioFeriadoDentro}`} title="Feriado consumido pelas férias" />
                      )}
                    </div>
                  )
                })}
              </div>

              {feriadosDoMes.length > 0 && (
                <div className="space-y-1 mt-1">
                  {feriadosDoMes.map((f) => (
                    <div key={f.date} className="flex gap-2 text-[10px] items-start leading-tight">
                      <span className="font-semibold text-amber-600 shrink-0">{f.date.split('-')[2]}</span>
                      <span className={c.calendarioFeriadoLista} title={f.name}>{f.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
