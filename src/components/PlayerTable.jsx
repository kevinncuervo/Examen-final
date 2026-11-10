
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
  // Identificar el jugador seleccionado
  const selectedPlayer = players.find(
    (player) => player.id === selectedPlayerId
  );

  // Obtener la clase de coloreo
  const getColorClass = (index) => {
    const rowNumber = index + 1;

    if (
      rowColors === 'even' &&
      rowNumber % 2 === 0
    ) {
      return 'player-table__row--highlight-even';
    }

    if (
      rowColors === 'odd' &&
      rowNumber % 2 !== 0
    ) {
      return 'player-table__row--highlight-odd';
    }

    return '';
  };

  // Indicador visual del ordenamiento
  const getSortIndicator = (key) => {
    if (
      sortConfig.key !== key ||
      sortConfig.direction === 'none'
    ) {
      return '↕';
    }

    return sortConfig.direction === 'asc'
      ? '▲'
      : '▼';
  };

  // Informar la siguiente acción del encabezado
  const getSortLabel = (column) => {
    if (sortConfig.key !== column.key) {
      return `Ordenar ${column.label} de forma ascendente`;
    }

    if (sortConfig.direction === 'asc') {
      return `Ordenar ${column.label} de forma descendente`;
    }

    return `Restaurar el orden original de ${column.label}`;
  };

  // Aplicar aria-sort solamente a la columna activa
  const getAriaSort = (key) => {
    if (
      sortConfig.key !== key ||
      sortConfig.direction === 'none'
    ) {
      return undefined;
    }

    return sortConfig.direction === 'asc'
      ? 'ascending'
      : 'descending';
  };

  // Describir el ordenamiento actual
  const getSortAnnouncement = () => {
    const column = COLUMNS.find(
      (item) => item.key === sortConfig.key
    );

    if (
      !column ||
      sortConfig.direction === 'none'
    ) {
      return 'Tabla en el orden original.';
    }

    const direction = sortConfig.direction === 'asc'
      ? 'ascendente'
      : 'descendente';

    return `Tabla ordenada por ${column.label}, de forma ${direction}.`;
  };

  return (
    <div className="player-table">
      <div className="player-table__header">
        <h2
          className="player-table__title"
          id="player-table-title"
        >
          Listado de jugadores
        </h2>

        <div className="player-table__counts">
          <span className="player-table__count">
            {players.length}{' '}
            {players.length === 1
              ? 'jugador'
              : 'jugadores'}
            {' en esta página'}
          </span>

          <span
            className="player-table__favorites-count"
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true">★</span>
            {' '}
            {favoriteIds.length}{' '}
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

      <p
        className="a11y-sr-only"
        id="player-table-keyboard-help"
      >
        Puedes recorrer las filas con la tecla Tab.
        Presiona Enter o Espacio sobre una fila
        para abrir sus detalles. También puedes
        utilizar el botón con el nombre del jugador.
        Las estrellas permiten marcar favoritos.
      </p>

      <p
        className="a11y-sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {getSortAnnouncement()}
      </p>

      <div
        className="dashboard__table-container player-table__container"
        role="region"
        aria-label="Tabla de jugadores con desplazamiento horizontal"
        tabIndex={0}
      >
        <table
          className="dashboard__table player-table__table"
          aria-labelledby="player-table-title"
          aria-describedby="player-table-keyboard-help"
        >
          <caption className="a11y-sr-only">
            Tabla con jugadores, clubes, posiciones,
            países, edades, goles, asistencias,
            calificaciones y favoritos.
          </caption>

          <thead>
            <tr>
              <th
                scope="col"
                aria-label="Favoritos"
              >
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
                  isFavorite={
                    favoriteIds.includes(player.id)
                  }
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
