export interface ParsedTrelloCard {
  name?: string;
  code?: string;
  lot: string;
  quantity: number;
}

/**
 * Faz o parsing do nome do card do Trello.
 *
 * Formatos aceitos:
 * 1) nome - lote - 108 un
 * 2) nome - codigo - lote - 108 un
 * 3) codigo - lote - 108 un
 *
 * Regras:
 * - lote e quantidade são obrigatórios
 * - quantidade deve terminar com 'un'
 * - Retorna null no caso de erro sem lançar exceções.
 */
export function parseTrelloCardName(cardName: string): ParsedTrelloCard | null {
  if (!cardName || typeof cardName !== 'string') {
    return null;
  }

  // Separa e limpa os espaços
  const parts = cardName.split('-').map(p => p.trim()).filter(Boolean);

  if (parts.length < 3) {
    return null;
  }

  // A última parte deve ser a quantidade, terminando em 'un'
  const quantityPart = parts[parts.length - 1];
  const quantityMatch = quantityPart.match(/^(\d+)\s*un$/i);
  
  if (!quantityMatch) {
    return null;
  }

  const quantity = parseInt(quantityMatch[1], 10);
  if (isNaN(quantity)) {
    return null;
  }

  const lot = parts[parts.length - 2];

  if (parts.length === 3) {
    // Pode ser 'nome' ou 'codigo'. Colocamos em 'name' para uso genérico (MVP)
    return {
      name: parts[0],
      lot,
      quantity
    };
  }

  // Para 4 partes, assumimos que as últimas duas são qty e lot, 
  // a antepenúltima é o codigo, e o primeiro é o nome.
  // Se houver mais partes (ex: nome com hífen vazado), juntamos no nome.
  const code = parts[parts.length - 3];
  const name = parts.slice(0, parts.length - 3).join(' - ');

  return {
    name,
    code,
    lot,
    quantity
  };
}
