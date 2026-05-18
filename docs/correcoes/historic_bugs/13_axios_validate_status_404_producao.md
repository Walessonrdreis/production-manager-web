# Correção de Bug: Notificações de Erro 404 para Operações Condicionais e Idempotentes

## Descrição do Bug
Após aplicarmos a correção do Prisma (para que ele passe a retornar `404 Not Found` em requisições de buscar/excluir itens que não existem no banco), o Frontend passou a exibir blocos vermelhos de erro (`toast.error`) e popular o console do navegador ("Request failed with status code 404"). Isso acontecia mesmo em operações esperadas pelo fluxo de negócio (como verificar se um item de produção já existe para decidir se cria ou não - toggle), ou numa operação de delete onde o fato de o item já estar excluído é um sucesso.

## Causa Raiz
O interceptor global do Axios (`client.ts`) reage a todas as Promises rejeitadas interceptando seus `status` codes. Qualquer 4xx ou 5xx aciona automaticamente um popup global avermelhado. A rotina `Toggle API / Toggling off` pressupunha tentar deletar - ou buscar - IDs, resultando em 404. Como o Axios trata status fora da faixa `2xx` como `Promise.reject()`, a tratativa de negócio ("se for nulo faça ação X") jamais ocorria com paz, disparando alarmes falsos para o usuário. 

## Como foi corrigido
- Nos métodos de infraestrutura limitados (`ProducedRepository.ts` para `getById` e `delete`, e `ScheduleRepository.ts` para `delete`), foi introduzida a diretiva `validateStatus` no config do Axios de cada requisição.
- A função foi ajustada para aceitar a faixa `>= 200 && < 300` adicionando também `status === 404`. 
- Isso faz com que o Axios não classifique o 404 como falha técnica da rede, permitindo que as funções procedam suavemente: retornando nulo de forma limpa (sem log de crash) e processando deletes de forma controlada/idempotente.

## Passos Realizados
- [x] PRONTA: Adicionado customizado de `validateStatus` em `ProducedRepository.getById(id)`.
- [x] PRONTA: Adicionado customizado de `validateStatus` em `ProducedRepository.delete(id)`.
- [x] PRONTA: Adicionado customizado de `validateStatus` em `ScheduleRepository.delete(id)`.

## Como evitar no futuro
Nas aplicações React que utilizam Axios Interceptors para "Toasts" (Aletas Globais), certifique-se de configurar as requisições cujo falha (404/Not Found, por exemplo) representa um cenário previsível do fluxo de negócio com `validateStatus`. Interceptar e lançar erro genericamente vai prejudicar a experiência do usuário se a API estritamente retornar 404.
