import { useEffect } from 'react'

const INTERVALO_MS = 5 * 60 * 1000 // 5 minutos

function verificarVersao() {
  fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
    .then((res) => res.json())
    .then((data: { version?: string }) => {
      const versaoServidor = data?.version
      if (versaoServidor && versaoServidor !== __APP_VERSION__) {
        window.location.reload()
      }
    })
    .catch(() => {
      // Ignora erro de rede para evitar reload em loop
    })
}

export function useVerificacaoVersao() {
  useEffect(() => {
    const id = setInterval(verificarVersao, INTERVALO_MS)
    const handler = () => {
      if (document.visibilityState === 'visible') verificarVersao()
    }
    document.addEventListener('visibilitychange', handler)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handler)
    }
  }, [])
}
