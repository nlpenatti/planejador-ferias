import { useTema } from '@/contexts/ThemeContext'

const MESES_SKELETON = 8

export function CalendarioSkeleton() {
  const { tema } = useTema()
  const isLight = tema === 'light'
  const skeletonBg = isLight ? 'bg-slate-200' : 'bg-slate-700/50'

  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
        {Array.from({ length: MESES_SKELETON }, (_, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <div className={`h-4 w-20 rounded ${skeletonBg}`} />
            <div className="grid grid-cols-7 gap-y-1.5 text-center">
              {Array.from({ length: 7 }, (_, j) => (
                <div key={j} className={`h-3 w-6 sm:w-6 mx-auto rounded ${skeletonBg}`} />
              ))}
              {Array.from({ length: 35 }, (_, j) => (
                <div key={`c-${j}`} className={`h-9 w-9 min-h-[36px] min-w-[36px] sm:h-6 sm:w-6 mx-auto rounded-full ${skeletonBg}`} />
              ))}
            </div>
            <div className="space-y-1 mt-1">
              <div className={`h-3 w-full rounded ${skeletonBg}`} />
              <div className={`h-3 w-20 rounded ${skeletonBg}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
