# Documentação de Páginas / Views

Este diretório armazena a documentação estrutural e funcional de cada tela (página) do sistema.
O objetivo é servir como fonte de consulta rápida sobre:
- O que a página faz.
- Quais componentes e hooks ela utiliza.
- Quais regras de negócio específicas são aplicadas localmente.

## Regra para Criação de Documentos

Sempre que uma nova tela for mapeada, o documento deve ser nomeado com o slug da página (ex: `production-control.md`) e **deve obrigatoriamente seguir a estrutura do template abaixo.**

## Regra de Versionamento e Histórico (OBRIGATÓRIO)

Toda vez que uma nova interface/página for criada ou caso o fluxo de interface de uma página já existente sofra refatoração pesada:
1. O arquivo respectivo na raiz de `docs/paginas/` deve ser atualizado.
2. É **obrigatório** adotar versionamento SemVer (v1.0.0, v1.1.0, etc.) no título ou cabeçalho físico do arquivo.
3. Antes de modificar a documentação base existente (refatoração), o estado anterior **deve** ser arquivado (copiado) em um subdiretório de histórico. O diretório deve seguir o padrão: `docs/paginas/historico_[nome_da_pagina]/`.
4. O arquivo de histórico preservado recebe o nome da versão antiga no seu próprio arquivo (ex: `docs/paginas/historico_production-control/v1.0.0.md`).

---

# TEMPLATE DE TELA

Copie e cole a estrutura abaixo ao iniciar um novo mapeamento de página:

```markdown
# [Nome da Página / View] - v1.0.0

## 1. Visão Geral
- **Objetivo**: [Qual o propósito principal desta tela?]
- **Rota/Caminho**: [A URL onde esta tela é acessada, ex: `/production-control`]
- **Arquivo Principal**: [Caminho do arquivo root no projeto]

## 2. Componentes Principais (UI)
- **[Nome do Componente]**: [Sua principal responsabilidade dentro da tela]

## 3. Integrações e Hooks (State)
- **`[useAlgumaCoisa]`**: [Explicação de qual tipo de dado o hook busca ou manipula]
- **Mutações (Ações)**: [Quais as principais ações possíveis — Criar, Editar, Excluir, Sincronizar]

## 4. Regras de Negócio de Tela (Lógica Local)
- **[Regra A]**: [Descrever comportamentos locais, como como uma lista é filtrada na interface, se calcula valores ou se esconde seções baseadas em estados.]

## 5. Permissões / Acesso
- **Público / Autenticado**: [Quem visualiza esta tela]

## 6. Histórico de Versões e Observações
- **v1.0.0**: [Data] - Versão inicial documentada.
- [Qualquer detalhe importante. Ex: "A sincronização aqui usa o conceito Network-First e salva silenciosamente."]
```
