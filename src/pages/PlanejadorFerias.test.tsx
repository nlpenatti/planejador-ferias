import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PlanejadorFerias } from './PlanejadorFerias'
import type { FeriadoApi } from '@/types/feriado'

vi.mock('@/api/feriados-api', () => ({
  buscarFeriados: vi.fn(),
}))

const feriadosFake: FeriadoApi[] = [
  { date: '2026-01-01', name: 'Confraternização', type: 'national' },
  { date: '2026-12-25', name: 'Natal', type: 'national' },
]

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('PlanejadorFerias (integração)', () => {
  beforeEach(async () => {
    const api = await import('@/api/feriados-api')
    vi.mocked(api.buscarFeriados).mockResolvedValue(feriadosFake)
  })

  it('renderiza o título da página', () => {
    render(<PlanejadorFerias />, { wrapper: Wrapper })
    expect(screen.getByRole('heading', { name: /planejador de férias/i })).toBeInTheDocument()
  })

  it('exibe configuração (ano e dias)', () => {
    render(<PlanejadorFerias />, { wrapper: Wrapper })
    expect(screen.getByRole('group', { name: /selecionar ano/i })).toBeInTheDocument()
    expect(screen.getByText(/dias de férias \(CLT\)/i)).toBeInTheDocument()
  })

  it('após carregar feriados, exibe oportunidades ou calendário', async () => {
    const api = await import('@/api/feriados-api')
    vi.mocked(api.buscarFeriados).mockResolvedValue(feriadosFake)
    render(<PlanejadorFerias />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(api.buscarFeriados).toHaveBeenCalledWith(2026, expect.anything())
    })
    await waitFor(() => {
      const listbox = screen.queryByRole('listbox', { name: /oportunidades de férias/i })
      const calendario = document.querySelector('[class*="grid"]')
      expect(listbox != null || calendario != null).toBe(true)
    }, { timeout: 3000 })
  })

  it('permite trocar o ano e dispara nova busca', async () => {
    const user = userEvent.setup()
    const api = await import('@/api/feriados-api')
    vi.mocked(api.buscarFeriados).mockResolvedValue(feriadosFake)
    render(<PlanejadorFerias />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(api.buscarFeriados).toHaveBeenCalledWith(2026, expect.anything())
    })
    const botao2027 = screen.getByRole('button', { name: '2027' })
    await user.click(botao2027)
    await waitFor(() => {
      expect(api.buscarFeriados).toHaveBeenCalledWith(2027, expect.anything())
    })
  })
})
