
import '../styles/search-bar.css';

function SearchBar({
  value,
  onChange,
  onClear,
  resultsCount
}) {
  return (
    <div className="search-bar">
      <label
        className="search-bar__label"
        htmlFor="player-search"
      >
        Buscar jugadores
      </label>

      <div className="search-bar__field">
        <input
          id="player-search"
          className="search-bar__input"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar jugador por nombre..."
          autoComplete="off"
        />

        {value.length > 0 && (
          <button
            className="search-bar__clear"
            type="button"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
            title="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      <p
        className="search-bar__results"
        role="status"
        aria-live="polite"
      >
        Resultados encontrados:{' '}
        <strong>{resultsCount}</strong>
      </p>
    </div>
  );
}

export default SearchBar;
