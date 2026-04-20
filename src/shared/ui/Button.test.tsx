import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeDefined();
  });

  it('renders loading state', () => {
    render(<Button isLoading>Processando</Button>);
    expect(screen.queryByText('Processando')).toBeDefined();
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Enviar</Button>);
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
