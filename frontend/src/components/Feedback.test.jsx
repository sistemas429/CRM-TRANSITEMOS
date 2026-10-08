import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorBanner, Loading, SuccessBanner } from './Feedback';

describe('Feedback', () => {
  it('ErrorBanner muestra el mensaje', () => {
    render(<ErrorBanner message="Falló la conexión" />);
    expect(screen.getByText(/Falló la conexión/)).toBeInTheDocument();
  });

  it('ErrorBanner no renderiza nada sin mensaje', () => {
    const { container } = render(<ErrorBanner message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('SuccessBanner muestra el mensaje', () => {
    render(<SuccessBanner message="Guardado" />);
    expect(screen.getByText(/Guardado/)).toBeInTheDocument();
  });

  it('Loading muestra el texto por defecto', () => {
    render(<Loading />);
    expect(screen.getByText(/Cargando/)).toBeInTheDocument();
  });
});






