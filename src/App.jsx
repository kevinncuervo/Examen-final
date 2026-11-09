
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

// Clave del historial de búsquedas
const HISTORY_KEY = 'top-club-soccer-search-history';

// Cantidades permitidas por página
const PAGE_SIZE_OPTIONS = [5, 10, 20];

// Posiciones disponibles
const POSITIONS = [
  ...new Set(players.map((player) => player.position))
];

// Recuperar el historial desde localStorage
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

function App() {
  // Estados de búsqueda
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Historial de búsquedas
  const [searchHistory, setSearchHistory] = useState(
    loadSearchHistory
  );

  // Jugador seleccionado
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  // Configuración del ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'none'
  });

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Total de resultados después de aplicar filtros
  const totalItems = sortedPlayers.length;

  // Calcular el número de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Mantener siempre una página válida
  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, totalPages)
  );

  // Índice del primer jugador de la página
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  // Obtener los jugadores visibles
  const paginatedPlayers = useMemo(() => {
    return sortedPlayers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [sortedPlayers, startIndex, itemsPerPage]);

  // Calcular el rango visible
  const rangeStart = totalItems === 0
    ? 0
    : startIndex + 1;

  const rangeEnd = totalItems === 0
    ? 0
    : Math.min(startIndex + itemsPerPage, totalItems);

  // Información utilizada por la paginación
  const pagination = {
    currentPage: safeCurrentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    rangeStart,
    rangeEnd
  };

  // Cambiar la página actual
  const handlePageChange = (page) => {
    const validPage = Math.min(
      Math.max(1, Number(page)),
      Math.max(1, totalPages)
    );

    if (Number.isFinite(validPage)) {
      setCurrentPage(validPage);
    }
  };

  // Cambiar la cantidad de jugadores por página
  const handleItemsPerPageChange = (value) => {
    const newSize = Number(value);

    if (!PAGE_SIZE_OPTIONS.includes(newSize)) {
      return;
    }

    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  // Modificar la búsqueda
  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  // Limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  // Recuperar una búsqueda anterior
  const handleSelectSearch = (search) => {
    setSearchValue(search);
    setCurrentPage(1);
  };

  // Cambiar el ordenamiento
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

  // Registrar nuevas búsquedas
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

  // Guardar historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(searchHistory)
      );
    } catch {
      // La aplicación sigue funcionando si
      // el almacenamiento no está disponible.
    }
  }, [searchHistory]);

  // Limpiar historial
  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // Seleccionar un jugador de la tabla
  const handleSelectPlayer = (player) => {
    setSelectedPlayerId(player.id);
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
    />
  );
}

export default App;
