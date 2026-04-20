import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders title and description', () => {
    render(<Card title="Teste Card" description="Descricao do card">Conteudo</Card>);
    expect(screen.getByText('Teste Card')).toBeDefined();
    expect(screen.getByText('Descricao do card')).toBeDefined();
    expect(screen.getByText('Conteudo')).toBeDefined();
  });
});
