# ADR 002: Escolha de TanStack Query e MSW

## Status
Aceito

## Contexto
O sistema depende fortemente de dados externos (Render API) que podem sofrer instabilidades ou restrições de CORS. Precisamos de um gerenciamento de estado de servidor eficiente e uma forma de desenvolver offline ou sem a API estar pronta.

## Decisão
- **TanStack Query (React Query)**: Escolhida para gerenciar o estado assíncrono. Ela resolve automaticamente problemas de cache, estados de carregamento (loading/error) e polling (revalidação periódica), essencial para o dashboard de produção.
- **MSW (Mock Service Worker)**: Escolhido para interceptar requisições a nível de rede. Isso permite simular a API exatamente como ela é, facilitando testes e o desenvolvimento front-end independente do back-end.

## Consequências
- **Prós**: UX fluida com cache inteligente, facilidade em debugar requisições, testes de integração robustos.
- **Contras**: Curva de aprendizado inicial maior que um `useEffect` simples.
