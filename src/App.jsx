import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

// Clave del historial de búsquedas
const HISTORY_KEY = 'top-club-soccer-search-history';

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

  // Debounce de 300 milisegundos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  // Filtrar jugadores exclusivamente por nombre
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

  // Calcular estadísticas y distribución por posición
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

    // Restaurar el orden original si no hay ordenamiento
    if (key === null || direction === 'none') {
      return filteredPlayers;
    }

    // Determinar la dirección del ordenamiento
    const multiplier = direction === 'asc' ? 1 : -1;

    // Incorporar índice original para orden estable
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

      // Comparar correctamente los valores numéricos
      if (
        typeof firstValue === 'number' &&
        typeof secondValue === 'number'
      ) {
        comparison = firstValue - secondValue;
      } else {
        // Comparar textos respetando el idioma español
        comparison = String(firstValue).localeCompare(
          String(secondValue),
          'es',
          { sensitivity: 'base' }
        );
      }

      // Mantener el orden original en caso de empate
      if (comparison === 0) {
        return first.originalIndex - second.originalIndex;
      }

      return comparison * multiplier;
    });

    return indexedPlayers.map(({ player }) => player);
  }, [filteredPlayers, sortConfig]);

  // Cambiar el ordenamiento al seleccionar una columna
  const handleSort = (key) => {
    setSortConfig((previousConfig) => {
      // Una columna nueva comienza en ascendente
      if (previousConfig.key !== key) {
        return {
          key,
          direction: 'asc'
        };
      }

      // Ascendente pasa a descendente
      if (previousConfig.direction === 'asc') {
        return {
          key,
          direction: 'desc'
        };
      }

      // Descendente vuelve al orden original
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

  // Guardar el historial
  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(searchHistory)
      );
    } catch {
      // La aplicación continúa funcionando si
      // localStorage no está disponible.
    }
  }, [searchHistory]);

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedSearch('');
  };

  // Recuperar una búsqueda anterior
  const handleSelectSearch = (search) => {
    setSearchValue(search);
  };

  // Limpiar historial
  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  // Seleccionar un jugador
  const handleSelectPlayer = (player) => {
    setSelectedPlayerId(player.id);
  };

  return (
    <DashboardLayout
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onSearchClear={handleClearSearch}
      resultsCount={filteredPlayers.length}
      searchHistory={searchHistory}
      onSelectSearch={handleSelectSearch}
      onClearHistory={handleClearHistory}
      stats={stats}
      players={sortedPlayers}
      selectedPlayerId={selectedPlayerId}
      onPlayerSelect={handleSelectPlayer}
      sortConfig={sortConfig}
      onSort={handleSort}
    />
  );
}

export default App;
