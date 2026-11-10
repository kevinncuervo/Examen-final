
import '../styles/player-modal.css';

function PlayerModal({
  player,
  isFavorite = false,
  onClose
}) {
  if (!player) {
    return null;
  }

  return (
    <div className="player-modal__overlay">
      <button
        className="player-modal__backdrop"
        type="button"
        onClick={onClose}
        aria-label="Cerrar detalles del jugador"
        title="Cerrar ventana"
      />

      <section
        className="player-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-modal-title"
        aria-describedby="player-modal-description"
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
            onClick={onClose}
            aria-label="Cerrar detalles"
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
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </section>
    </div>
  );
}

export default PlayerModal;
