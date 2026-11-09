
import PlayerRow from './PlayerRow';
import '../styles/player-table.css';

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
  selectedPlayerId = null
}) {
  const selectedPlayer = players.find(
    (player) => player.id === selectedPlayerId
  );

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

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return '';
    }

    if (sortConfig.direction === 'asc') {
      return ' ▲';
    }

    if (sortConfig.direction === 'desc') {
      return ' ▼';
    }

    return '';
  };

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

  return (
    <div className="player-table">
      <div className="player-table__header">
        <h2 className="player-table__title">
          Listado de jugadores
        </h2>

        <span className="player-table__count">
          {players.length}{' '}
          {players.length === 1 ? 'jugador' : 'jugadores'}
        </span>
      </div>

      <div className="dashboard__table-container player-table__container">
        <table className="dashboard__table player-table__table">
          <thead>
            <tr>
              <th scope="col">FAV</th>

              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    onSort
                      ? getAriaSort(column.key)
                      : undefined
                  }
                >
                  {onSort ? (
                    <button
                      className="player-table__sort-button"
                      type="button"
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      {getSortIndicator(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
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
