
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
  const rowClass = [
    'player-table__row',
    darkMode
      ? 'player-table__row--dark'
      : 'player-table__row--light',
    index % 2 === 0
      ? 'player-table__row--even'
      : 'player-table__row--odd',
    isSelected ? 'player-table__row--selected' : '',
    colorClass
  ].filter(Boolean).join(' ');

  const handleFavoriteClick = (event) => {
    event.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite(player.id);
    }
  };

  return (
    <tr
      className={rowClass}
      onClick={() => onClick?.(player)}
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
          >
            {isFavorite ? '★' : '☆'}
          </button>
        ) : (
          <span
            className="player-table__favorite-placeholder"
            title="Favoritos disponibles próximamente"
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
          aria-label={`Seleccionar a ${player.name}`}
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
