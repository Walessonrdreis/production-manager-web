# Production Manager - Professional Bootstrap

Sistema de gestão de produção industrial com integração Omie e monitoramento de etapas de produção.

## Arquitetura

O projeto segue uma arquitetura orientada a **Features**, organizada nas seguintes camadas:

- `src/app`: Provedores globais, configurações de rotas e inicialização.
- `src/pages`: Componentes de nível de página que agregam features.
- `src/features`: Unidades de negócio independentes (ex: auth, products, planning).
- `src/shared`: Componentes, hooks, APIs e utilitários reutilizáveis.
- `docs/adr`: Architectural Decision Records.

## Tecnologias Principais

- **React + TS (Vite)**
- **Tailwind CSS**: Estilização utility-first.
- **Zustand**: Gerenciamento de estado (Auth).
- **TanStack Query**: Data fetching e cache.
- **Lucide React**: Ícones.
- **Express (Proxy)**: Ponte para contornar restrições de CORS da API externa.

## Como Executar

1. Instale as dependências: `npm install`
2. Configure o `.env` (veja `.env.example`)
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Execute os testes: `npm run test`

## Decisões de Projeto

Veja a pasta `docs/adr` para detalhes sobre escolhas técnicas.
