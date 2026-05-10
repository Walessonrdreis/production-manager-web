# Melhorias e Roadmap - Módulo de Produtos

## 1. Conexão de Produtos com Setores (Roteiro de Produção)
**Conceito:** Cada produto listado em "Meus Produtos" precisa estar atrelado a um "Roteiro de Produção" (Production Routing) mapeado pelos Setores da empresa.
**Como funciona:**
- Ao invés de ser apenas um item de estoque, o produto passa a ter um fluxo.
- Exemplo: O Produto SKU 123 passa pelo **Setor de Corte**, depois pelo **Setor de Costura**, e finaliza no **Setor de Embalagem**.
- Pode-se atrelar também o "Tempo Padrão" (TC - Tempo de Ciclo) que o produto leva em cada setor.
**Benefício (O Grande Valor):** Ao clicar em "Planejar Produção" (o botão que criamos), o sistema puxaria a Demanda Pendente (ex: 50 unidades), identificaria os setores do produto, e já alocaria a **carga de trabalho exata** em cada setor, revolucionando o gerenciamento de capacidade da fábrica.

## 2. Interface e UX em Meus Produtos
- **Filtros Avançados (Faced Search):** Adicionar filtros laterais por "Família", "Status de Estoque" (Críticos, Atenção), etc.
- **Ações em Massa (Batch Actions):** Poder selecionar múltiplos SKUs com déficit usando checkboxes e clicar em "Planejar Produção em Lote", enviando todos de uma vez para o Planner.
- **Exportação (Relatórios):** Um botão para exportar a listagem atual (com o cálculo de demanda e estoque) para PDF ou Excel (CSV).

## 3. Evolução Analítica (Inteligência)
- **Histórico e Lead Time:** No modal do produto, mostrar um gráfico histórico de saída deste produto.
- **Análise de Cobertura:** Com base na média diária de vendas (dos Orders), o sistema avisar quantos dias o estoque atual vai durar, ao invés de usar apenas um número fixo de "Estoque Mínimo".
