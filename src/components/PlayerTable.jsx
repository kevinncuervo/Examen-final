import PlayerRow from './PlayerRow';
import RowColorControls from './RowColorControls';
import '../styles/player-table.css';
import '../styles/favorites.css';

const COLUMNS = [
  { key: 'name', label: 'JUGADOR' },
  { key: 'club', label: 'CLUB' },
  { key: 'position', label: 'POSICIÓN' },
  { key: 'country', label: 'PAÍS' },
  { key: 'age', label: 'EDAD' },
  { key: 'goals', label: 'GOLES' },
  { key: 'assists', label: 'ASISTENCIAS' },
  { key: 'rating', label: 'RATING' }
];

function PlayerTable({
  players,
  onRowClick,
  onSort,
  sortConfig = { key: null, direction: 'none' },
  darkMode = true,
  rowColors = 'none',
  onRowColorsChange,
  selectedPlayerId = null,
  favoriteIds = [],
  onToggleFavorite
}) {
  // Jugador seleccionado en la página actual
  const selectedPlayer = players.find(
    (player) => player.id === selectedPlayerId
  );

  // Colorear filas según su posición visible
  const getColorClass = (index) => {
    const rowNumber = index + 1;

    if (rowColors === 'even' && rowNumber % 2 === 0) {
      return 'player-table__row--highlight-even';
    }

    if (rowColors === 'odd' && rowNumber % 2 !== 0) {
      return 'player-table__row--highlight-odd';
    }

    return '';
  };

  // Indicador de ordenamiento
  const getSortIndicator = (key) => {
    if (
      sortConfig.key !== key ||
      sortConfig.direction === 'none'
    ) {
      return '↕';
    }

    if (sortConfig.direction === 'asc') {
      return '▲';
    }

    return '▼';
  };

  // Dirección accesible del ordenamiento
  const getAriaSort = (key) => {
    if (sortConfig.key !== key) {
      return 'none';
    }

    if (sortConfig.direction === 'asc') {
      return 'ascending';
    }

    if (sortConfig.direction === 'desc') {
      return 'descending';
    }

    return 'none';
  };

  // Descripción del siguiente ordenamiento
  const getSortLabel = (column) => {
    if (sortConfig.key !== column.key) {
      return `Ordenar ${column.label} de forma ascendente`;
    }

    if (sortConfig.direction === 'asc') {
      return `Ordenar ${column.label} de forma descendente`;
    }

    return `Restaurar orden original de ${column.label}`;
  };

  return (
    <div className="player-table">
      <div className="player-table__header">
        <h2 className="player-table__title">
          Listado de jugadores
        </h2>

        <div className="player-table__counts">
          <span className="player-table__count">
            {players.length}{' '}
            {players.length === 1 ? 'jugador' : 'jugadores'}
            {' en esta página'}
          </span>

          <span
            className="player-table__favorites-count"
            role="status"
            aria-live="polite"
          >
            ★ {favoriteIds.length}{' '}
            {favoriteIds.length === 1
              ? 'favorito'
              : 'favoritos'}
          </span>
        </div>
      </div>

      <RowColorControls
        mode={rowColors}
        onChange={onRowColorsChange}
      />

      <div className="dashboard__table-container player-table__container">
        <table className="dashboard__table player-table__table">
          <thead>
            <tr>
              <th scope="col">
                FAV
              </th>

              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={getAriaSort(column.key)}
                >
                  <button
                    className="player-table__sort-button"
                    type="button"
                    onClick={() => onSort?.(column.key)}
                    aria-label={getSortLabel(column)}
                    disabled={!onSort}
                  >
                    <span>{column.label}</span>

                    <span aria-hidden="true">
                      {getSortIndicator(column.key)}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {players.length === 0 ? (
              <tr>
                <td
                  className="player-table__empty"
                  colSpan={9}
                >
                  No se encontraron jugadores.
                </td>
              </tr>
            ) : (
              players.map((player, index) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  onClick={onRowClick}
                  isSelected={
                    selectedPlayerId === player.id
                  }
                  darkMode={darkMode}
                  colorClass={getColorClass(index)}
                  isFavorite={favoriteIds.includes(player.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedPlayer && (
        <p
          className="player-table__selection"
          role="status"
        >
          Jugador seleccionado:{' '}
          <strong>{selectedPlayer.name}</strong>
          {' — '}
          {selectedPlayer.club}
        </p>
      )}
    </div>
  );
}

export default PlayerTable;
