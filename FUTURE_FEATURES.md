# 🚀 Evolução e Novas Funcionalidades (Backlog)

Este documento serve como um guia para as futuras expansões do sistema. As funcionalidades aqui listadas ainda não foram implementadas e devem ser discutidas e priorizadas.

## 📅 Gestão de Datas e Programação (Foco Atual)
- **Campo: Data de Produção Programada:** 
  - Adição de um seletor de data para cada SKU ou pedido.
  - **Exibição:** Badge visual com a data na tabela principal.
  - **Alertas Cromáticos:** Cores diferentes para datas futuras, hoje (atenção) e datas passadas sem conclusão (atraso crítico).
- **Filtros por Período de Produção:**
  - Filtro rápido para "Hoje", "Amanhã", "Esta Semana" e "Atrasados".
  - Calendário lateral para selecionar um dia específico e ver a carga de trabalho.
- **Conformidade com Prazo do Cliente:**
  - Comparação automática: Alerta se a Data de Produção for posterior à Data de Entrega acordada com o cliente no Omie.
- **Edição em Massa:** ferramenta para selecionar múltiplos itens e definir a mesma data de produção para todos.

## 📈 Metas e Performance
- **Metas de Produção (Diárias/Semanais):** Definir objetivos quantitativos por produto ou setor.
- **Dashboards de Produtividade:** Comparação entre o que foi planejado vs. o que foi realmente entregue no dia.

## 🔍 Visibilidade Operacional
- **Produtos "Em Produção" Hoje:** Uma visualização simplificada (estilo Kanban ou Lista Rápida) dos itens que estão atualmente nas máquinas.
- **Histórico Completo de Produção:** Registro auditável de quem finalizou o quê e quando (log de atividades).
- **Rastreamento de Operadores:** Identificar qual colaborador ou equipe foi responsável pela produção de determinado lote/pedido.

## 🛠️ Qualidade e Processos
- **Checklist de Qualidade:** Ao marcar um item como "Produzido", exigir a conferência de critérios técnicos (medidas, acabamento, embalagem).
- **Relatório de Perdas/Retrabalho:** Registrar itens que não passaram na qualidade e o motivo.

## 📦 Integração e Materiais
- **Reserva de Matéria-Prima:** Vincular a produção ao estoque de insumos (ex: "Para produzir 10 cadeiras, preciso de X metros de tecido").
- **Geração de Etiquetas:** Botão para imprimir etiquetas de identificação assim que o item sai da Etapa 20.

## 🏗️ Controle por Lote (Produção em Massa)
- **Agrupamento de Pedidos em Lotes:** Criar um "Super Lote" que agrupa o mesmo SKU de diversos pedidos diferentes para produzir tudo de uma vez, otimizando o setup das máquinas.
- **Rastreabilidade de Lote:** Identificar quais pedidos foram atendidos por qual lote de fabricação.
- **Status de Lote:** Acompanhar o progresso do lote como um todo, além do progresso individual de cada pedido.

## 🔔 Notificações e Alertas
- **Alertas de Pedidos Urgentes:** Notificação visual (pop-up ou som) quando um pedido marcado como prioridade máxima entra na Etapa 20.
- **Notificação de Conclusão para Expedição:** Aviso automático para o setor de logística assim que o checklist de produção for finalizado.
- **Alertas de Inatividade:** Notificar o gestor se um item ficar mais de X horas/dias sem nenhuma movimentação na etapa de monitoramento.

## 📱 Experiência do Usuário (UX)
- **Modo "Chão de Fábrica":** Interface simplificada para tablets/celulares com botões grandes para apontamento rápido.
- **Modo Noturno (Dark Mode):** Para ambientes de fábrica com iluminação específica.

---
*Este arquivo deve ser atualizado conforme novas ideias surjam nas nossas conversas.*
