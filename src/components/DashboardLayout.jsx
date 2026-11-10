
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import SearchHistory from './SearchHistory';
import StatsPanel from './StatsPanel';
import FavoriteFilter from './FavoriteFilter';
import PlayerTable from './PlayerTable';
import Pagination from './Pagination';
import PlayerModal from './PlayerModal';
import '../styles/dashboard.css';
import '../styles/theme.css';
import '../styles/responsive.css';

// Clave para guardar el tema
const THEME_KEY = 'top-club-soccer-theme';

// Recuperar el tema guardado
function loadTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // Utilizar el tema predeterminado.
  }

  return 'dark';
}

function DashboardLayout({
  searchValue,
  onSearchChange,
  onSearchClear,
  resultsCount,
  searchHistory,
  onSelectSearch,
  onClearHistory,
  stats,
  players,
  selectedPlayerId,
  onPlayerSelect,
  sortConfig,
  onSort,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  rowColors,
  onRowColorsChange,
  favoriteIds,
  onToggleFavorite,
  onlyFavorites,
  onFavoritesFilterChange,
  selectedPlayer,
  onClosePlayerModal
}) {
  // Estado del tema
  const [theme, setTheme] = useState(loadTheme);

  const darkMode = theme === 'dark';

  // Actualizar el tema y guardarlo
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Continuar con el tema de la sesión.
    }
  }, [theme]);

  // Cambiar entre claro y oscuro
  const handleToggleTheme = () => {
    setTheme((previousTheme) => (
      previousTheme === 'dark'
        ? 'light'
        : 'dark'
    ));
  };

  return (
    <div className={`dashboard dashboard--${theme}`}>
      <header className="dashboard__header">
        <div className="dashboard__branding">
          <h1 className="dashboard__brand">
            TOP CLUB SOCCER
          </h1>

          <h2 className="dashboard__title">
            Dashboard de Jugadores
          </h2>

          <p className="dashboard__description">
            Explora las estadísticas de los mejores jugadores
            de fútbol del mundo.
          </p>
        </div>

        <button
          className="dashboard__theme-button"
          type="button"
          onClick={handleToggleTheme}
          aria-label={
            darkMode
              ? 'Activar tema claro'
              : 'Activar tema oscuro'
          }
          title={
            darkMode
              ? 'Cambiar al tema claro'
              : 'Cambiar al tema oscuro'
          }
        >
          <span
            className="dashboard__theme-icon"
            aria-hidden="true"
          >
            {darkMode ? '☀' : '☾'}
          </span>

          {darkMode ? 'Tema claro' : 'Tema oscuro'}
        </button>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__search">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            onClear={onSearchClear}
            resultsCount={resultsCount}
          />
        </section>

        <section className="dashboard__stats">
          <StatsPanel
            stats={stats}
            darkMode={darkMode}
          />
        </section>

        <section className="dashboard__history">
          <SearchHistory
            history={searchHistory}
            onSelectSearch={onSelectSearch}
            onClearHistory={onClearHistory}
          />
        </section>

        <section className="dashboard__players">
          <FavoriteFilter
            onlyFavorites={onlyFavorites}
            favoriteCount={favoriteIds.length}
            onToggle={onFavoritesFilterChange}
          />

          <PlayerTable
            players={players}
            onRowClick={onPlayerSelect}
            selectedPlayerId={selectedPlayerId}
            darkMode={darkMode}
            sortConfig={sortConfig}
            onSort={onSort}
            rowColors={rowColors}
            onRowColorsChange={onRowColorsChange}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
          />

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            itemsPerPage={pagination.itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            totalItems={pagination.totalItems}
          />
        </section>
      </main>

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          isFavorite={favoriteIds.includes(selectedPlayer.id)}
          onClose={onClosePlayerModal}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
