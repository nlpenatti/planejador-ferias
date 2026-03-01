# Planejador de Férias

Combine férias com feriados e fins de semana. Escolha o ano, a quantidade de dias (CLT) e veja as melhores oportunidades.

## Como rodar

```bash
# Clonar e instalar
git clone <url-do-repo>
cd planejador-ferias
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Testes
npm run test        # watch
npm run test:run    # uma vez

# Validação (tipo + lint)
npm run validate
```

## Scripts

| Script       | Descrição                          |
| ------------ | ----------------------------------- |
| `npm run dev` | Sobe o Vite em modo desenvolvimento |
| `npm run build` | `tsc` + build Vite para produção  |
| `npm run test` | Vitest em modo watch                |
| `npm run test:run` | Vitest uma execução              |
| `npm run validate` | `type-check` + `lint`            |
| `npm run preview` | Preview do build de produção      |

## Estrutura (resumo)

- **Sidebar**: configuração (ano, dias de férias) e lista de oportunidades (listbox com teclado).
- **Hook** `usePlanejadorFerias`: estado do ano, dias, feriados (API), oportunidades e seleção.
- **API** `feriados-api`: Brasil API (feriados por ano), com cache, timeout e retry na UI.
- **Constantes** em `src/constants.ts`: anos disponíveis, limite de oportunidades, timeout da API, etc.

## Pré-commit

Husky + lint-staged: antes do commit são executados `eslint --fix` nos arquivos staged e `npm run type-check`. Instale as dependências e, em um repositório git, o hook será configurado pelo script `prepare`.
