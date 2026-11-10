# ⚽ TOP CLUB SOCCER — Dashboard de Jugadores

**Examen final de Programación IV | Universidad de Manizales | Versión Fútbol**

Aplicación web desarrollada con **React y Vite** para explorar un conjunto de 20 jugadores de fútbol mediante una tabla interactiva, búsqueda por nombre, estadísticas dinámicas y herramientas de personalización. El proyecto incorpora componentes reutilizables, estilos CSS con metodología BEM y almacenamiento local para conservar preferencias del usuario.

> **Nota sobre los datos:** los registros de `src/data/players.js` son datos de ejemplo utilizados con fines académicos. No representan necesariamente estadísticas oficiales o actualizadas de las temporadas actuales.

## 👥 Integrantes

- **Kevinn Cuervo**
- **Stiven Hernández**

El desarrollo se realizó de forma colaborativa mediante Git y GitHub, con commits de ambos integrantes en la rama `master`.

## 🔗 Enlaces

- **Repositorio:** https://github.com/kevinncuervo/Examen-final
- **Aplicación publicada:** https://bright-dusk-f4ee1b.netlify.app

## 🛠️ Tecnologías

- **React:** componentes, eventos y estado de la interfaz.
- **Vite:** servidor de desarrollo y compilación para producción.
- **JavaScript (ES modules):** filtros, cálculos, ordenamiento y paginación.
- **HTML5 y CSS3:** estructura semántica, Grid, Flexbox y diseño responsive.
- **CSS BEM:** convención de nombres de clases.
- **localStorage:** persistencia local de favoritos, historial y tema.
- **Git y GitHub:** control de versiones y colaboración.
- **Node.js Test Runner:** pruebas automatizadas sin dependencias de testing adicionales.

## ✨ Funcionalidades

| Funcionalidad | Descripción |
| --- | --- |
| Búsqueda | Filtra por **nombre** con debounce de 300 ms; incluye opción para limpiar. |
| Historial | Conserva hasta cinco búsquedas recientes, reutilizables y eliminables. |
| Estadísticas | Total de jugadores, promedio de edad, promedio de goles y máximo goleador. |
| Distribución por posición | Barras CSS con cantidades y porcentajes de cada posición. |
| Tabla interactiva | Presenta jugador, club, posición, país, edad, goles, asistencias, rating y favoritos. |
| Ordenamiento | Ciclo ascendente → descendente → original por columna. |
| Paginación | Muestra 5, 10 o 20 registros por página, con navegación y contador. |
| Coloreo | Permite destacar filas pares, impares o restaurar el estilo normal. |
| Favoritos | Marcar y desmarcar jugadores con estrellas y ver únicamente los favoritos. |
| Modal de detalles | Muestra la ficha del jugador; se cierra con botones, fondo o Escape. |
| Temas | Alterna entre modo claro y oscuro, conservando la preferencia. |
| Responsive | Adapta controles y tarjetas a computador, tableta y celular; tabla con desplazamiento horizontal. |
| Accesibilidad | Navegación por teclado, indicadores de foco, enlace para saltar al contenido y etiquetas accesibles. |
| Recuperación de errores | Un `ErrorBoundary` presenta una opción de recuperación ante fallos de renderizado de React. |

Las estadísticas se calculan sobre **todos los resultados filtrados**, no solo sobre la página actual. Los filtros, el ordenamiento y la paginación se combinan sin modificar el conjunto de datos original.

## 🚀 Instalación y ejecución local

**Requisitos:** tener instalados Git, Node.js y npm. Utiliza una versión de Node.js compatible con la versión de Vite declarada en `package.json`.

1. Clona el repositorio:

   ```bash
   git clone https://github.com/kevinncuervo/Examen-final.git
   ```

2. Abre la carpeta del proyecto:

   ```bash
   cd Examen-final
   ```

3. Instala las dependencias:

   ```bash
   npm ci
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre la dirección que Vite muestre en la terminal, normalmente `http://localhost:5173/`.

**Nota para Windows PowerShell:** si aparece un error de política de ejecución relacionado con `npm.ps1`, utiliza `npm.cmd ci` y `npm.cmd run dev` en lugar de los comandos anteriores.

## 🧪 Pruebas y compilación

Ejecuta estos comandos desde la raíz del repositorio:

```bash
# 10 pruebas de estructura e integridad
node --test scripts/integration.test.mjs

# 33 pruebas de lógica funcional
node --test tests/playerLogic.test.mjs

# Revisión de lint
npm run lint

# Compilación de producción
npm run build
```

Las dos suites contienen **43 casos de prueba definidos** en conjunto. El resultado real depende de la ejecución en el entorno local; la documentación no sustituye la revisión del navegador.

Para previsualizar la versión compilada:

```bash
npm run preview
```

La compilación de Vite genera la carpeta **`dist/`**, destinada a publicación.

## 🧭 Cómo utilizar el dashboard

1. Escribe parte del nombre de un jugador en el buscador y observa cómo se actualizan la tabla y las estadísticas.
2. Selecciona una búsqueda anterior desde el historial si deseas repetirla.
3. Haz clic en los encabezados para ordenar los datos; un tercer clic restaura el orden original.
4. Cambia la cantidad de registros por página y utiliza los botones de navegación.
5. Utiliza los controles para pintar filas pares o impares.
6. Pulsa una estrella ☆ para marcar un favorito ★ y activa **Solo favoritos** para filtrarlos.
7. Selecciona un jugador para ver su ficha detallada; cierra con **Escape**, la X o el botón **Cerrar**.
8. Utiliza el botón de tema para cambiar entre apariencia clara y oscura.

