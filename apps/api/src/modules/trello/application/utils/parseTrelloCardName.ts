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

  if (parts.length < 2) {
    return null;
  }

  // A última parte deve ser a quantidade, podendo terminar em 'un', 'um', 'b', 'g' ou 'kg'
  const lastPart = parts[parts.length - 1];
  const quantityMatch = lastPart.match(/^(\d+(?:[.,]\d+)?)\s*(un|um|b|g|kg)$/i);
  
  if (!quantityMatch) {
    // Se a última parte não for quantidade, talvez o formato esteja incompleto
    return null;
  }

  const quantity = parseFloat(quantityMatch[1].replace(',', '.'));
  if (isNaN(quantity)) return null;

  // Se temos pelo menos 3 partes: Nome - Lote - Qtd ou Nome - Código - Lote - Qtd
  if (parts.length >= 3) {
    const lastIdx = parts.length - 1;
    
    // Formato: Nome - Código - Lote - Qtd (4 partes)
    if (parts.length === 4) {
      return {
        name: parts[0],
        code: parts[1],
        lot: parts[2],
        quantity
      };
    }

    // Formato: Nome - Lote - Qtd (3 partes)
    // Se o usuário usa apenas Código - Lote - Qtd, o 'name' aqui será o código
    return {
      name: parts[0],
      lot: parts[1],
      quantity
    };
  }

  // Se temos apenas 2 partes: Nome - Qtd
  return {
    name: parts[0],
    lot: '', 
    quantity
  };
}
