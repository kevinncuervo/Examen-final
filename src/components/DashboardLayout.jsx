
import SearchBar from './SearchBar';
import SearchHistory from './SearchHistory';
import StatsPanel from './StatsPanel';
import PlayerTable from './PlayerTable';
import Pagination from './Pagination';
import '../styles/dashboard.css';

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
    </div>
  );
}

export default DashboardLayout;
