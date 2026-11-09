
import '../styles/search-history.css';

function SearchHistory({
  history,
  onSelectSearch,
  onClearHistory
}) {
  return (
    <div className="search-history">
      <div className="search-history__header">
        <h2 className="search-history__title">
          Historial de búsquedas
        </h2>

        {history.length > 0 && (
          <button
            className="search-history__clear"
            type="button"
            onClick={onClearHistory}
          >
            Limpiar historial
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="search-history__empty">
          Aún no hay búsquedas registradas.
        </p>
      ) : (
        <>
          <p className="search-history__description">
            Selecciona una búsqueda para utilizarla nuevamente.
          </p>

          <ul className="search-history__list">
            {history.map((search) => (
              <li
                className="search-history__item"
                key={search.toLocaleLowerCase('es')}
              >
                <button
                  className="search-history__button"
                  type="button"
                  onClick={() => onSelectSearch(search)}
                  title={`Buscar nuevamente: ${search}`}
                >
                  <span
                    className="search-history__icon"
                    aria-hidden="true"
                  >
                    ↻
                  </span>

                  <span>{search}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="search-history__counter">
            {history.length} de 5 búsquedas guardadas
          </p>
        </>
      )}
    </div>
  );
}

export default SearchHistory;
