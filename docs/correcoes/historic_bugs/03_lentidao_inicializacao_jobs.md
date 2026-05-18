# Demora Extrema (Gargalo de CPU/Rede) na Inicialização e Renderização do Projeto

**Descrição do Bug:**
Ao retomar o projeto após um período de inatividade (ex: de um dia pro outro), a plataforma AI Studio apresentava lentidão extrema para abrir o React (processando em tela diversas vezes `Build` e `Render Start`). O gargalo inicial impedia o desenvolvimento ágil.

**Causa Raiz:**
No arquivo `apps/api/src/bootstrap/plugins/jobs.ts`, as rotinas de sincronismo do microserviço Render (`production-manager-api.onrender.com`) eram chamadas imediatamente após subir o servidor express Express, através da invocação de `runAllSyncs()`. 
Como o ambiente de container e o ambiente online free do Render possuem um *Cold Start* demorado (onde a Render pode levar de 50s a 90s para despertar dos domínios hibernados), o congestionamento da rede e do Event Loop do Node no momento do boot esgotavam os recursos ou causavam lentidão para o servidor `vite` (responsável pelo empacotamento frontend simultâneo) terminar seu preparo inicial.

**Como foi corrigido:**
O ciclo inicial `runAllSyncs()` que ficava pendurado sincronizando o catálogo e as ordens teve um *wrapping* assíncrono adicionado via `setTimeout(() => { runAllSyncs() }, 15000);`.
Com isso, o servidor do Vite é carregado sem impedimentos, o projeto libera a UI para o desenvolvedor de imediato, e as atualizações de banco de dados e APIs externas são empurradas para ocorrer 15 segundos após as funções principais estarem totalmente disponíveis.

**Como evitar no futuro:**
Ao idealizar CRONs e rotinas que efetuem sincronismos com a API, certificar-se de nunca amarrá-los ao start bruto dos recursos primários em ambiente Sandbox/Dev. O delay assíncrono garante um *boot* saudável.
