
import '../styles/row-colors.css';

function RowColorControls({
  mode,
  onChange
}) {
  return (
    <div
      className="row-colors"
      role="group"
      aria-label="Controles para colorear filas"
    >
      <div className="row-colors__header">
        <h3 className="row-colors__title">
          Colorear filas
        </h3>

        <span className="row-colors__description">
          Selecciona qué filas deseas destacar.
        </span>
      </div>

      <div className="row-colors__buttons">
        <button
          className={
            mode === 'even'
              ? 'row-colors__button row-colors__button--active'
              : 'row-colors__button'
          }
          type="button"
          onClick={() => onChange('even')}
          aria-pressed={mode === 'even'}
        >
          Pintar Pares
        </button>

        <button
          className={
            mode === 'odd'
              ? 'row-colors__button row-colors__button--active'
              : 'row-colors__button'
          }
          type="button"
          onClick={() => onChange('odd')}
          aria-pressed={mode === 'odd'}
        >
          Pintar Impares
        </button>

        <button
          className="row-colors__button row-colors__button--clear"
          type="button"
          onClick={() => onChange('none')}
          disabled={mode === 'none'}
        >
          Limpiar Colores
        </button>
      </div>
    </div>
  );
}

export default RowColorControls;
