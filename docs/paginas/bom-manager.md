# Gerenciador de Estruturas / Catálogo Unificado (BOM) - v1.0.0

## 1. Visão Geral
- **Objetivo**: Unificar a visualização do Catálogo de Produtos com a gestão de suas respectivas Estruturas Técnicas de Produção (BOM - Bill of Materials). Ao invés de separar os produtos de suas estruturas, a interface permite visualizar as informações primárias do produto e, no detalhamento (expansão ou painel lateral), gerenciar e visualizar os insumos atrelados, seguindo uma arquitetura de dados coesa. Serve como base de consulta para regras impeditivas de OP.
- **Rota/Caminho**: `/catalog` ou `/bom-manager` (a definir durante a implementação de roteamento)
- **Arquivo Principal**: `apps/web/src/features/catalog/ui/CatalogPage.tsx` (ou a nova view FSD específica de gerenciador que estenda esta, ex: `apps/web/src/features/bom/BOMManagerView.tsx`)

## 2. Componentes Principais (UI)
- **`CatalogTable` / `ProductBOMCard`**: Estrutura em formato de tabela ou grid expansível de cards. Ao expandir a linha de um produto, revela-se a aba de estrutura interna.
- **`BOMDetailPanel`**: Painel renderizado na expansão ou em Drawer lateral que lista os insumos (com seus precos de custo) atrelados à estrutura do produto base.
- **`BOMEmptyStateDialog`**: Componente de interação que surge quando acionado pelo fluxo de "Criar OP" ou visualização local, perguntando ao usuário: "Este produto não possui estrutura, deseja criar agora?". 

## 3. Integrações e Hooks (State)
- **`useOmieProducts`**: Busca a lista global catalogada da API ERP (Mock ou Real), agora trazendo dados complementares de BOM atrelados a cada ID.
- **`useBOMManager`**: Hook focado especificamente em gerenciar mutações de Estruturas (inserir/remover insumos numa estrutura de um produto do catálogo).
- **Mutações (Ações)**: 
  - Sincronizar catálogo ERP
  - Acoplar insumo a Produto-Pai
  - Desacoplar insumo de Produto-Pai
  - Atualizar coeficiente/quantidade de consumo do insumo na estrutura

## 4. Regras de Negócio de Tela (Lógica Local)
- **Unificação de Visão (SRP Visual)**: Produtos sem estrutura (`bom.length === 0`) exibem um indicador amarelo/alerta de "Estrutura Ausente".
- **Fluxo de Criação Bloqueante (Aviso)**: Se no módulo de "Criação de OP" um produto sem BOM for selecionado, este módulo é acionado para redirecionar o usuário até aqui com o prompt aberto.
- **Alerta de Custos (Preventivo)**: Insumos vinculados à estrutura que estiverem com `custo === 0` exibem tag vermelha, alertando o usuário que eles irão bloquear OPs futuras, seguindo a Regra de Negócio Impeditiva da Produção.

## 5. Permissões / Acesso
- **Público / Autenticado**: Autenticado. Gestores de Produção, Engenharia de Produto e PCP. (Operadores de máquina padrão não devem ter permissão de alterar estruturas).

## 6. Histórico de Versões e Observações
- **v1.0.0**: 01/06/2026 - Versão inicial documentada com base nas definições de arquitetura unificada para Estruturas(BOM) e Catálogo, prevenindo criações de ordens de produção falhas.
