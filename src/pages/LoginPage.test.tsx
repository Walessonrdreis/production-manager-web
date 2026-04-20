import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { AppProviders } from '../app/providers';

// Mock do useNavigate pois ele é usado dentro de LoginForm
const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('LoginPage', () => {
  it('deve renderizar o formulário de login corretamente', () => {
    render(
      <AppProviders>
        <LoginPage />
      </AppProviders>
    );

    expect(screen.getByText(/Acesse sua conta/i)).toBeDefined();
    expect(screen.getByLabelText(/E-mail de acesso/i)).toBeDefined();
    expect(screen.getByLabelText(/Senha/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Entrar no sistema/i })).toBeDefined();
  });

  it('deve mostrar erros de validação para campos vazios', async () => {
    render(
      <AppProviders>
        <LoginPage />
      </AppProviders>
    );

    fireEvent.click(screen.getByRole('button', { name: /Entrar no sistema/i }));

    await waitFor(() => {
      expect(screen.getByText(/E-mail inválido/i)).toBeDefined();
    });
  });

  it('deve realizar login com sucesso e redirecionar', async () => {
    render(
      <AppProviders>
        <LoginPage />
      </AppProviders>
    );

    fireEvent.change(screen.getByLabelText(/E-mail de acesso/i), {
      target: { value: 'admin@demo.com' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Entrar no sistema/i }));

    await waitFor(() => {
      // Verificamos se o toast de sucesso ou o redirecionamento foi chamado
      expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