## 🗂️ Organización principal del proyecto

```text
Examen-final/
├── index.html
├── package.json
├── package-lock.json
├── public/
├── scripts/
│   └── integration.test.mjs
├── tests/
│   └── playerLogic.test.mjs
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── DashboardLayout.jsx
    │   ├── ErrorBoundary.jsx
    │   ├── FavoriteFilter.jsx
    │   ├── Pagination.jsx
    │   ├── PlayerModal.jsx
    │   ├── PlayerRow.jsx
    │   ├── PlayerTable.jsx
    │   ├── PositionDistribution.jsx
    │   ├── RowColorControls.jsx
    │   ├── SearchBar.jsx
    │   ├── SearchHistory.jsx
    │   └── StatsPanel.jsx
    ├── data/
    │   └── players.js
    ├── styles/
    │   ├── accessibility.css
    │   ├── dashboard.css
    │   ├── favorite-filter.css
    │   ├── favorites.css
    │   ├── pagination.css
    │   ├── player-modal.css
    │   ├── player-table.css
    │   ├── position-distribution.css
    │   ├── responsive.css
    │   ├── row-colors.css
    │   ├── search-bar.css
    │   ├── search-history.css
    │   ├── stats-panel.css
    │   └── theme.css
    └── utils/
        └── playerLogic.js
```

## 🧠 Hooks y arquitectura

- **`useState`:** administra búsqueda, historial, favoritos, página, ordenamiento, selección, coloreo y tema.
- **`useEffect`:** implementa el debounce y sincroniza preferencias con `localStorage`; también se utiliza para efectos de accesibilidad del modal.
- **`useMemo`:** memoriza el filtrado, las estadísticas, el ordenamiento y la paginación.
- **`useRef` y `useCallback`:** apoyan el control de foco y el cierre del modal.
- **`src/utils/playerLogic.js`:** concentra funciones puras reutilizadas por la aplicación y por las pruebas automatizadas.

Flujo de datos:

```text
players.js
    ↓
Búsqueda + filtro de favoritos
    ↓
Estadísticas y gráfico de posiciones
    ↓
Ordenamiento
    ↓
Paginación
    ↓
Tabla y modal de detalles
```

## 💾 Datos guardados en el navegador

La aplicación utiliza estas claves de `localStorage`:

| Clave | Información guardada |
| --- | --- |
| `top-club-soccer-search-history` | Hasta cinco búsquedas recientes. |
| `top-club-soccer-favorites` | Identificadores de jugadores favoritos. |
| `top-club-soccer-theme` | Preferencia `dark` o `light`. |

Los datos se almacenan **en el navegador y dispositivo actual**. No se sincronizan entre computadores ni se envían a un servidor.

## ♿ Accesibilidad y diseño adaptable

El proyecto incluye etiquetas semánticas, nombres accesibles para controles, estados de ordenamiento anunciables, indicadores visibles de foco, enlace para saltar al contenido, navegación por teclado y una ventana modal con control del foco y cierre mediante Escape.

El diseño utiliza Media Queries para adaptar tarjetas, controles, navegación y modal. La tabla ofrece desplazamiento horizontal cuando las nueve columnas no caben en la pantalla.

Estas características **no equivalen por sí solas a una certificación WCAG**; requieren comprobación mediante pruebas manuales y herramientas de accesibilidad.

## 🛠️ Solución de problemas frecuentes

- **PowerShell bloquea `npm`:** usa `npm.cmd` para ejecutar los comandos en Windows.
- **El puerto 5173 está ocupado:** utiliza la dirección alternativa que muestre Vite.
- **Aparece una pantalla vacía:** revisa la consola de Chrome (`F12 → Console`) y la terminal de Vite; verifica que los archivos `.jsx` contengan React y los `.css` únicamente estilos.
- **Los favoritos no se conservan:** comprueba el almacenamiento local de `http://localhost:5173/` en las herramientas de desarrollador.
- **Falla una prueba:** revisa la salida del comando correspondiente y corrige la causa antes de publicar cambios.


## 🌐 Publicación

El proyecto TOP CLUB SOCCER se encuentra publicado en Netlify.

**Aplicación web:** https://bright-dusk-f4ee1b.netlify.app

### Configuración de producción

- **Proveedor:** Netlify.
- **Repositorio:** kevinncuervo/Examen-final.
- **Rama de producción:** master.
- **Framework:** React + Vite.
- **Comando de compilación:** `npm run build`.
- **Directorio de publicación:** `dist`.
- **Archivo de configuración:** `netlify.toml`.

### Despliegue automático

El proyecto está vinculado con GitHub mediante Netlify.

Los cambios publicados en la rama `master` generan
nuevos despliegues automáticos, siempre que la
compilación finalice correctamente.

### Verificación

La aplicación permite consultar jugadores,
realizar búsquedas, visualizar estadísticas,
ordenar registros, administrar favoritos,
utilizar la paginación y cambiar el tema visual.

También incorpora diseño responsive,
una ventana modal de detalles y
herramientas de accesibilidad.

