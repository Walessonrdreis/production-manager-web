import { describe, it, expect } from 'vitest';
import { parseTrelloCardName } from '../parseTrelloCardName.js';

describe('parseTrelloCardName', () => {
  it('deve parsear o formato: nome - lote - 108 un', () => {
    const result = parseTrelloCardName('Porta de Vidro - LOTE123 - 108 un');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('Porta de Vidro');
    expect(result?.code).toBeUndefined();
    expect(result?.lot).toBe('LOTE123');
    expect(result?.quantity).toBe(108);
  });

  it('deve parsear o formato: nome - codigo - lote - 108 un', () => {
    const result = parseTrelloCardName('Janela - COD999 - LOTE456 - 50 un');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('Janela');
    expect(result?.code).toBe('COD999');
    expect(result?.lot).toBe('LOTE456');
    expect(result?.quantity).toBe(50);
  });

  it('deve parsear o formato: codigo - lote - 108 un', () => {
    // Como são 3 partes, o parser joga o primeiro valor para 'name', o que cumpre o MVP
    const result = parseTrelloCardName('COD123 - LOTE789 - 10 un');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('COD123');
    expect(result?.code).toBeUndefined();
    expect(result?.lot).toBe('LOTE789');
    expect(result?.quantity).toBe(10);
  });

  it('deve retornar null se faltar quantidade', () => {
    const result = parseTrelloCardName('Porta - LOTE123');
    expect(result).toBeNull();
  });

  it('deve retornar null se quantidade nao terminar com un', () => {
    const result = parseTrelloCardName('Porta - LOTE123 - 108 kg');
    expect(result).toBeNull();
  });

  it('deve retornar null para strings vazias ou nulas', () => {
    expect(parseTrelloCardName('')).toBeNull();
    expect(parseTrelloCardName(null as any)).toBeNull();
  });

  it('deve tratar espaços extras e diferentes capitalizações em un', () => {
    const result = parseTrelloCardName('  Espelho  -  LT99  -  12   UN  ');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('Espelho');
    expect(result?.lot).toBe('LT99');
    expect(result?.quantity).toBe(12);
  });

  it('deve reconstruir nomes que contêm o separador (-) mas excedem 4 partes', () => {
    const result = parseTrelloCardName('Porta - Dupla - Cinza - C10 - LT5 - 20 un');
    expect(result).not.toBeNull();
    // 6 partes no total
    // Qtd: 20 un (última)
    // Lot: LT5 (penúltima)
    // Code: C10 (antepenúltima)
    // Name: Porta - Dupla - Cinza (resto)
    expect(result?.name).toBe('Porta - Dupla - Cinza');
    expect(result?.code).toBe('C10');
    expect(result?.lot).toBe('LT5');
    expect(result?.quantity).toBe(20);
  });
});
