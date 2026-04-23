# Instruções para Agentes de IA

Este projeto utiliza um arquivo de documentação viva chamado `PROJECT_SUMMARY.md`.

## Regra de Auto-Atualização
Sempre que houver uma alteração na **estrutura de arquivos**, na **arquitetura técnica** ou na **lógica de negócio** (ex: novos endpoints no proxy, novas regras de dedução, novos hooks de persistência), você DEVE:

1.  Ler o conteúdo atual de `PROJECT_SUMMARY.md`.
2.  Atualizar as seções pertinentes com a nova lógica ou infraestrutura.
3.  Incrementar a versão no cabeçalho seguindo o padrão `v1.x.x` (correções menores) ou `vX.0.0` (mudanças estruturais grandes).
4.  Data da atualização deve ser a data atual da conversa.

Isso garante que o proprietário do projeto sempre tenha um guia atualizado para estudo e evolução do sistema.
