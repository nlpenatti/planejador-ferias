import { PlanejadorFerias } from '@/pages/PlanejadorFerias'
import { useVerificacaoVersao } from '@/hooks/useVerificacaoVersao'

function App() {
  useVerificacaoVersao()
  return <PlanejadorFerias />
}

export default App
