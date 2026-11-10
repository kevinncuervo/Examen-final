
/* ==========================================
   TOP CLUB SOCCER
   LÓGICA REUTILIZABLE DE JUGADORES
   ========================================== */

// Filtrar jugadores por nombre y favoritos
export function filterPlayers(
  allPlayers,
  searchValue = '',
  onlyFavorites = false,
  favoriteIds = []
) {
  const normalizedSearch = String(searchValue)
    .trim()
    .toLocaleLowerCase('es');

  const favoriteSet = new Set(favoriteIds);

  return allPlayers.filter((player) => {
    const normalizedName = player.name
      .toLocaleLowerCase('es');

    const matchesSearch = normalizedName.includes(
      normalizedSearch
    );

    const matchesFavorites = (
      !onlyFavorites ||
      favoriteSet.has(player.id)
    );

    return matchesSearch && matchesFavorites;
  });
}

// Calcular estadísticas del conjunto filtrado
export function calculateStats(
  filteredPlayers,
  positions
) {
  const totalPlayers = filteredPlayers.length;

  const positionCounts = filteredPlayers.reduce(
    (counts, player) => {
      counts[player.position] =
        (counts[player.position] || 0) + 1;

      return counts;
    },
    {}
  );

  const positionDistribution = positions.map((position) => {
    const count = positionCounts[position] || 0;

    return {
      position,
      count,
      percentage: totalPlayers === 0
        ? 0
        : (count / totalPlayers) * 100
    };
  });

  if (totalPlayers === 0) {
    return {
      totalPlayers: 0,
      averageAge: 0,
      averageGoals: 0,
      topScorer: null,
      positionDistribution
    };
  }

  const totalAge = filteredPlayers.reduce(
    (total, player) => total + player.age,
    0
  );

  const totalGoals = filteredPlayers.reduce(
    (total, player) => total + player.goals,
    0
  );

  const topScorer = filteredPlayers.reduce(
    (bestPlayer, currentPlayer) => (
      currentPlayer.goals > bestPlayer.goals
        ? currentPlayer
        : bestPlayer
    ),
    filteredPlayers[0]
  );

  return {
    totalPlayers,
    averageAge: totalAge / totalPlayers,
    averageGoals: totalGoals / totalPlayers,
    topScorer,
    positionDistribution
  };
}

// Ordenar jugadores sin modificar el arreglo original
export function sortPlayers(
  filteredPlayers,
  sortConfig
) {
  const { key, direction } = sortConfig;

  if (!key || direction === 'none') {
    return [...filteredPlayers];
  }

  const multiplier = direction === 'asc' ? 1 : -1;

  const indexedPlayers = filteredPlayers.map(
    (player, index) => ({
      player,
      originalIndex: index
    })
  );

  indexedPlayers.sort((first, second) => {
    const firstValue = first.player[key];
    const secondValue = second.player[key];

    let comparison = 0;

    if (
      typeof firstValue === 'number' &&
      typeof secondValue === 'number'
    ) {
      comparison = firstValue - secondValue;
    } else {
      comparison = String(firstValue).localeCompare(
        String(secondValue),
        'es',
        { sensitivity: 'base' }
      );
    }

    // Conservar el orden anterior cuando hay empate
    if (comparison === 0) {
      return first.originalIndex - second.originalIndex;
    }

    return comparison * multiplier;
  });

  return indexedPlayers.map(({ player }) => player);
}

// Determinar el siguiente estado del ordenamiento
export function getNextSortConfig(previousConfig, key) {
  if (previousConfig.key !== key) {
    return {
      key,
      direction: 'asc'
    };
  }

  if (previousConfig.direction === 'asc') {
    return {
      key,
      direction: 'desc'
    };
  }

  if (previousConfig.direction === 'desc') {
    return {
      key: null,
      direction: 'none'
    };
  }

  return {
    key,
    direction: 'asc'
  };
}

// Calcular los jugadores visibles en una página
export function paginatePlayers(
  sortedPlayers,
  currentPage,
  itemsPerPage
) {
  const validSize = (
    Number.isInteger(itemsPerPage) &&
    itemsPerPage > 0
  )
    ? itemsPerPage
    : 5;

  const totalItems = sortedPlayers.length;

  const totalPages = Math.ceil(
    totalItems / validSize
  );

  const requestedPage = Number.isInteger(currentPage)
    ? currentPage
    : 1;

  const safeCurrentPage = Math.min(
    Math.max(1, requestedPage),
    Math.max(1, totalPages)
  );

  const startIndex = (
    safeCurrentPage - 1
  ) * validSize;

  const items = sortedPlayers.slice(
    startIndex,
    startIndex + validSize
  );

  return {
    items,
    currentPage: safeCurrentPage,
    totalPages,
    itemsPerPage: validSize,
    totalItems,
    rangeStart: totalItems === 0
      ? 0
      : startIndex + 1,
    rangeEnd: totalItems === 0
      ? 0
      : Math.min(startIndex + validSize, totalItems)
  };
}

// Agregar o quitar favoritos sin duplicados
export function toggleFavoriteIds(
  previousFavorites,
  playerId,
  validPlayerIds
) {
  if (!validPlayerIds.has(playerId)) {
    return previousFavorites;
  }

  if (previousFavorites.includes(playerId)) {
    return previousFavorites.filter(
      (id) => id !== playerId
    );
  }

  return [...previousFavorites, playerId];
}
