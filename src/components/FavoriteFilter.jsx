
import '../styles/favorite-filter.css';

function FavoriteFilter({
  onlyFavorites,
  favoriteCount,
  onToggle
}) {
  return (
    <div className="favorite-filter">
      <div className="favorite-filter__information">
        <h3 className="favorite-filter__title">
          Filtrar jugadores
        </h3>

        <p className="favorite-filter__description">
          {onlyFavorites
            ? 'Mostrando únicamente jugadores favoritos.'
            : 'Mostrando todos los jugadores.'}
        </p>
      </div>

      <div className="favorite-filter__actions">
        <span className="favorite-filter__count">
          ★ {favoriteCount}{' '}
          {favoriteCount === 1
            ? 'favorito guardado'
            : 'favoritos guardados'}
        </span>

        <button
          className={
            onlyFavorites
              ? 'favorite-filter__button favorite-filter__button--active'
              : 'favorite-filter__button'
          }
          type="button"
          onClick={() => onToggle(!onlyFavorites)}
          aria-pressed={onlyFavorites}
        >
          <span aria-hidden="true">
            {onlyFavorites ? '✓' : '★'}
          </span>

          {onlyFavorites
            ? 'Mostrar todos'
            : 'Solo favoritos'}
        </button>
      </div>
    </div>
  );
}

export default FavoriteFilter;
