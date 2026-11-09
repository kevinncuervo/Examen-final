
import '../styles/stats-panel.css';

function StatsPanel({ stats, darkMode = true }) {
  const themeClass = darkMode
    ? 'stats-panel--dark'
    : 'stats-panel--light';

  return (
    <div className={`stats-panel ${themeClass}`}>
      <h2 className="stats-panel__title">
        Estadísticas generales
      </h2>

      <div className="stats-panel__grid">
        <article className="stats-panel__card">
          <h3 className="stats-panel__label">
            Total de jugadores
          </h3>

          <p className="stats-panel__value">
            {stats.totalPlayers}
          </p>
        </article>

        <article className="stats-panel__card">
          <h3 className="stats-panel__label">
            Promedio de edad
          </h3>

          <p className="stats-panel__value">
            {stats.averageAge.toFixed(1)}
          </p>

          <span className="stats-panel__detail">
            Años
          </span>
        </article>

        <article className="stats-panel__card">
          <h3 className="stats-panel__label">
            Promedio de goles
          </h3>

          <p className="stats-panel__value">
            {stats.averageGoals.toFixed(1)}
          </p>

          <span className="stats-panel__detail">
            Goles por jugador
          </span>
        </article>

        <article className="stats-panel__card">
          <h3 className="stats-panel__label">
            Máximo goleador
          </h3>

          <p className="stats-panel__value stats-panel__value--player">
            {stats.topScorer
              ? stats.topScorer.name
              : 'Sin resultados'}
          </p>

          <span className="stats-panel__detail">
            {stats.topScorer
              ? `${stats.topScorer.goals} goles`
              : 'No hay jugadores disponibles'}
          </span>
        </article>
      </div>
    </div>
  );
}

export default StatsPanel;
