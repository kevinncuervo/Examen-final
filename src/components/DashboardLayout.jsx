import '../styles/dashboard.css';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__branding">
          <h1 className="dashboard__brand">TOP CLUB SOCCER</h1>
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
          <h2>Buscar jugadores</h2>

          <input
            className="dashboard__search-input"
            type="text"
            placeholder="Buscar jugador por nombre..."
            aria-label="Buscar jugador por nombre"
            disabled
          />

          <p>Resultados: 0</p>
        </section>

        <section className="dashboard__stats">
          <h2>Estadísticas generales</h2>

          <div className="dashboard__stats-grid">
            <article className="dashboard__stat-card">
              <h3>Total de jugadores</h3>
              <p>—</p>
            </article>

            <article className="dashboard__stat-card">
              <h3>Promedio de edad</h3>
              <p>—</p>
            </article>

            <article className="dashboard__stat-card">
              <h3>Promedio de goles</h3>
              <p>—</p>
            </article>

            <article className="dashboard__stat-card">
              <h3>Máximo goleador</h3>
              <p>—</p>
            </article>
          </div>
        </section>

        <section className="dashboard__history">
          <h2>Historial de búsquedas</h2>
          <p>Aún no hay búsquedas registradas.</p>
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
                    Los jugadores se cargarán próximamente.
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
