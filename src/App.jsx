
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';
import {
  filterPlayers,
  calculateStats,
  sortPlayers,
  getNextSortConfig,
  paginatePlayers,
  toggleFavoriteIds
} from './utils/playerLogic.js';

// Claves utilizadas por localStorage
const HISTORY_KEY = 'top-club-soccer-search-history';
const FAVORITES_KEY = 'top-club-soccer-favorites';

// Opciones de paginación
const PAGE_SIZE_OPTIONS = [5, 10, 20];

// Posiciones originales
const POSITIONS = [
  ...new Set(players.map((player) => player.position))
];

// Identificadores válidos
const VALID_PLAYER_IDS = new Set(
  players.map((player) => player.id)
);

// Recuperar historial de búsquedas
function loadSearchHistory() {
  try {
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    if (!savedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(savedHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    const validHistory = parsedHistory
      .filter((search) => (
        typeof search === 'string' &&
        search.trim().length > 0
      ))
      .map((search) => search.trim());

    return validHistory
      .filter((search, index, history) => (
        history.findIndex((item) => (
          item.toLocaleLowerCase('es') ===
          search.toLocaleLowerCase('es')
        )) === index
      ))
      .slice(0, 5);
  } catch {
    return [];
  }
}

// Recuperar favoritos guardados
function loadFavorites() {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (!savedFavorites) {
      return [];
    }

    const parsedFavorites = JSON.parse(savedFavorites);

    if (!Array.isArray(parsedFavorites)) {
      return [];
    }

    return [
      ...new Set(
        parsedFavorites.filter((id) => (
          VALID_PLAYER_IDS.has(id)
        ))
      )
    ];
  } catch {
    return [];
  }
}

function App() {
  // Buscador
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Historial de búsquedas
  const [searchHistory, setSearchHistory] = useState(
    loadSearchHistory
  );

  // Favoritos
  const [favoriteIds, setFavoriteIds] = useState(
    loadFavorites
  );

  // Filtro de favoritos
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Jugador seleccionado
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  // Ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'none'
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Coloreo de filas
  const [rowColors, setRowColors] = useState('none');

  // Debounce de 300 milisegundos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  // Aplicar búsqueda y filtro de favoritos
  const filteredPlayers = useMemo(() => (
    filterPlayers(
      players,
      debouncedSearch,
      onlyFavorites,
      favoriteIds
    )
  ), [debouncedSearch, onlyFavorites, favoriteIds]);

  // Estadísticas sobre todos los resultados filtrados
  const stats = useMemo(() => (
    calculateStats(filteredPlayers, POSITIONS)
  ), [filteredPlayers]);

  // Ordenar jugadores filtrados
  const sortedPlayers = useMemo(() => (
    sortPlayers(filteredPlayers, sortConfig)
  ), [filteredPlayers, sortConfig]);

  // Paginar los resultados ya ordenados
  const paginationResult = useMemo(() => (
    paginatePlayers(
      sortedPlayers,
      currentPage,
      itemsPerPage
    )
  ), [sortedPlayers, currentPage, itemsPerPage]);

  // Separar jugadores y datos de paginación
  const {
    items: paginatedPlayers,
    ...pagination
  } = paginationResult;

  // Recuperar datos completos del jugador seleccionado
  const selectedPlayer = players.find(
    (player) => player.id === selectedPlayerId
  ) || null;

  // Cambiar página
  const handlePageChange = (page) => {
    const validPage = Math.min(
      Math.max(1, Number(page)),
      Math.max(1, pagination.totalPages)
    );

    if (Number.isFinite(validPage)) {
      setCurrentPage(validPage);
    }
  };

  // Cambiar cantidad de registros
  const handleItemsPerPageChange = (value) => {
    const newSize = Number(value);

    if (!PAGE_SIZE_OPTIONS.includes(newSize)) {
      return;
    }

    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  // Modificar búsqueda
  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  // Recuperar búsqueda anterior
  const handleSelectSearch = (search) => {
    setSearchValue(search);
    setCurrentPage(1);
  };

  // Activar o desactivar Solo favoritos
  const handleFavoritesFilterChange = (value) => {
    setOnlyFavorites(Boolean(value));
    setCurrentPage(1);
  };

  // Cambiar el ordenamiento de una columna
  const handleSort = (key) => {
    setSortConfig((previousConfig) => (
      getNextSortConfig(previousConfig, key)
    ));

    setCurrentPage(1);
  };

  // Registrar búsquedas después del debounce
  useEffect(() => {
    const newSearch = debouncedSearch.trim();

    if (newSearch.length === 0) {
      return;
    }

    setSearchHistory((previousHistory) => {
      const normalizedSearch = newSearch
        .toLocaleLowerCase('es');

      if (
        previousHistory[0]?.toLocaleLowerCase('es') ===
        normalizedSearch
      ) {
        return previousHistory;
      }

      const historyWithoutDuplicates =
        previousHistory.filter((search) => (
          search.toLocaleLowerCase('es') !==
          normalizedSearch
        ));

      return [
        newSearch,
        ...historyWithoutDuplicates
      ].slice(0, 5);
    });
  }, [debouncedSearch]);

  // Guardar historial
  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(searchHistory)
      );
    } catch {
      // El buscador funciona sin almacenamiento.
    }
  }, [searchHistory]);

  // Persistir favoritos
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoriteIds)
      );
    } catch {
      // Los favoritos continúan durante la sesión.
    }
  }, [favoriteIds]);

  // Marcar o desmarcar favoritos
  const handleToggleFavorite = (playerId) => {
    setFavoriteIds((previousFavorites) => (
      toggleFavoriteIds(
        previousFavorites,
        playerId,
        VALID_PLAYER_IDS
      )
    ));
  };

  // Limpiar historial
  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // Seleccionar un jugador para abrir el modal
  const handleSelectPlayer = (player) => {
    setSelectedPlayerId(player.id);
  };

  // Cerrar el modal
  const handleClosePlayerModal = () => {
    setSelectedPlayerId(null);
  };

  // Cambiar coloreo de filas
  const handleRowColorsChange = (mode) => {
    if (!['none', 'even', 'odd'].includes(mode)) {
      return;
    }

    setRowColors(mode);
  };

  return (
    <DashboardLayout
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onSearchClear={handleClearSearch}
      resultsCount={filteredPlayers.length}
      searchHistory={searchHistory}
      onSelectSearch={handleSelectSearch}
      onClearHistory={handleClearHistory}
      stats={stats}
      players={paginatedPlayers}
      selectedPlayerId={selectedPlayerId}
      onPlayerSelect={handleSelectPlayer}
      sortConfig={sortConfig}
      onSort={handleSort}
      pagination={pagination}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      rowColors={rowColors}
      onRowColorsChange={handleRowColorsChange}
      favoriteIds={favoriteIds}
      onToggleFavorite={handleToggleFavorite}
      onlyFavorites={onlyFavorites}
      onFavoritesFilterChange={handleFavoritesFilterChange}
      selectedPlayer={selectedPlayer}
      onClosePlayerModal={handleClosePlayerModal}
    />
  );
}

export default App;
