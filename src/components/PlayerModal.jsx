
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import '../styles/player-modal.css';

function PlayerModal({
  player,
  isFavorite = false,
  onClose
}) {
  // Estado para la animación de salida
  const [isClosing, setIsClosing] = useState(false);

  // Referencias para controlar el foco
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Solicitar el cierre del modal
  const requestClose = useCallback(() => {
    if (isClosing) {
      return;
    }

    // Respetar la preferencia de reducir movimiento
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      onClose();
      return;
    }

    // Iniciar la animación de salida
    setIsClosing(true);
  }, [isClosing, onClose]);

  // Gestionar el foco y el desplazamiento del fondo
  useEffect(() => {
    const previousElement = document.activeElement;
    const appRoot = document.getElementById('root');

    const previousOverflow = document.body.style.overflow;
    const previousInert = appRoot?.inert ?? false;

    // Impedir interacción con el dashboard
    if (appRoot) {
      appRoot.inert = true;
    }

    // Evitar desplazamiento de la página de fondo
    document.body.style.overflow = 'hidden';

    // Enviar el foco al botón de cierre
    closeButtonRef.current?.focus();

    return () => {
      // Recuperar el estado anterior de la página
      document.body.style.overflow = previousOverflow;

      if (appRoot) {
        appRoot.inert = previousInert;
      }

      // Devolver el foco al elemento original
      if (
        previousElement instanceof HTMLElement &&
        previousElement.isConnected
      ) {
        previousElement.focus();
      }
    };
  }, []);

  // Cerrar el modal con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [requestClose]);

  // Esperar a que termine la animación de salida
  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isClosing, onClose]);

  // Mantener la navegación por teclado dentro del modal
  const handleTrapFocus = (event) => {
    if (event.key !== 'Tab' || !dialogRef.current) {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), ' +
        'input:not([disabled]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => (
      element.getClientRects().length > 0
    ));

    // Si no existen controles, enfocar el diálogo
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];

    const lastElement = focusableElements[
      focusableElements.length - 1
    ];

    const activeElement = document.activeElement;

    // Shift + Tab desde el primero vuelve al último
    if (
      event.shiftKey &&
      (
        activeElement === firstElement ||
        !dialogRef.current.contains(activeElement)
      )
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab desde el último vuelve al primero
    if (
      !event.shiftKey &&
      (
        activeElement === lastElement ||
        !dialogRef.current.contains(activeElement)
      )
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!player) {
    return null;
  }

  const overlayClass = isClosing
    ? 'player-modal__overlay player-modal__overlay--closing'
    : 'player-modal__overlay';

  // Portal fuera del dashboard para gestionar el foco
  return createPortal(
    <div className={overlayClass}>
      <button
        className="player-modal__backdrop"
        type="button"
        onClick={requestClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <section
        className="player-modal__dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-modal-title"
        aria-describedby="player-modal-description"
        onKeyDown={handleTrapFocus}
        tabIndex={-1}
      >
        <div className="player-modal__header">
          <div className="player-modal__heading">
            <span className="player-modal__eyebrow">
              Ficha del jugador · ID {player.id}
            </span>

            <h2
              className="player-modal__title"
              id="player-modal-title"
            >
              {player.name}
            </h2>

            <p
              className="player-modal__subtitle"
              id="player-modal-description"
            >
              Información deportiva y estadísticas
              del jugador seleccionado.
            </p>
          </div>

          <button
            className="player-modal__close"
            type="button"
            ref={closeButtonRef}
            onClick={requestClose}
            aria-label="Cerrar detalles del jugador"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="player-modal__body">
          <div className="player-modal__identity">
            <div
              className="player-modal__avatar"
              aria-hidden="true"
            >
              {player.name
                .split(' ')
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join('')
                .toUpperCase()}
            </div>

            <div className="player-modal__identity-info">
              <h3 className="player-modal__player-name">
                {player.name}
              </h3>

              <p className="player-modal__club">
                {player.club}
              </p>

              <span className="player-modal__position">
                {player.position}
              </span>
            </div>
          </div>

          <h3 className="player-modal__section-title">
            Información general
          </h3>

          <dl className="player-modal__details">
            <div className="player-modal__detail">
              <dt className="player-modal__detail-label">
                Club
              </dt>

              <dd className="player-modal__detail-value">
                {player.club}
              </dd>
            </div>

            <div className="player-modal__detail">
              <dt className="player-modal__detail-label">
                Posición
              </dt>

              <dd className="player-modal__detail-value">
                {player.position}
              </dd>
            </div>

            <div className="player-modal__detail">
              <dt className="player-modal__detail-label">
                País
              </dt>

              <dd className="player-modal__detail-value">
                {player.country}
              </dd>
            </div>

            <div className="player-modal__detail">
              <dt className="player-modal__detail-label">
                Edad
              </dt>

              <dd className="player-modal__detail-value">
                {player.age} años
              </dd>
            </div>
          </dl>

          <h3 className="player-modal__section-title">
            Estadísticas deportivas
          </h3>

          <div className="player-modal__stats">
            <div className="player-modal__stat">
              <span className="player-modal__stat-value">
                {player.goals}
              </span>

              <span className="player-modal__stat-label">
                Goles
              </span>
            </div>

            <div className="player-modal__stat">
              <span className="player-modal__stat-value">
                {player.assists}
              </span>

              <span className="player-modal__stat-label">
                Asistencias
              </span>
            </div>

            <div className="player-modal__stat">
              <span className="player-modal__stat-value">
                {player.rating.toFixed(1)}
              </span>

              <span className="player-modal__stat-label">
                Rating
              </span>
            </div>
          </div>

          <div className="player-modal__favorite-status">
            <span
              className="player-modal__favorite-icon"
              aria-hidden="true"
            >
              {isFavorite ? '★' : '☆'}
            </span>

            <span>
              {isFavorite
                ? 'Jugador marcado como favorito'
                : 'Jugador no marcado como favorito'}
            </span>
          </div>
        </div>

        <div className="player-modal__footer">
          <button
            className="player-modal__footer-button"
            type="button"
            onClick={requestClose}
          >
            Cerrar
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}

export default PlayerModal;
