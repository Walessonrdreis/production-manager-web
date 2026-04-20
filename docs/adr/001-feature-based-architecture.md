# ADR 001: Arquitetura Baseada em Features

## Status
Aceito

## Contexto
O projeto precisa de uma estrutura que permita o crescimento do sistema sem se tornar um emaranhado de arquivos difíceis de manter. Uma estrutura puramente técnica (folders like components, services, hooks) escala mal em projetos complexos.

## Decisão
Adotamos uma arquitetura modular inspirada em *Feature-Sliced Design* (simplificada):

1. **Features**: Cada pasta em `src/features` representa um domínio de negócio (ex: `products`, `orders`). Elas contêm sua própria lógica de API, componentes e hooks.
2. **Pages**: Localizadas em `src/pages`, elas são apenas montadoras de features.
3. **Shared**: Componentes agnósticos ao negócio e configurações de base (API client, UI kit).

## Consequências
- **Prós**: Facilidade em encontrar códigos relacionados a um negócio, isolamento de bugs, modularidade.
- **Contras**: Requer disciplina para não criar dependências circulares entre features.
