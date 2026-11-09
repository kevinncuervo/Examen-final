import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

const HISTORY_KEY = 'top-club-soccer-search-history';
const FAVORITES_KEY = 'top-club-soccer-favorites';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const POSITIONS = [
  ...new Set(players.map((player) => player.position))
];

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

// Recuperar favoritos almacenados
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

    // Conservar solo IDs válidos y sin duplicados
    return [...new Set(
      parsedFavorites.filter((id) => VALID_PLAYER_IDS.has(id))
    )];
  } catch {
    return [];
  }
}

function App() {
  // Estados de búsqueda
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Historial
  const [searchHistory, setSearchHistory] = useState(
    loadSearchHistory
  );

  // Favoritos persistentes
  const [favoriteIds, setFavoriteIds] = useState(
    loadFavorites
  );

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

  // Filtrar jugadores por nombre
  const filteredPlayers = useMemo(() => {
    const normalizedSearch = debouncedSearch
      .trim()
      .toLocaleLowerCase('es');

    return players.filter((player) => {
      const normalizedName = player.name
        .toLocaleLowerCase('es');

      return normalizedName.includes(normalizedSearch);
    });
  }, [debouncedSearch]);

  // Estadísticas y distribución por posición
  const stats = useMemo(() => {
    const totalPlayers = filteredPlayers.length;

    const positionCounts = filteredPlayers.reduce(
      (counts, player) => {
        counts[player.position] =
          (counts[player.position] || 0) + 1;

        return counts;
      },
      {}
    );

    const positionDistribution = POSITIONS.map((position) => {
      const count = positionCounts[position] || 0;

      const percentage = totalPlayers === 0
        ? 0
        : (count / totalPlayers) * 100;

      return {
        position,
        count,
        percentage
      };
    });

    if (totalPlayers === 0) {
      return {
        totalPlayers: 0,
        averageAge: 0,
        averageGoals: 0,
        topScorer: null,
        positionDistribution
      };
    }

    const totalAge = filteredPlayers.reduce(
      (total, player) => total + player.age,
      0
    );

    const totalGoals = filteredPlayers.reduce(
      (total, player) => total + player.goals,
      0
    );

    const topScorer = filteredPlayers.reduce(
      (bestPlayer, currentPlayer) => (
        currentPlayer.goals > bestPlayer.goals
          ? currentPlayer
          : bestPlayer
      ),
      filteredPlayers[0]
    );

    return {
      totalPlayers,
      averageAge: totalAge / totalPlayers,
      averageGoals: totalGoals / totalPlayers,
      topScorer,
      positionDistribution
    };
  }, [filteredPlayers]);

  // Ordenar los jugadores filtrados
  const sortedPlayers = useMemo(() => {
    const { key, direction } = sortConfig;

    if (key === null || direction === 'none') {
      return filteredPlayers;
    }

    const multiplier = direction === 'asc' ? 1 : -1;

    const indexedPlayers = filteredPlayers.map(
      (player, index) => ({
        player,
        originalIndex: index
      })
    );

    indexedPlayers.sort((first, second) => {
      const firstValue = first.player[key];
      const secondValue = second.player[key];

      let comparison = 0;

      if (
        typeof firstValue === 'number' &&
        typeof secondValue === 'number'
      ) {
        comparison = firstValue - secondValue;
      } else {
        comparison = String(firstValue).localeCompare(
          String(secondValue),
          'es',
          { sensitivity: 'base' }
        );
      }

      if (comparison === 0) {
        return first.originalIndex - second.originalIndex;
      }

      return comparison * multiplier;
    });

    return indexedPlayers.map(({ player }) => player);
  }, [filteredPlayers, sortConfig]);

  // Paginación
  const totalItems = sortedPlayers.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, totalPages)
  );

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedPlayers = useMemo(() => {
    return sortedPlayers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [sortedPlayers, startIndex, itemsPerPage]);

  const rangeStart = totalItems === 0
    ? 0
    : startIndex + 1;

  const rangeEnd = totalItems === 0
    ? 0
    : Math.min(startIndex + itemsPerPage, totalItems);

  const pagination = {
    currentPage: safeCurrentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    rangeStart,
    rangeEnd
  };

  // Cambiar página
  const handlePageChange = (page) => {
    const validPage = Math.min(
      Math.max(1, Number(page)),
      Math.max(1, totalPages)
    );

    if (Number.isFinite(validPage)) {
      setCurrentPage(validPage);
    }
  };

  // Cambiar registros por página
  const handleItemsPerPageChange = (value) => {
    const newSize = Number(value);

    if (!PAGE_SIZE_OPTIONS.includes(newSize)) {
      return;
    }

    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  // Cambiar búsqueda
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

  // Seleccionar una búsqueda del historial
  const handleSelectSearch = (search) => {
    setSearchValue(search);
    setCurrentPage(1);
  };

  // Ordenar columnas
  const handleSort = (key) => {
    setSortConfig((previousConfig) => {
      if (previousConfig.key !== key) {
        return {
          key,
          direction: 'asc'
        };
      }

      if (previousConfig.direction === 'asc') {
        return {
          key,
          direction: 'desc'
        };
      }

      if (previousConfig.direction === 'desc') {
        return {
          key: null,
          direction: 'none'
        };
      }

      return {
        key,
        direction: 'asc'
      };
    });

    setCurrentPage(1);
  };

  // Registrar búsquedas
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
      // El buscador puede funcionar sin almacenamiento.
    }
  }, [searchHistory]);

  // Guardar favoritos cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favoriteIds)
      );
    } catch {
      // Los favoritos siguen funcionando mientras
      // la aplicación permanezca abierta.
    }
  }, [favoriteIds]);

  // Agregar o quitar un jugador favorito
  const handleToggleFavorite = (playerId) => {
    if (!VALID_PLAYER_IDS.has(playerId)) {
      return;
    }

    setFavoriteIds((previousFavorites) => {
      if (previousFavorites.includes(playerId)) {
        return previousFavorites.filter(
          (id) => id !== playerId
        );
      }

      return [...previousFavorites, playerId];
    });
  };

  // Limpiar historial
  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // Seleccionar jugador
  const handleSelectPlayer = (player) => {
    setSelectedPlayerId(player.id);
  };

  // Cambiar modo de coloreo
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
    />
  );
}

export default App;
