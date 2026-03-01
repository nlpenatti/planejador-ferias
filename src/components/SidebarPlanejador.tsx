import { SeletorDias } from '@/components/SeletorDias'
import { ListaOportunidades } from '@/components/ListaOportunidades'
import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'
import { ANOS_DISPONIVEIS } from '@/constants'
import type { Oportunidade } from '@/types/oportunidade'

interface SidebarPlanejadorProps {
  ano: number
  setAno: (ano: number) => void
  diasDeFerias: number
  setDiasDeFerias: (dias: number) => void
  diasCustomizado: number | null
  setDiasCustomizado: (valor: number | null) => void
  diasEfetivos: number
  oportunidades: Oportunidade[]
  oportunidadeSelecionada: number | null
  setOportunidadeSelecionada: (indice: number | null) => void
  oportunidadeEmHover: number | null
  setOportunidadeEmHover: (indice: number | null) => void
  limparSelecao: () => void
  temSelecao: boolean
}

export function SidebarPlanejador({
  ano,
  setAno,
  diasDeFerias,
  setDiasDeFerias,
  diasCustomizado,
  setDiasCustomizado,
  diasEfetivos,
  oportunidades,
  oportunidadeSelecionada,
  setOportunidadeSelecionada,
  oportunidadeEmHover,
  setOportunidadeEmHover,
  limparSelecao,
  temSelecao,
}: SidebarPlanejadorProps) {
  const { tema } = useTema()
  const isLight = tema === 'light'
  const c = classesTema(isLight)

  return (
    <aside className="flex flex-col gap-6">
      {/* Card Configuração */}
      <div className={`rounded-2xl border p-5 ${c.card}`}>
        <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${c.tituloCard}`}>
          Configuração
        </h2>
        <div className="space-y-5">
          <div>
            <span id="label-seletor-ano" className={`block text-[11px] font-medium mb-2 ${c.label}`}>
              Ano
            </span>
            <div
              role="group"
              aria-labelledby="label-seletor-ano"
              className={`inline-flex rounded-xl border p-1 ${c.grupoBotoes}`}
            >
              {ANOS_DISPONIVEIS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAno(a)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    ano === a
                      ? isLight
                        ? 'bg-emerald-500/20 text-emerald-600 shadow-sm'
                        : 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                      : c.botaoSecundario
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span id="label-seletor-dias" className={`text-[11px] font-medium ${c.label}`}>
                Dias de férias (CLT)
              </span>
              {temSelecao && (
                <button
                  type="button"
                  onClick={limparSelecao}
                  className={`text-[10px] font-medium transition-colors ${c.botaoSecundario}`}
                >
                  Limpar seleção
                </button>
              )}
            </div>
            <div role="group" aria-labelledby="label-seletor-dias">
              <SeletorDias
                dias={diasDeFerias}
                customizado={diasCustomizado}
                onChange={(dias, custom) => {
                  setDiasDeFerias(dias)
                  setDiasCustomizado(custom)
                  setOportunidadeSelecionada(null)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Combine com feriados */}
      <div className={`rounded-2xl border overflow-hidden flex flex-col min-h-0 ${c.card}`}>
        <div className={`p-4 border-b ${c.cardBorda}`}>
          <h2 className={`text-[11px] font-semibold uppercase tracking-widest ${c.tituloCard}`}>
            Combine com feriados
          </h2>
          <p className={`text-[13px] mt-1 ${c.label}`}>
            Melhores períodos para <span className="font-semibold text-emerald-500">{diasEfetivos} dias</span>
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <ListaOportunidades
            ano={ano}
            oportunidades={oportunidades}
            diasDeFerias={diasEfetivos}
            selecionada={oportunidadeSelecionada}
            indiceAtivo={oportunidadeEmHover ?? oportunidadeSelecionada}
            onSelecionar={setOportunidadeSelecionada}
            onHover={setOportunidadeEmHover}
          />
        </div>
      </div>
    </aside>
  )
}
