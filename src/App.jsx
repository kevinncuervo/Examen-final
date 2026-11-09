
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

// Clave utilizada para guardar el historial
const HISTORY_KEY = 'top-club-soccer-search-history';

// Recuperar el historial almacenado
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
  // Texto escrito por el usuario
  const [searchValue, setSearchValue] = useState('');

  // Búsqueda aplicada después de 300 ms
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Historial recuperado desde localStorage
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

  // Registrar búsquedas después del debounce
  useEffect(() => {
    const newSearch = debouncedSearch.trim();

    // No guardar búsquedas vacías
    if (newSearch.length === 0) {
      return;
    }

    setSearchHistory((previousHistory) => {
      const normalizedSearch = newSearch
        .toLocaleLowerCase('es');

      // Eliminar coincidencias anteriores
      const historyWithoutDuplicates =
        previousHistory.filter((search) => (
          search.toLocaleLowerCase('es') !==
          normalizedSearch
        ));

      // Guardar la búsqueda más reciente al inicio
      return [
        newSearch,
        ...historyWithoutDuplicates
      ].slice(0, 5);
    });
  }, [debouncedSearch]);

  // Persistir el historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(searchHistory)
      );
    } catch {
      // La búsqueda sigue funcionando si el
      // navegador no permite el almacenamiento.
    }
  }, [searchHistory]);

  // Limpiar el buscador
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedSearch('');
  };

  // Seleccionar una búsqueda anterior
  const handleSelectSearch = (search) => {
    setSearchValue(search);
  };

  // Borrar todo el historial
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
    />
  );
}

export default App;
