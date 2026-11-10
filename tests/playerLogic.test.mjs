
import test from 'node:test';
import assert from 'node:assert/strict';
import { players } from '../src/data/players.js';
import {
  filterPlayers,
  calculateStats,
  sortPlayers,
  getNextSortConfig,
  paginatePlayers,
  toggleFavoriteIds
} from '../src/utils/playerLogic.js';

const POSITIONS = [
  ...new Set(players.map((player) => player.position))
];

const VALID_IDS = new Set(
  players.map((player) => player.id)
);

// ==========================================
// PRUEBAS DE BÚSQUEDA
// ==========================================

test('01. Sin búsqueda aparecen 20 jugadores', () => {
  const result = filterPlayers(players, '');

  assert.equal(result.length, 20);
});

test('02. La búsqueda encuentra a Messi', () => {
  const result = filterPlayers(players, 'Messi');

  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'Lionel Messi');
});

test('03. La búsqueda ignora mayúsculas', () => {
  const result = filterPlayers(players, 'mEsSi');

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('04. La búsqueda elimina espacios externos', () => {
  const result = filterPlayers(players, '  Haaland  ');

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 4);
});

test('05. No se busca por nombre del club', () => {
  const result = filterPlayers(
    players,
    'Manchester City'
  );

  assert.equal(result.length, 0);
});

test('06. Una búsqueda inexistente no genera resultados', () => {
  const result = filterPlayers(
    players,
    'Jugador que no existe'
  );

  assert.deepEqual(result, []);
});

// ==========================================
// PRUEBAS DE FAVORITOS
// ==========================================

test('07. Solo favoritos muestra IDs seleccionados', () => {
  const result = filterPlayers(
    players,
    '',
    true,
    [1, 4]
  );

  assert.deepEqual(
    result.map((player) => player.id),
    [1, 4]
  );
});

test('08. El filtro combina nombre y favoritos', () => {
  const result = filterPlayers(
    players,
    'Messi',
    true,
    [1, 4]
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('09. No aparecen jugadores si no hay favoritos', () => {
  const result = filterPlayers(
    players,
    '',
    true,
    []
  );

  assert.equal(result.length, 0);
});

test('10. Se puede agregar un jugador favorito', () => {
  const result = toggleFavoriteIds(
    [],
    1,
    VALID_IDS
  );

  assert.deepEqual(result, [1]);
});

test('11. Se puede quitar un jugador favorito', () => {
  const result = toggleFavoriteIds(
    [1, 4],
    1,
    VALID_IDS
  );

  assert.deepEqual(result, [4]);
});

test('12. No se agregan IDs inexistentes', () => {
  const result = toggleFavoriteIds(
    [1],
    9999,
    VALID_IDS
  );

  assert.deepEqual(result, [1]);
});

// ==========================================
// PRUEBAS DE ESTADÍSTICAS
// ==========================================

test('13. Las estadísticas incluyen 20 jugadores', () => {
  const stats = calculateStats(
    players,
    POSITIONS
  );

  assert.equal(stats.totalPlayers, 20);
});

test('14. El promedio de edad es correcto', () => {
  const stats = calculateStats(
    players,
    POSITIONS
  );

  assert.equal(stats.averageAge, 28.05);
});

test('15. El promedio de goles es correcto', () => {
  const stats = calculateStats(
    players,
    POSITIONS
  );

  assert.equal(stats.averageGoals, 18);
});

test('16. Haaland es el máximo goleador', () => {
  const stats = calculateStats(
    players,
    POSITIONS
  );

  assert.equal(stats.topScorer.name, 'Erling Haaland');
  assert.equal(stats.topScorer.goals, 35);
});

test('17. Las estadísticas cambian al buscar Messi', () => {
  const filtered = filterPlayers(players, 'Messi');

  const stats = calculateStats(
    filtered,
    POSITIONS
  );

  assert.equal(stats.totalPlayers, 1);
  assert.equal(stats.averageAge, 37);
  assert.equal(stats.averageGoals, 24);
  assert.equal(stats.topScorer.id, 1);
});

test('18. Un conjunto vacío no genera NaN', () => {
  const stats = calculateStats(
    [],
    POSITIONS
  );

  assert.equal(stats.totalPlayers, 0);
  assert.equal(stats.averageAge, 0);
  assert.equal(stats.averageGoals, 0);
  assert.equal(stats.topScorer, null);
});

test('19. La distribución por posición es correcta', () => {
  const stats = calculateStats(
    players,
    POSITIONS
  );

  const distribution = Object.fromEntries(
    stats.positionDistribution.map((item) => [
      item.position,
      item
    ])
  );

  assert.equal(distribution.Delantero.count, 13);
  assert.equal(distribution.Mediocampista.count, 6);
  assert.equal(distribution.Defensa.count, 1);

  assert.equal(distribution.Delantero.percentage, 65);
  assert.equal(distribution.Mediocampista.percentage, 30);
  assert.equal(distribution.Defensa.percentage, 5);
});

// ==========================================
// PRUEBAS DE ORDENAMIENTO
// ==========================================

test('20. Goles ascendente inicia con Cancelo', () => {
  const result = sortPlayers(players, {
    key: 'goals',
    direction: 'asc'
  });

  assert.equal(result[0].name, 'João Cancelo');
  assert.equal(result[0].goals, 4);
});

test('21. Goles descendente inicia con Haaland', () => {
  const result = sortPlayers(players, {
    key: 'goals',
    direction: 'desc'
  });

  assert.equal(result[0].name, 'Erling Haaland');
  assert.equal(result[0].goals, 35);
});

test('22. Edad ascendente comienza con 22 años', () => {
  const result = sortPlayers(players, {
    key: 'age',
    direction: 'asc'
  });

  assert.equal(result[0].age, 22);
});

test('23. El ordenamiento conserva los empates', () => {
  const result = sortPlayers(players, {
    key: 'age',
    direction: 'asc'
  });

  const playersWithAge22 = result.filter(
    (player) => player.age === 22
  );

  assert.deepEqual(
    playersWithAge22.map((player) => player.id),
    [5, 17]
  );
});

test('24. Sin ordenamiento se conserva el orden original', () => {
  const result = sortPlayers(players, {
    key: null,
    direction: 'none'
  });

  assert.deepEqual(
    result.map((player) => player.id),
    players.map((player) => player.id)
  );
});

test('25. Ordenar no modifica el arreglo original', () => {
  const originalIds = players.map(
    (player) => player.id
  );

  sortPlayers(players, {
    key: 'goals',
    direction: 'desc'
  });

  assert.deepEqual(
    players.map((player) => player.id),
    originalIds
  );
});

test('26. El ordenamiento recorre sus tres estados', () => {
  const initial = {
    key: null,
    direction: 'none'
  };

  const ascending = getNextSortConfig(
    initial,
    'goals'
  );

  const descending = getNextSortConfig(
    ascending,
    'goals'
  );

  const normal = getNextSortConfig(
    descending,
    'goals'
  );

  assert.deepEqual(ascending, {
    key: 'goals',
    direction: 'asc'
  });

  assert.deepEqual(descending, {
    key: 'goals',
    direction: 'desc'
  });

  assert.deepEqual(normal, {
    key: null,
    direction: 'none'
  });
});

// ==========================================
// PRUEBAS DE PAGINACIÓN
// ==========================================

test('27. Cinco jugadores generan cuatro páginas', () => {
  const result = paginatePlayers(
    players,
    1,
    5
  );

  assert.equal(result.totalPages, 4);
  assert.equal(result.items.length, 5);
  assert.equal(result.rangeStart, 1);
  assert.equal(result.rangeEnd, 5);
});

test('28. La segunda página muestra jugadores 6 a 10', () => {
  const result = paginatePlayers(
    players,
    2,
    5
  );

  assert.deepEqual(
    result.items.map((player) => player.id),
    [6, 7, 8, 9, 10]
  );

  assert.equal(result.rangeStart, 6);
  assert.equal(result.rangeEnd, 10);
});

test('29. Diez jugadores generan dos páginas', () => {
  const result = paginatePlayers(
    players,
    1,
    10
  );

  assert.equal(result.totalPages, 2);
  assert.equal(result.items.length, 10);
});

test('30. Veinte jugadores generan una página', () => {
  const result = paginatePlayers(
    players,
    1,
    20
  );

  assert.equal(result.totalPages, 1);
  assert.equal(result.items.length, 20);
});

test('31. Una página fuera de rango se corrige', () => {
  const result = paginatePlayers(
    players,
    99,
    5
  );

  assert.equal(result.currentPage, 4);
  assert.equal(result.rangeStart, 16);
  assert.equal(result.rangeEnd, 20);
});

test('32. La paginación vacía no genera errores', () => {
  const result = paginatePlayers(
    [],
    1,
    5
  );

  assert.equal(result.totalPages, 0);
  assert.equal(result.rangeStart, 0);
  assert.equal(result.rangeEnd, 0);
  assert.deepEqual(result.items, []);
});

// ==========================================
// PRUEBA DE INTEGRACIÓN DE OPERACIONES
// ==========================================

test('33. Favoritos, estadísticas, orden y paginación funcionan juntos', () => {
  // Marcar Messi y Haaland como favoritos
  const favorites = [1, 4];

  // Aplicar filtro de favoritos
  const filtered = filterPlayers(
    players,
    '',
    true,
    favorites
  );

  // Calcular estadísticas sobre ambos
  const stats = calculateStats(
    filtered,
    POSITIONS
  );

  // Ordenar de mayor a menor por goles
  const sorted = sortPlayers(filtered, {
    key: 'goals',
    direction: 'desc'
  });

  // Mostrar uno por página para comprobar el cálculo
  const page = paginatePlayers(
    sorted,
    1,
    1
  );

  assert.equal(stats.totalPlayers, 2);
  assert.equal(stats.averageAge, 30.5);
  assert.equal(stats.averageGoals, 29.5);

  assert.equal(page.totalPages, 2);
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].name, 'Erling Haaland');
});
