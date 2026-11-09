
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

// Claves de almacenamiento
const HISTORY_KEY = 'top-club-soccer-search-history';
const FAVORITES_KEY = 'top-club-soccer-favorites';

// Cantidades de jugadores por página
const PAGE_SIZE_OPTIONS = [5, 10, 20];

// Posiciones disponibles
const POSITIONS = [
  ...new Set(players.map((player) => player.position))
];

// Identificadores válidos de jugadores
const VALID_PLAYER_IDS = new Set(
  players.map((player) => player.id)
);

// Recuperar historial desde localStorage
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

// Recuperar favoritos desde localStorage
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
  // Estados del buscador
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Historial de búsquedas
  const [searchHistory, setSearchHistory] = useState(
    loadSearchHistory
  );

  // Lista persistente de favoritos
  const [favoriteIds, setFavoriteIds] = useState(
    loadFavorites
  );

  // Filtro para mostrar únicamente favoritos
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Jugador seleccionado
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  // Ordenamiento de columnas
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'none'
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Coloreo de filas
  const [rowColors, setRowColors] = useState('none');

  // Aplicar debounce de 300 milisegundos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  // Filtrar por nombre y por favoritos
  const filteredPlayers = useMemo(() => {
    const normalizedSearch = debouncedSearch
      .trim()
      .toLocaleLowerCase('es');

    return players.filter((player) => {
      // Buscar únicamente por nombre
      const normalizedName = player.name
        .toLocaleLowerCase('es');

      const matchesSearch = normalizedName.includes(
        normalizedSearch
      );

      // Validar si debe mostrarse por favoritos
      const matchesFavorites = (
        !onlyFavorites ||
        favoriteIds.includes(player.id)
      );

      return matchesSearch && matchesFavorites;
    });
  }, [debouncedSearch, onlyFavorites, favoriteIds]);

  // Calcular estadísticas dinámicas
  const stats = useMemo(() => {
    const totalPlayers = filteredPlayers.length;

    // Contar jugadores por posición
    const positionCounts = filteredPlayers.reduce(
      (counts, player) => {
        counts[player.position] =
          (counts[player.position] || 0) + 1;

        return counts;
      },
      {}
    );

    // Calcular distribución por posición
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

    // Manejar conjuntos vacíos
    if (totalPlayers === 0) {
      return {
        totalPlayers: 0,
        averageAge: 0,
        averageGoals: 0,
        topScorer: null,
        positionDistribution
      };
    }

    // Sumar edades
    const totalAge = filteredPlayers.reduce(
      (total, player) => total + player.age,
      0
    );

    // Sumar goles
    const totalGoals = filteredPlayers.reduce(
      (total, player) => total + player.goals,
      0
    );

    // Encontrar máximo goleador
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

  // Ordenar resultados filtrados
  const sortedPlayers = useMemo(() => {
    const { key, direction } = sortConfig;

    if (key === null || direction === 'none') {
      return filteredPlayers;
    }

    const multiplier = direction === 'asc' ? 1 : -1;

    // Conservar los índices originales
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

      // Comparación numérica
      if (
        typeof firstValue === 'number' &&
        typeof secondValue === 'number'
      ) {
        comparison = firstValue - secondValue;
      } else {
        // Comparación de textos
        comparison = String(firstValue).localeCompare(
          String(secondValue),
          'es',
          { sensitivity: 'base' }
        );
      }

      // Orden estable cuando hay empates
      if (comparison === 0) {
        return first.originalIndex - second.originalIndex;
      }

      return comparison * multiplier;
    });

    return indexedPlayers.map(({ player }) => player);
  }, [filteredPlayers, sortConfig]);

  // Calcular paginación
  const totalItems = sortedPlayers.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, totalPages)
  );

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  // Obtener jugadores de la página actual
  const paginatedPlayers = useMemo(() => {
    return sortedPlayers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [sortedPlayers, startIndex, itemsPerPage]);

  // Calcular rango de registros
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

  // Cambiar cantidad de registros por página
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

  // Seleccionar búsqueda del historial
  const handleSelectSearch = (search) => {
    setSearchValue(search);
    setCurrentPage(1);
  };

  // Activar o desactivar el filtro de favoritos
  const handleFavoritesFilterChange = (value) => {
    setOnlyFavorites(Boolean(value));
    setCurrentPage(1);
  };

  // Cambiar ordenamiento
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

  // Registrar búsquedas en historial
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

  // Guardar historial de búsquedas
  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(searchHistory)
      );
    } catch {
      // La aplicación funciona sin almacenamiento.
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
      // Los favoritos siguen disponibles
      // mientras la aplicación está abierta.
    }
  }, [favoriteIds]);

  // Marcar o desmarcar favorito
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
    />
  );
}

export default App;
