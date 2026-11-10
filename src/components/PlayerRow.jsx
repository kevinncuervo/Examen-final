
function PlayerRow({
  player,
  index,
  onClick,
  isFavorite = false,
  onToggleFavorite,
  darkMode = true,
  colorClass = '',
  isSelected = false
}) {
  // Clases CSS de la fila
  const rowClass = [
    'player-table__row',
    darkMode
      ? 'player-table__row--dark'
      : 'player-table__row--light',
    index % 2 === 0
      ? 'player-table__row--even'
      : 'player-table__row--odd',
    isSelected
      ? 'player-table__row--selected'
      : '',
    colorClass
  ].filter(Boolean).join(' ');

  // Abrir los detalles del jugador
  const handleRowClick = () => {
    onClick?.(player);
  };

  // Permitir abrir el jugador con teclado
  const handleRowKeyDown = (event) => {
    // No intervenir en las teclas de botones internos
    if (event.target !== event.currentTarget) {
      return;
    }

    if (!onClick) {
      return;
    }

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      onClick(player);
    }
  };

  // Marcar o desmarcar favorito
  const handleFavoriteClick = (event) => {
    event.stopPropagation();

    onToggleFavorite?.(player.id);
  };

  return (
    <tr
      className={rowClass}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      tabIndex={onClick ? 0 : undefined}
      aria-describedby={
        onClick
          ? 'player-table-keyboard-help'
          : undefined
      }
    >
      <td className="player-table__favorite-cell">
        {onToggleFavorite ? (
          <button
            className="player-table__favorite-button"
            type="button"
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite
                ? `Quitar ${player.name} de favoritos`
                : `Agregar ${player.name} a favoritos`
            }
            aria-pressed={isFavorite}
            title={
              isFavorite
                ? 'Quitar de favoritos'
                : 'Agregar a favoritos'
            }
          >
            <span aria-hidden="true">
              {isFavorite ? '★' : '☆'}
            </span>
          </button>
        ) : (
          <span
            className="player-table__favorite-placeholder"
            aria-hidden="true"
          >
            ☆
          </span>
        )}
      </td>

      <td>
        <button
          className="player-table__name-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.(player);
          }}
          aria-label={`Ver detalles de ${player.name}`}
        >
          {player.name}
        </button>
      </td>

      <td>{player.club}</td>
      <td>{player.position}</td>
      <td>{player.country}</td>

      <td className="player-table__number">
        {player.age}
      </td>

      <td className="player-table__number">
        {player.goals}
      </td>

      <td className="player-table__number">
        {player.assists}
      </td>

      <td className="player-table__rating">
        {player.rating.toFixed(1)}
      </td>
    </tr>
  );
}

export default PlayerRow;
