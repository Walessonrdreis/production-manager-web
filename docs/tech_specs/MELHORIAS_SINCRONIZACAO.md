# Plano de Melhorias Técnicas: Sincronização API Render ↔ Firebase

**Data:** 08/05/2026
**Objetivo:** Padronizar e otimizar o fluxo de sincronização de dados entre a API Externa (Render) e o Banco de Dados Local/Cloud (Firebase), garantindo alta disponibilidade, dados atualizados a cada 10 minutos e uma experiência fluida no frontend.

## 1. Arquitetura Proposta

### 1.1 Sincronização em Background (Job/Cron)
A aplicação backend deve possuir rotinas automatizadas (Cron Jobs ou `setInterval` na inicialização do bootstrap da API) que rodam a cada **10 minutos**. 
* **O que faz:** Busca dados atualizados da API do Render (Orders, Products, Sectors, etc.) e os salva/atualiza diretamente no banco de dados do Firebase.
* **Vantagem:** O frontend passará a consumir 100% dos dados a partir do Firebase, que é mais rápido (cache local/nuvem) e não sofre com rate limits diretos ou indisponbilidades curtas da API do Render.

### 1.2 Mutações de Sincronização Manual (Manual Sync)
Em recursos onde a atualização precisa ser síncrona/imediatizada pela ação do usuário (ex: botão "Sincronizar" na aba Orders).
* **O que faz:** O frontend faz uma chamada para nossa própria API local (node, rota: `POST /api/sync/orders`). Nossa API busca novamente os dados na API do Render, atualiza o Firebase, e retorna sucesso (ou as novas entidades).
* **Vantagem:** O cache Query do frontend (`React Query` invalidations) é acionado imediatamente, trazendo a nova lista salva do Firebase instantaneamente para a tela.

### 1.3 Padronização em Todo o Projeto (Render API)
Todas as integrações atuais que consomem e interagem com a API do Render devem seguir a arquitetura definida. Isso inclui:
- Orders (`/admin/orders`)
- Products
- Customers
- Goals/Planning (onde couber dados remotos da Omie/Render)
- Dashboard Stage20 / Totals

## 2. Sugestões Adicionais de Melhoria

1. **Sincronização Delta (Timestamp):**
   - Ao invés de buscar a lista completa (500 itens) a cada 10 minutos, gravar uma configuração (no Firebase ou Cache em memória) de `lastSyncAt`. Injetar esse parâmetro na pesquisa do Render (caso a API suporte pesquisa por data de alteração). Isso gasta menos banda e acelera o processamento.

2. **Tratamento de Contensão e Retentativas (Backoff):**
   - Se a API do Render der Timeout ou `502 Bad Gateway` (como ocorreu recentemente com o validation error do limite 500 no pageSize), o Sync em background deve ter um `retry` silencioso e não invalidar os dados locais do Firebase.

3. **Webhooks vs Polling:**
   - Se possuirmos controle sobre a API do Render, o mais ideal arquiteturalmente seria enviar um Webhook para nossa aplicação AI Studio sempre que um recurso (Pedido) fosse criado/atualizado na Omie. Isso reduz o custo de polling a cada 10min. No momento, o Polling de 10 minutos é uma ótima abordagem e mais simples de implementar.

4. **Isolamento via Casos de Uso (DDD/Clean Arch):**
   - Na estruturação atual do projeto, cada módulo deve ter seu próprio SyncUseCase (`SyncOrdersUseCase`, `SyncProductsUseCase`). Eles serão instanciados pelo `CronJob` no processo background do node, ou invocados manualmente pelo Controller das rotas.

5. **Acompanhamento Visual de Sincronização:**
   - Adicionar uma tag indicando a hora da última sincronização bem sucedida no rodapé ou cabeçalho do UI (ex: `Última sincronização há 3 min`).

## 3. Próximos Passos
- Refatorar a chamada de Orders no frontend e transferir todo peso para a leitura Firebase.
- Criar a camada de Cron (ex: biblioteca `node-cron` ou scheduler embarcado) no bootstrap server.
- Estender esse fluxo gradativamente para demais módulos.
