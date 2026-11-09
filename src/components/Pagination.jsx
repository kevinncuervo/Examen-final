
import '../styles/pagination.css';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems
}) {
  // Determinar si existen resultados
  const hasResults = totalItems > 0;

  // Asegurar que la página actual sea válida
  const activePage = hasResults
    ? Math.min(Math.max(1, currentPage), totalPages)
    : 0;

  // Calcular el primer registro visible
  const startItem = hasResults
    ? (activePage - 1) * itemsPerPage + 1
    : 0;

  // Calcular el último registro visible
  const endItem = hasResults
    ? Math.min(activePage * itemsPerPage, totalItems)
    : 0;

  // Identificar si estamos en los extremos
  const isFirstPage = activePage <= 1;

  const isLastPage = (
    !hasResults ||
    activePage >= totalPages
  );

  // Construir los números de página dinámicamente
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Mostrar todos los números cuando hay pocas páginas.
  // Para muchas páginas, conservar extremos y cercanas.
  const visiblePages = pageNumbers.filter((page) => (
    totalPages <= 7 ||
    page === 1 ||
    page === totalPages ||
    Math.abs(page - activePage) <= 1
  ));

  // Agregar separadores cuando existen saltos
  const pageItems = visiblePages.flatMap((page, index) => {
    if (
      index > 0 &&
      page - visiblePages[index - 1] > 1
    ) {
      return [`gap-${page}`, page];
    }

    return [page];
  });

  return (
    <div className="pagination">
      <div className="pagination__information">
        <div className="pagination__settings">
          <label
            className="pagination__label"
            htmlFor="pagination-page-size"
          >
            Jugadores por página:
          </label>

          <select
            id="pagination-page-size"
            className="pagination__select"
            value={itemsPerPage}
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
          className="pagination__summary"
          role="status"
        >
          Mostrando {startItem}–{endItem} de {totalItems}
        </p>
      </div>

      <nav
        className="pagination__navigation"
        aria-label="Paginación de jugadores"
      >
        <button
          className="pagination__button"
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="Ir a la primera página"
          title="Primera página"
        >
          « Primera
        </button>

        <button
          className="pagination__button"
          type="button"
          onClick={() => onPageChange(activePage - 1)}
          disabled={isFirstPage}
          aria-label="Ir a la página anterior"
          title="Página anterior"
        >
          ‹ Anterior
        </button>

        <div className="pagination__pages">
          {pageItems.map((item) => (
            typeof item === 'number' ? (
              <button
                key={item}
                className={
                  item === activePage
                    ? 'pagination__page-button pagination__page-button--active'
                    : 'pagination__page-button'
                }
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`Ir a la página ${item}`}
                aria-current={
                  item === activePage
                    ? 'page'
                    : undefined
                }
              >
                {item}
              </button>
            ) : (
              <span
                className="pagination__ellipsis"
                key={item}
                aria-hidden="true"
              >
                …
              </span>
            )
          ))}
        </div>

        <button
          className="pagination__button"
          type="button"
          onClick={() => onPageChange(activePage + 1)}
          disabled={isLastPage}
          aria-label="Ir a la página siguiente"
          title="Página siguiente"
        >
          Siguiente ›
        </button>

        <button
          className="pagination__button"
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Ir a la última página"
          title="Última página"
        >
          Última »
        </button>
      </nav>

      <p className="pagination__page-info">
        Página {activePage} de {totalPages}
      </p>
    </div>
  );
}

export default Pagination;
