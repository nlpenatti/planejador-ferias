import { useTema } from '@/contexts/ThemeContext'
import { classesTema } from '@/utils/classesTema'
import { OPCOES_DIAS_FERIAS, DIAS_FERIAS_INICIAL } from '@/constants'

interface SeletorDiasProps {
  dias: number
  customizado: number | null
  onChange: (dias: number, customizado: number | null) => void
}

export function SeletorDias({ dias, customizado, onChange }: SeletorDiasProps) {
  const { tema } = useTema()
  const ehCustom = customizado !== null
  const isLight = tema === 'light'
  const c = classesTema(isLight)

  return (
    <div className="space-y-3">
      <div className={`inline-flex flex-wrap gap-1.5 rounded-xl border p-1 ${c.grupoBotoes}`}>
        {OPCOES_DIAS_FERIAS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n, null)}
            className={`min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-[2.25rem] rounded-lg px-2.5 py-3 sm:py-2 text-base sm:text-sm font-medium transition-colors ${
              !ehCustom && dias === n
                ? isLight
                  ? 'bg-emerald-500/20 text-emerald-600'
                  : 'bg-emerald-500/15 text-emerald-400'
                : c.botaoSecundario
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs sm:text-[10px] font-medium uppercase tracking-wider ${c.textoMuted}`}>ou</span>
        <input
          id="dias-ferias-customizado"
          name="dias-ferias"
          type="number"
          min={1}
          max={30}
          placeholder="Outro"
          value={ehCustom ? customizado : ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : null
            if (v !== null && v >= 1 && v <= 30) onChange(v, v)
            else if (e.target.value === '') onChange(DIAS_FERIAS_INICIAL, null)
          }}
          className={`w-28 sm:w-24 min-h-[44px] sm:min-h-0 rounded-lg border px-3 py-3 sm:py-2.5 text-center text-sm font-medium focus:border-emerald-500/40 focus:outline-none ${c.input}`}
        />
        <span className={`text-xs sm:text-[10px] font-medium ${c.textoMuted}`}>dias</span>
      </div>
    </div>
  )
}
