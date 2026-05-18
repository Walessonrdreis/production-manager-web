# Bug de Listagem de Setores (Double Wrapper)

**Descrição do Bug:**
A funcionalidade de listagem de setores (`/sectors`) no frontend estava retornando um array vazio e mostrando 0 setores criados, apesar de existirem dados persistidos na API alvo no Render (`https://production-manager-api.onrender.com/v1/admin/sectors`).

**Causa Raiz:**
Semelhante ao que ocorreu na listagem de dados do estágio 20 (`02_produtos_controle_producao_ocultos.md`), a integração externa (SectorsAdapter) estava devolvendo o objeto literal de resposta (`response.data`) do microserviço, o qual continha um array de dados aninhado (geralmente sob a chave `.data` e com informações de `.meta`). O ResponseBuilder da API local (backend intermediário) novamente envelopava os dados em `HttpResponseBuilder.success`, adicionando seu próprio wrapper `{ success: true, data: { ... } }`. Desse modo, o caso de uso no frontend esperava que `response.data.data` fosse um Array para normalizá-lo, mas ao invés disso, encontrava um objeto não listável `{ data: [...] }`, processando como uma listagem vazia.

**Como foi corrigido:**
Foi aplicada uma alteração focada no `SectorsAdapter` do backend, forçando o rastreio e extração correta (desenvelopamento profundo) do Array antes de enviá-lo ao `UseCase`. A linha responsável foi mudada para devolver especificamente o Array da lista de setores oriundo do JSON externo. Além disso, foram aproveitados os Use Cases de "criar", "editar" e "deletar" (POST, PUT, DELETE) conectando-os aos endpoints corretos no Render para garantir operações plenas via Frontend.

**Como evitar no futuro:**
Sempre que novos Adapters de conexão externa com o ambiente Render precisarem devolver coleções de items (`Get` / `List`), deve-se aplicar o desconstrucionamento do payload completo e repassar apenas as Arrays e objetos normalizados para os próximos blocos do sistema, evitando a criação de "Deep Objects" que a tipagem do frontend tem dificuldade de processar, a menos que tipada e implementada explicitamente o suporte a eles.
