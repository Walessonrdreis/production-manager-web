# Correção de Bug: Fake Success ao Deletar Registros Híbridos (Produção)

## Descrição do Bug
Após as correções prévias do erro `500` no Prisma, o usuário relatou que exclusões no front-end não emitiam nenhum erro, mas "o item continuava marcado". Em outras palavras, mesmo após o Delete disparar com `$status=200`, a recarregamento da página reconstituía a visualização como se nada tivesse acontecido.

## Causa Raiz
Ao implementarmos a tolerância ao erro `P2025` no `PrismaProductionRepository` para permitir deleções de registros que existem **somente** na API Externa Legada, o UseCase encerrava a execução com Sucesso *logo em seguida*. O Controller não notificava o adapter `ProductionAdapter` local para fazer o `DELETE` real no banco legado do Render.

## Como foi corrigido
- Criação dos métodos `deleteProduced(id)` e `deleteSchedule(id)` no `ProductionAdapter`, mirando as rotas `DELETE /dashboard/produced/:id` e `DELETE /admin/schedules/:id`.
- Modificação no Escopo do Prisma: Agora `DeleteProducedUseCase` e `DeleteScheduleUseCase` executam duas ações concorrentemente - tentam apagar do Prisma, e em sequência disparam a chamada Delete para o `ProductionAdapter`. Se der NotFound em alguma das pontas, a ponta correspondente ignora.

## Passos Realizados
- [x] PRONTA: Implementação dos métodos `delete` no `ProductionAdapter` com ignorância a erro 404 (evitando problemas se o item for puramente local do Prisma).
- [x] PRONTA: Configuração do `ProductionUseCases.ts` para aglutinar ambas requisições do repo local e externo.

## Como evitar no futuro
Sempre que uma lista híbrida for consumida via GET unindo `BD Local + API Externa`, lembrar que a Deleção/Atualização **precisa** transacionar as duas pontas sempre, em formato pass/fail-forward. A omissão de uma ponta leva à ressurreição indesejada ("Ghosting" e "Fake Success") da interface no reload.
