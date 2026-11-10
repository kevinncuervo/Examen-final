
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { players } from '../src/data/players.js';

// Directorio principal del proyecto
const projectRoot = fileURLToPath(
  new URL('../', import.meta.url)
);

// Obtener la ruta de un archivo
const getPath = (relativePath) => {
  return path.join(projectRoot, relativePath);
};

// Archivos esenciales del dashboard
const requiredFiles = [
  'index.html',
  'src/main.jsx',
  'src/App.jsx',
  'src/data/players.js',
  'src/components/DashboardLayout.jsx',
  'src/components/SearchBar.jsx',
  'src/components/SearchHistory.jsx',
  'src/components/StatsPanel.jsx',
  'src/components/PositionDistribution.jsx',
  'src/components/PlayerTable.jsx',
  'src/components/PlayerRow.jsx',
  'src/components/Pagination.jsx',
  'src/components/RowColorControls.jsx',
  'src/components/FavoriteFilter.jsx',
  'src/components/PlayerModal.jsx',
  'src/components/ErrorBoundary.jsx',
  'src/styles/dashboard.css',
  'src/styles/search-bar.css',
  'src/styles/search-history.css',
  'src/styles/stats-panel.css',
  'src/styles/position-distribution.css',
  'src/styles/player-table.css',
  'src/styles/pagination.css',
  'src/styles/row-colors.css',
  'src/styles/favorites.css',
  'src/styles/favorite-filter.css',
  'src/styles/player-modal.css',
  'src/styles/theme.css',
  'src/styles/error-boundary.css'
];

// Prueba 1: estructura del proyecto
test('Existen los archivos esenciales del dashboard', async () => {
  for (const file of requiredFiles) {
    await access(getPath(file));
  }
});

// Prueba 2: metadatos HTML
test('El HTML contiene los metadatos requeridos', async () => {
  const html = await readFile(
    getPath('index.html'),
    'utf8'
  );

  assert.match(
    html,
    /<html\b[^>]*lang=["']es["']/i
  );

  for (const name of ['author', 'keywords', 'description']) {
    const pattern = new RegExp(
      `<meta\\b[^>]*name=["']${name}["']`,
      'i'
    );

    assert.match(html, pattern);
  }
});

// Prueba 3: cantidad de registros
test('El proyecto contiene 20 jugadores', () => {
  assert.equal(players.length, 20);
});

// Prueba 4: identificadores únicos
test('Cada jugador tiene un ID válido y único', () => {
  const ids = players.map((player) => player.id);

  assert.equal(new Set(ids).size, players.length);

  for (const id of ids) {
    assert.ok(Number.isInteger(id));
    assert.ok(id > 0);
  }
});

// Prueba 5: estructura de los jugadores
test('Todos los jugadores tienen datos válidos', () => {
  const textFields = [
    'name',
    'club',
    'position',
    'country'
  ];

  const integerFields = [
    'age',
    'goals',
    'assists'
  ];

  for (const player of players) {
    for (const field of textFields) {
      assert.equal(typeof player[field], 'string');
      assert.ok(player[field].trim().length > 0);
    }

    for (const field of integerFields) {
      assert.ok(Number.isInteger(player[field]));
      assert.ok(player[field] >= 0);
    }

    assert.equal(typeof player.rating, 'number');
    assert.ok(Number.isFinite(player.rating));
    assert.ok(player.rating >= 0);
    assert.ok(player.rating <= 10);
  }
});

// Prueba 6: estadísticas del conjunto original
test('Las estadísticas originales son coherentes', () => {
  const totalAge = players.reduce(
    (total, player) => total + player.age,
    0
  );

  const totalGoals = players.reduce(
    (total, player) => total + player.goals,
    0
  );

  const topScorer = players.reduce(
    (best, player) => (
      player.goals > best.goals ? player : best
    ),
    players[0]
  );

  assert.equal(totalAge / players.length, 28.05);
  assert.equal(totalGoals / players.length, 18);
  assert.equal(topScorer.name, 'Erling Haaland');
  assert.equal(topScorer.goals, 35);
});

// Prueba 7: distribución por posición
test('La distribución original suma 20 jugadores', () => {
  const distribution = players.reduce(
    (counts, player) => {
      counts[player.position] =
        (counts[player.position] || 0) + 1;

      return counts;
    },
    {}
  );

  assert.equal(distribution.Delantero, 13);
  assert.equal(distribution.Mediocampista, 6);
  assert.equal(distribution.Defensa, 1);

  const total = Object.values(distribution).reduce(
    (sum, count) => sum + count,
    0
  );

  assert.equal(total, players.length);
});

// Prueba 8: coherencia de búsqueda por nombre
test('Los datos permiten búsquedas por nombre', () => {
  const searchByName = (value) => {
    const normalized = value.toLocaleLowerCase('es');

    return players.filter((player) => (
      player.name
        .toLocaleLowerCase('es')
        .includes(normalized)
    ));
  };

  assert.equal(searchByName('Messi').length, 1);
  assert.equal(searchByName('mEsSi').length, 1);
  assert.equal(searchByName('Haaland').length, 1);

  // El buscador no debe trabajar por club
  assert.equal(
    searchByName('Manchester City').length,
    0
  );
});

// Prueba 9: integración de componentes
test('El layout incluye los componentes principales', async () => {
  const layout = await readFile(
    getPath('src/components/DashboardLayout.jsx'),
    'utf8'
  );

  const components = [
    'SearchBar',
    'SearchHistory',
    'StatsPanel',
    'FavoriteFilter',
    'PlayerTable',
    'Pagination',
    'PlayerModal'
  ];

  for (const component of components) {
    assert.ok(
      layout.includes(`<${component}`),
      `Falta integrar ${component}`
    );
  }
});

// Prueba 10: claves de persistencia
test('Existen las claves de almacenamiento esperadas', async () => {
  const app = await readFile(
    getPath('src/App.jsx'),
    'utf8'
  );

  const layout = await readFile(
    getPath('src/components/DashboardLayout.jsx'),
    'utf8'
  );

  assert.ok(
    app.includes('top-club-soccer-search-history')
  );

  assert.ok(
    app.includes('top-club-soccer-favorites')
  );

  assert.ok(
    layout.includes('top-club-soccer-theme')
  );
});
