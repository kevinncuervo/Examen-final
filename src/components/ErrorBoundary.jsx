
import { Component } from 'react';
import '../styles/error-boundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  // Detectar errores de renderizado
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  // Mostrar los detalles técnicos en la consola
  componentDidCatch(error, errorInfo) {
    console.error(
      'Error en TOP CLUB SOCCER:',
      error,
      errorInfo.componentStack
    );
  }

  // Recargar la aplicación
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="error-boundary"
          role="alert"
        >
          <div className="error-boundary__panel">
            <div
              className="error-boundary__icon"
              aria-hidden="true"
            >
              !
            </div>

            <h1 className="error-boundary__title">
              No se pudo mostrar el dashboard
            </h1>

            <p className="error-boundary__message">
              Ocurrió un error inesperado al mostrar
              uno de los componentes de TOP CLUB SOCCER.
            </p>

            <p className="error-boundary__description">
              Puedes intentar recargar la página.
              Si el problema continúa, revisa los
              mensajes de la consola del navegador
              para identificar el archivo que falló.
            </p>

            <button
              className="error-boundary__button"
              type="button"
              onClick={this.handleReload}
            >
              Recargar página
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
