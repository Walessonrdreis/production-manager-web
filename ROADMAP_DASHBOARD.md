# Roadmap: Dashboard Analítico (Segunda Etapa)

Este documento descreve o planejamento para a transformação da página principal (`/dashboard`) em um painel estratégico de inteligência industrial, conforme discutido em 03/05/2026.

## 🎯 Objetivo
Transformar dados brutos de produção em indicadores de performance (KPIs) que auxiliem na tomada de decisão gerencial, identificando gargalos e eficiência.

## 📊 Indicadores Planejados (KPIs)

### 1. Eficiência da Fábrica (OEE Simplificado)
- **O que é:** Percentual de itens produzidos vs. planejado no período.
- **Visualização:** Gauge chart ou progresso circular.

### 2. Identificação de Gargalos
- **O que é:** Identificar quais famílias de produtos ou tipos de itens costumam ficar mais tempo parados na Etapa 20.
- **Visualização:** Gráfico de barras (Recharts) ordenado por volume de atraso.

### 3. Alerta de Atrasos Críticos
- **O que é:** Listagem de pedidos que excederam o tempo médio de permanência em produção.
- **Visualização:** Cards de alerta com prioridade visual.

### 4. Tendência de Produção
- **O que é:** Volume de itens finalizados dia a dia na última semana.
- **Visualização:** Gráfico de linha (Area Chart).

## 🛠️ Requisitos Técnicos Futuros
- [ ] Criar endpoints de agregação no servidor (ou processar localmente via hooks).
- [ ] Implementar componentes de gráficos utilizando `recharts`.
- [ ] Definir "Metas de Produção" (campos que podem ser necessários no `db.json` ou Omie).

---
*Nota: Esta etapa será iniciada apenas após a consolidação das funcionalidades operacionais de base.*
