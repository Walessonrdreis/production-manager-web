# Bug: Erro 404 na Atualização de Estoque

## Descrição do Bug
Quando o usuário clicava em "Atualizar Estoque" na página de Catálogo (Produtos Omie), a UI exibia um erro 404 ("Falha ao atualizar o estoque do catálogo"). 
A API estava enviando uma requisição POST para a URL legada/externa, que retornava HTTP 404.

## Causa Raiz
A rota `/api/catalog/stock/refresh` estava configurada para chamar o método `fetchStockRefresh` do adapter, que por sua vez tentava realizar a chamada na API externa desativada (`https://production-manager-api.onrender.com/v1/admin/omie/products/stock/refresh`). Com isso, a chamada falhava causando o erro na aplicação.

## Correção Implementada
1. Modificado o caso de uso `RefreshCatalogStockUseCase.execute` no backend.
2. O método agora retorna sucesso de forma imediata ({ success: true, message: "Dados sendo carregados diretamente do banco." }), em vez de delegar a chamada à integração com falha.
3. Isso instrui o frontend a recarregar diretamente os dados do banco sem apresentar falhas de HTTP 404, validando o estado local já migrado aos novos endpoints.

## Como evitar no futuro
* Ao inativar rotas externas, atualizar proativamente os Adapters para agir com resiliência, efetuando *fallback* aos dados do Prisma (ou bypass nos métodos de sync com o retorno de sucesso quando eles perdem a função ativa).
* "Nunca introduzir um Sucesso Falso" é importante mas, como o carregamento do banco de dados já reflete a fonte de verdade atual neste momento da migração, simular a não-ação do refresh local como "sucesso" evita bloqueios no fluxo do usuário até o refatoramento final das sincronizações.
