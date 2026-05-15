# Documento de Regras de Negócio

## 1. Cabeçalho
- **Versão:** v1.0.0
- **Data:** 2026-05-13
- **Status:** DRAFT / PENDENTE DE PREENCHIMENTO
- **Escopo:** Este documento define as regras de domínio, limites de negócio e políticas da aplicação. Ele NÃO cobre detalhes técnicos de implementação, arquitetura de software intrínseca ou decisões exclusivas de infraestrutura.
- **Fonte das informações:** Decisões explicitadas pelo usuário e documentação de requisitos. (NÃO inferido do código-fonte).
- **Observação de soberania:** A API define as regras e limites de negócio. O Frontend atua apenas como consumidor (cliente) destas regras e estado. A validação real sempre ocorre no backend.

## 2. Glossário
*(Espaço reservado para termos específicos do domínio do negócio)*
- [PENDENTE]

## 3. Princípios Gerais de Negócio
*(Seção estrutural que guiará as regras do sistema)*
- [PENDENTE]

## 4. Regras de Negócio — API (SOBERANAS)
*(Seção dedicada exclusivamente ao comportamento do domínio central processado pelo backend)*
- [PENDENTE]

## 5. Regras de Integração Externa (API)
*(Seção para as diretrizes de comportamento de sistemas terceiros, ex: Trello, Omie, etc)*
- [PENDENTE]

## 6. Regras de Negócio — Frontend (DERIVADAS)
*(Seção para como o frontend reage às regras da API, sem redefinir domínio)*
- [PENDENTE]

## 7. Regras de Estabilidade e Proibições
*(Seção para regras intransigíveis de negócio, ex: "Nunca apagar X", "Nunca duplicar Y")*
- [PENDENTE]

## 8. Observabilidade (Logs)
*(Seção sobre quando eventos de negócio relevantes devem ser auditados/logados)*
- [PENDENTE]

## 9. PENDÊNCIAS PARA VALIDAÇÃO HUMANA
- Preencher os termos do domínio no Glossário.
- Definir e detalhar as regras da API.
- Definir e detalhar as regras de integrações.
- Mapear comportamentos esperados no Frontend baseados nos estados da API.
- Validar quais operações são absolutamente proibidas no sistema para a seção de Estabilidade.

## 10. Processo de Versionamento
- `README.md` sempre representa a versão **ATIVA** e vigente das regras.
- O diretório `versoes/` guarda cópias **IMUTÁVEIS** das versões anteriores.
- Toda alteração exige:
  1. Criação de um novo arquivo em `versoes/` (ex: `regras_negocio_v1.1.0.md`).
  2. Atualização completa do arquivo `README.md`.
  3. Registro do resumo de alterações no arquivo `changelog.md`.
- É estritamente **proibido** editar o conteúdo de versões antigas no diretório `versoes/`.
