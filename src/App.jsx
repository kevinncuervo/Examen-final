
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { players } from './data/players';

function App() {
  // Texto que escribe el usuario
  const [searchValue, setSearchValue] = useState('');

  // Texto que se aplicará después de 300 ms
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Aplicar debounce de 300 milisegundos
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

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedSearch('');
  };

  return (
    <DashboardLayout
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onSearchClear={handleClearSearch}
      resultsCount={filteredPlayers.length}
    />
  );
}

export default App;
