import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

export type Tema = 'dark' | 'light'

const STORAGE_KEY = 'planejador-ferias-tema'

interface ThemeContextType {
  tema: Tema
  setTema: (tema: Tema) => void
  alternarTema: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function temaInicial(): Tema {
  if (typeof window === 'undefined') return 'dark'
  const salvo = localStorage.getItem(STORAGE_KEY) as Tema | null
  if (salvo === 'dark' || salvo === 'light') return salvo
  return 'dark'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTemaState] = useState<Tema>(temaInicial)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
  }, [tema])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tema)
  }, [tema])

  const setTema = (novo: Tema) => setTemaState(novo)
  const alternarTema = () => setTemaState((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ tema, setTema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTema() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTema deve ser usado dentro de ThemeProvider')
  return ctx
}
