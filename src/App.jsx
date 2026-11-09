
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

// Clave del historial
const HISTORY_KEY = 'top-club-soccer-search-history';

// Posiciones presentes en los datos originales
const POSITIONS = [
  ...new Set(players.map((player) => player.position))
];

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

function App() {
  // Estados de búsqueda
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Historial de búsquedas
  const [searchHistory, setSearchHistory] = useState(
    loadSearchHistory
  );

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

  // Calcular estadísticas y distribución por posición
  const stats = useMemo(() => {
    const totalPlayers = filteredPlayers.length;

    // Contar jugadores de cada posición
    const positionCounts = filteredPlayers.reduce(
      (counts, player) => {
        counts[player.position] =
          (counts[player.position] || 0) + 1;

        return counts;
      },
      {}
    );

    // Construir distribución con sus porcentajes
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

    // Caso sin resultados
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

    // Encontrar al máximo goleador
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

  // Registrar búsquedas después del debounce
  useEffect(() => {
    const newSearch = debouncedSearch.trim();

    if (newSearch.length === 0) {
      return;
    }

    setSearchHistory((previousHistory) => {
      const normalizedSearch = newSearch
        .toLocaleLowerCase('es');

      // Evitar actualizaciones innecesarias
      if (
        previousHistory[0]?.toLocaleLowerCase('es') ===
        normalizedSearch
      ) {
        return previousHistory;
      }

      // Eliminar búsquedas repetidas
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
      // La búsqueda funciona incluso cuando
      // el almacenamiento no está disponible.
    }
  }, [searchHistory]);

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedSearch('');
  };

  // Seleccionar búsqueda del historial
  const handleSelectSearch = (search) => {
    setSearchValue(search);
  };

  // Limpiar historial
  const handleClearHistory = () => {
    setSearchHistory([]);
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
    />
  );
}

export default App;
