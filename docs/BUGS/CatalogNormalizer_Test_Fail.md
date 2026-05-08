# Problema: Falha no Teste do CatalogNormalizer

## Descrição do Problema
Durante a verificação da aplicação, identificou-se que um dos testes unitários pertencentes ao domínio do catálogo de produtos está quebrando. O arquivo `src/features/catalog/domain/__tests__/CatalogNormalizer.test.ts` falha no teste `should normalize product with various field mappings` com erro de asserção.

**Erro Apresentado:**
```
AssertionError: expected { id: '123', code: 'C001', …(7) } to deeply equal { id: '123', code: 'C001', …(6) }

- Expected
+ Received

  {
    "code": "C001",
    "description": "Product One",
    "family": "Fam 1",
    "id": "123",
+   "minStock": 0,
    "price": 50.5,
-   "sectorId": undefined,
+   "sectorIds": [],
    "stock": 10,
    "unit": "UN",
  }
```

O test runner indica que a função `normalizeProduct` agora devolve `minStock` (que o teste não esperava) e `sectorIds: []` ao invés de `sectorId: undefined`. Isso ocorreu porque a interface ou as propriedades mapeadas de `Product` mudaram com o tempo durante as atualizações (por exemplo, a alteração de `sectorId` string único para um array de `sectorIds`, ou a introdução do campo `minStock`), mas o respectivo mock no teste (`CatalogNormalizer.test.ts`) não foi atualizado para acompanhar a evolução do contrato.

Aguardando sua decisão para proceder com a correção no teste ou na lógica de mapemento.
