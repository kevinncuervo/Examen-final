
import SearchBar from './SearchBar';
import SearchHistory from './SearchHistory';
import StatsPanel from './StatsPanel';
import '../styles/dashboard.css';

function DashboardLayout({
  searchValue,
  onSearchChange,
  onSearchClear,
  resultsCount,
  searchHistory,
  onSelectSearch,
  onClearHistory,
  stats
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
          <h2>Listado de jugadores</h2>

          <div className="dashboard__table-container">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>FAV</th>
                  <th>JUGADOR</th>
                  <th>CLUB</th>
                  <th>POSICIÓN</th>
                  <th>PAÍS</th>
                  <th>EDAD</th>
                  <th>GOLES</th>
                  <th>ASISTENCIAS</th>
                  <th>RATING</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan={9}>
                    La tabla interactiva se implementará
                    en una próxima etapa.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
