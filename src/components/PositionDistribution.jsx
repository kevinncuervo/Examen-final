
import '../styles/position-distribution.css';

function PositionDistribution({
  distribution,
  totalPlayers,
  darkMode = true
}) {
  const themeClass = darkMode
    ? 'position-distribution--dark'
    : 'position-distribution--light';

  return (
    <section
      className={`position-distribution ${themeClass}`}
      aria-labelledby="position-distribution-title"
    >
      <div className="position-distribution__header">
        <h3
          className="position-distribution__title"
          id="position-distribution-title"
        >
          Distribución por posición
        </h3>

        <span className="position-distribution__total">
          {totalPlayers} jugadores
        </span>
      </div>

      {totalPlayers === 0 && (
        <p className="position-distribution__empty">
          No hay jugadores que coincidan con la búsqueda.
        </p>
      )}

      <ul className="position-distribution__list">
        {distribution.map((item) => (
          <li
            className="position-distribution__item"
            key={item.position}
          >
            <div className="position-distribution__info">
              <span className="position-distribution__name">
                {item.position}
              </span>

              <span className="position-distribution__count">
                {item.count}{' '}
                {item.count === 1 ? 'jugador' : 'jugadores'}
                {' · '}
                {item.percentage.toFixed(0)}%
              </span>
            </div>

            <div
              className="position-distribution__track"
              aria-hidden="true"
            >
              <div
                className="position-distribution__bar"
                style={{
                  width: `${item.percentage}%`
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PositionDistribution;
