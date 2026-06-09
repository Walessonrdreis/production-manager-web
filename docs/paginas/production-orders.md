# Ordens de Produção (V2) - v1.0.0

## Propósito da Página
Esta é a nova interface (Carga de Trabalho Isolada) projetada sob a arquitetura FSD para supervisionar de forma estável o controle das Ordens de Produção.
Toda a listagem passa por injeção de dependências (Gateway/Strategy), protegendo o UI das alterações de retaguarda. Atualmente em simulação (Fake), ela provê o alicerce pronto para ativação real.

## Estrutura do Estado e Chamadas
- **Isolamento via Gateway**: O componente pai da tela usa `useProductionOrders()` e o hook é quem decide chamar o gateway. O gateway verifica `VITE_USE_FAKE_OP_API=true` no env e injeta a versão simulada sem afetar a UI.
- **Tipagens Estritas**: Usa `ProductionOrder`, lidando de ponta a ponta com status como `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELED`.

## Responsabilidades de Componentes
1. **ProductionOrderListPage**: Página que orquestra as dependências, processa mensagens de erros globais com a UI e provê as informações limpas.
2. **ProductionOrderList**: Apresentação visual da tabela (sem responsabilidade de requisições ou regras de negócio). Trata empty states e visualizações condicionais em andamento usando `lucide-react` icons.
3. **useProductionOrders**: Responsável pelo `load(), createOrder(), updateOrder(), cancelOrder()` localizando e mantendo estados seguros (`isLoading`, `error`). Lida sempre com o contrato isolado.

## Regras de Interface / Design
- Padrão do List List (`10. Regra de Padrão de UI` no AGENTS.md).
- Status com badges amigáveis.
- Mensagens de feedbacks em loading (spinner amigável) e erro de carga.
- Estado vazio com iconografia limpa para direcionamento a inserção.
- Sem poluições sistêmicas ou identificadores complexos sem sentido. O visual segue `Slate-900` e design moderno baseado no layout global.
