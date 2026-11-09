
import SearchBar from './SearchBar';
import SearchHistory from './SearchHistory';
import StatsPanel from './StatsPanel';
import PlayerTable from './PlayerTable';
import '../styles/dashboard.css';
import '../styles/pagination-preview.css';

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
  onItemsPerPageChange
}) {
  return (
    <div className="dashboard">
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
          disabled
        >
          Cambiar tema
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
            darkMode={true}
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
          <PlayerTable
            players={players}
            onRowClick={onPlayerSelect}
            selectedPlayerId={selectedPlayerId}
            darkMode={true}
            sortConfig={sortConfig}
            onSort={onSort}
          />

          <div className="pagination-preview">
            <div className="pagination-preview__settings">
              <label
                className="pagination-preview__label"
                htmlFor="items-per-page"
              >
                Jugadores por página:
              </label>

              <select
                id="items-per-page"
                className="pagination-preview__select"
                value={pagination.itemsPerPage}
                onChange={(event) => {
                  onItemsPerPageChange(event.target.value);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <p
              className="pagination-preview__summary"
              role="status"
            >
              Mostrando {pagination.rangeStart}–
              {pagination.rangeEnd} de {pagination.totalItems}
            </p>

            <nav
              className="pagination-preview__navigation"
              aria-label="Navegación entre páginas"
            >
              <button
                className="pagination-preview__button"
                type="button"
                onClick={() => onPageChange(
                  pagination.currentPage - 1
                )}
                disabled={pagination.currentPage <= 1}
              >
                Anterior
              </button>

              <span className="pagination-preview__page">
                Página {pagination.totalPages === 0
                  ? 0
                  : pagination.currentPage}
                {' de '}
                {pagination.totalPages}
              </span>

              <button
                className="pagination-preview__button"
                type="button"
                onClick={() => onPageChange(
                  pagination.currentPage + 1
                )}
                disabled={
                  pagination.totalPages === 0 ||
                  pagination.currentPage >= pagination.totalPages
                }
              >
                Siguiente
              </button>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
