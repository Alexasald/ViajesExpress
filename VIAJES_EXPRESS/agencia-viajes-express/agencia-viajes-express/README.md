# Agencia de Viajes Express

Aplicación web responsiva para **explorar paquetes turísticos, registrar clientes interesados y exportar sus datos a un archivo `.txt`**. Funciona 100 % en el navegador: **no hay servidor ni base de datos**. Los datos se guardan temporalmente en `localStorage`.

**Tecnologías:** HTML5 · CSS3 · Bootstrap 5.3 (con Flexbox) · JavaScript (sin librerías extra) · Bootstrap Icons · Google Fonts (Poppins)

---

## 1. Cómo ejecutarlo (30 segundos)

1. Descarga o clona la carpeta `agencia-viajes-express/`.
2. Abre `index.html` con doble clic (Chrome, Edge o Firefox). **No necesita servidor.**
3. Necesitas **internet**: Bootstrap, los íconos y la tipografía se cargan por CDN.

> Si algo se ve raro después de cambiar CSS o JS, recarga sin caché con **Ctrl + F5**.

---

## 2. Estructura del proyecto

```
agencia-viajes-express/
├── index.html          → Landing page (banner, carrusel, misión, llamada a la acción)
├── servicios.html      → Catálogo de 10 paquetes (cards) + modal de detalle
├── registro.html       → Formulario de registro de interesados
├── clientes.html       → Tabla de clientes + botón "Exportar a TXT"
├── contacto.html       → Formulario de contacto general
├── css/
│   └── estilos.css     → Estilos propios (complementan a Bootstrap)
├── js/
│   ├── utilidades.js   → Funciones compartidas (menú, pie, localStorage, validaciones, alertas, exportar)
│   ├── paquetes.js     → Datos de los 10 paquetes + catálogo + modal
│   ├── registro.js     → Lógica del formulario de registro
│   └── clientes.js     → Lógica de la tabla de clientes
└── img/                → Una imagen por paquete + banner
```

### Imágenes necesarias (`img/`)

Los nombres deben coincidir **exactamente** (si cambias una foto, conserva el nombre y no hay que tocar código):

`banner-viajes.jpg` · `destino-cancun.jpg` · `destino-europa.jpg` · `destino-nueva-york.jpg` · `destino-africa.jpg` · `destino-asia.jpg` · `destino-sudamerica.jpg` · `destino-caribe.jpg` · `destino-dubai.jpg` · `destino-canada.jpg` · `destino-ruta-maya.jpg`

---

## 3. La idea general (lo más importante)

```
 servicios.html           registro.html                clientes.html
 ┌───────────────┐        ┌──────────────────┐         ┌───────────────────┐
 │ Elige paquete │ ─────► │ Llena formulario │ ──────► │ Ve la tabla       │
 │ "Más info"    │        │ (se valida)      │         │ "Exportar a TXT"  │
 └───────────────┘        └────────┬─────────┘         └─────────┬─────────┘
                                   │ guarda                      │ lee
                                   ▼                             ▼
                        ┌──────────────────────────────────────────────┐
                        │  localStorage  →  clave:  'clientes'         │
                        │  (lista de objetos en formato JSON)          │
                        └──────────────────────┬───────────────────────┘
                                               ▼
                                         clientes.txt (descarga)
```

**Todo gira alrededor de la clave `clientes` de `localStorage`.** `registro.html` **escribe** ahí; `clientes.html` **lee** de ahí y exporta.

### Forma de un cliente guardado

```json
{
  "id": 1760230000000,
  "nombre": "Ana López",
  "correo": "ana@correo.com",
  "destino": "Cancún All-Inclusive",
  "personas": 2,
  "fecha": "2026-12-05",
  "comentarios": "",
  "registradoEn": "11/10/2026, 20:15:00"
}
```

`localStorage` guarda un **arreglo** de estos objetos convertido a texto con `JSON.stringify` y lo recupera con `JSON.parse`.

---

## 4. Lo común a TODAS las páginas

Cada HTML tiene la misma base:

| Elemento | Qué hace |
|---|---|
| `<header id="menu-principal"></header>` | **Vacío a propósito.** `utilidades.js` lo llena con la barra de navegación (menú dinámico) y marca el enlace de la página actual. |
| `<div id="pie-pagina"></div>` | También se llena desde `utilidades.js` (footer con año automático). |
| `<script src="...bootstrap.bundle.min.js">` | Hace funcionar el menú hamburguesa, el carrusel y el modal. |
| `<script src="js/utilidades.js">` | **Siempre se carga primero** entre nuestros scripts. |

**Ventaja del menú dinámico:** si hay que agregar o renombrar un enlace, se cambia **una sola vez** en `ENLACES_MENU` (dentro de `utilidades.js`) y se actualizan las 5 páginas.

### ⚠️ Orden de los scripts (importa)

Cada script usa funciones del anterior, así que el orden en el HTML no se puede cambiar:

| Página | Orden de carga |
|---|---|
| `index.html` | bootstrap → `utilidades.js` |
| `servicios.html` | bootstrap → `utilidades.js` → `paquetes.js` |
| `registro.html` | bootstrap → `utilidades.js` → `paquetes.js` → `registro.js` |
| `clientes.html` | bootstrap → `utilidades.js` → `clientes.js` |
| `contacto.html` | bootstrap → `utilidades.js` → *(script en la misma página)* |

---

## 5. Las 5 páginas, una por una

### 🏠 `index.html` — Landing page
Puerta de entrada del sitio.
- **Banner** con imagen de fondo (`img/banner-viajes.jpg`) y botón **"Reserva tu viaje ahora"** → lleva a `servicios.html`.
- **Carrusel** (Bootstrap Carousel, `id="carruselDestinos"`) con destinos populares. Cada diapositiva es un `<div class="carousel-item">` con imagen y título; el botón indicador de abajo debe coincidir con cada diapositiva (`data-bs-slide-to="0, 1, 2…"`).
- **Sección "Sobre la agencia" y misión**, más tres tarjetas de valores.
- **Banda final** con otro botón de llamada a la acción.

> **Detalle técnico del carrusel:** todas las fotos se muestran en una caja de proporción fija (16:9 en escritorio, 4:3 en móvil) y **completas, sin recortar**. Si una foto no tiene esa proporción, los espacios sobrantes se rellenan con la misma foto difuminada. Esto lo hace el CSS (`.carousel-item`) junto con la función `ajustarCarrusel()` de `utilidades.js`, que pone la variable `--fondo`. Por eso se pueden usar fotos de cualquier tamaño.

### 🧳 `servicios.html` — Catálogo de paquetes
- **Las tarjetas no están escritas en el HTML.** Se generan con JavaScript a partir del arreglo `PAQUETES` de `paquetes.js` y se insertan en `<div id="catalogo">`.
- Cada tarjeta muestra: **destino, duración, qué incluye, precio** y el botón **"Más información"**.
- Al hacer clic en el botón se llama a `abrirModalPaquete(id)`, que rellena y abre el **modal** (`#modalPaquete`) con: imagen, descripción, duración, precio, qué incluye y **políticas de cancelación**.
- El botón **"Me interesa este paquete"** del modal lleva a `registro.html?destino=ID`, y el formulario de registro **ya abre con ese destino seleccionado**.

**Los 10 paquetes:** Cancún All-Inclusive · Europa en 15 días · Experiencia en Nueva York · Safari en África · Maravillas de Asia · Ruta por Sudamérica · Islas del Caribe · Desierto de Dubái · Canadá y sus paisajes · Ruta Maya México.

### 📝 `registro.html` — Registro de interesados
Formulario con estos campos (los `id` son importantes porque `registro.js` los usa):

| Campo | `id` | Obligatorio | Regla de validación |
|---|---|---|---|
| Nombre completo | `nombre` | Sí | Mínimo 3 caracteres |
| Correo electrónico | `correo` | Sí | Formato válido (`algo@dominio.com`) |
| Destino de interés | `destino` | Sí | Debe elegir uno de los 10 paquetes (el `<select>` se llena solo desde `PAQUETES`) |
| Número de personas | `personas` | Sí | Entero entre 1 y 20 |
| Fecha tentativa de viaje | `fecha` | Sí | **Debe ser posterior a hoy** |
| Comentarios adicionales | `comentarios` | **No** | — |

**Qué pasa al presionar "Registrarme":**
1. Se valida **todo** (no se detiene en el primer error) y cada campo se marca en rojo/verde con su mensaje.
2. **Si hay errores:** mensaje rojo en pantalla + `alert()` ❌ *"El cliente NO fue registrado"* con la lista de lo que hay que corregir.
3. **Si todo está bien:** se agrega el cliente al arreglo, se guarda en `localStorage` bajo la clave `'clientes'`, se limpia el formulario, y salen el mensaje verde en pantalla + `alert()` ✅ *"Cliente registrado correctamente"* con el resumen.
4. **Si el navegador no deja guardar** (almacenamiento lleno o bloqueado): `alert()` ❌ de que no se registró.

Además, el calendario ya bloquea fechas pasadas (`min` = mañana) como ayuda visual, **pero la validación real está en JavaScript**.

### 👥 `clientes.html` — Lista de clientes
- La tabla **no tiene filas escritas a mano**: `clientes.js` lee `localStorage` y construye las filas en `<tbody id="tabla-clientes">`.
- Columnas: **Nombre · Email · Destino · Número de Personas · Fecha · Acciones**.
- Cada fila tiene **Editar** (ícono de lápiz) y **Eliminar** (ícono de bote). *En esta práctica solo muestran un `alert()` indicando la acción; no editan ni borran de verdad.*
- **Botón "Exportar a TXT"**: descarga `clientes.txt` con todos los registros. Si no hay clientes, avisa en vez de descargar un archivo vacío.
- Si no hay clientes, se muestra un mensaje con botón para ir al registro.
- La tabla se actualiza sola si se registra un cliente desde otra pestaña (evento `storage`).

### ✉️ `contacto.html` — Contacto
- Campos: **Nombre, Correo y Mensaje**, todos obligatorios (el correo además debe tener formato válido).
- Si algo falta o es inválido: mensaje rojo. Si todo está bien: mensaje verde de confirmación y se limpia el formulario.
- **Importante:** este formulario **no guarda ni envía nada** (no hay servidor); solo valida y confirma. Su script está **dentro del mismo HTML** (al final), no en un archivo aparte.
- Los datos de contacto (dirección, teléfono, correo) son **de ejemplo**.

---

## 6. Qué hace cada archivo JavaScript

### `utilidades.js` (el "cajón de herramientas")
| Función | Para qué sirve |
|---|---|
| `construirMenu()` / `construirPie()` | Generan el menú de navegación y el footer en todas las páginas |
| `obtenerClientes()` | Lee y devuelve el arreglo de clientes desde `localStorage` (si no hay nada o está dañado, devuelve `[]`) |
| `guardarClientes(lista)` | Guarda el arreglo completo en `localStorage` |
| `emailValido(correo)` | Valida formato de correo con una expresión regular |
| `fechaEsFutura(valor)` | `true` solo si la fecha es posterior a hoy |
| `fechaManana()` | Devuelve la fecha de mañana (para el atributo `min` del input de fecha) |
| `formatearFecha()` / `formatearPrecio()` | `2026-12-05` → `05/12/2026` · `18500` → `$18,500` |
| `escaparHTML(texto)` | Evita que lo escrito por el usuario se interprete como código HTML (seguridad) |
| `mostrarAlerta(id, mensaje, tipo)` | Muestra una alerta de Bootstrap (`success`, `danger`, `warning`) dentro de un contenedor |
| `generarTextoClientes()` / `exportarClientesTXT()` | Arman el contenido y descargan `clientes.txt` |
| `ajustarCarrusel()` | Prepara el fondo difuso de cada diapositiva del carrusel |

### `paquetes.js`
- `PAQUETES`: arreglo con los 10 paquetes (`id`, `destino`, `duracion`, `incluye`, `precio`, `imagen`, `descripcion`, `politicas`).
- `renderizarCatalogo()`: dibuja las tarjetas. `abrirModalPaquete(id)`: llena y abre el modal.
- `poblarSelectDestinos(select)` y `buscarPaquete(id)`: los usa también `registro.js`.

### `registro.js`
- `validarCampo(input)` revisa un campo según su `id`; `marcarCampo()` lo pinta en rojo/verde.
- Validación en vivo: al salir de cada campo (`blur`) y al corregir un error.
- El evento `submit` valida todo, arma el objeto `cliente`, lo guarda y muestra las alertas.

### `clientes.js`
- `renderizarTabla()` dibuja la tabla con los datos **actuales** de `localStorage`.
- Maneja los clics de Editar/Eliminar (alert) y el de Exportar.

---

## 7. Diseño responsivo

- **Bootstrap 5:** sistema de rejilla (`row`, `col-*`) y componentes (navbar, cards, modal, carousel, table, forms, alerts).
- **Flexbox:** el `body` es `display: flex; flex-direction: column` para que el footer siempre quede abajo; también se usa en tarjetas, botones y formularios (`d-flex`, `justify-content-*`, `gap-*`).
- **Catálogo:** 1 columna en celular, 2 en tableta, 3 en escritorio (`row-cols-1 row-cols-md-2 row-cols-lg-3`).
- **Menú:** se convierte en hamburguesa en pantallas pequeñas (`navbar-expand-lg`).
- **Tabla:** dentro de `.table-responsive` para hacer scroll horizontal en celulares.

Para probarlo: abre las herramientas del navegador (**F12**) y activa el modo dispositivo (**Ctrl + Shift + M**).

---

## 8. Cómo probar que todo funciona (checklist)

- [ ] El menú aparece en las 5 páginas y resalta la página actual.
- [ ] El carrusel cambia de diapositiva solo y con las flechas.
- [ ] `servicios.html` muestra **10** tarjetas y cada "Más información" abre su modal.
- [ ] "Me interesa este paquete" abre `registro.html` con el destino preseleccionado.
- [ ] Registro vacío → alert ❌ con la lista de errores.
- [ ] Correo inválido (`ana@correo`) → error de correo.
- [ ] Fecha de hoy o pasada → error de fecha.
- [ ] Registro correcto → alert ✅ y mensaje verde.
- [ ] `clientes.html` muestra el cliente recién registrado.
- [ ] "Exportar a TXT" descarga `clientes.txt` con los datos.
- [ ] Editar / Eliminar muestran un `alert()`.
- [ ] Contacto con un campo vacío → error; completo → confirmación.
- [ ] Todo se ve bien en pantalla de celular.

---

## 9. Tareas comunes (cómo modificar cosas)

| Quiero… | Dónde |
|---|---|
| Cambiar precio, texto o imagen de un paquete | `js/paquetes.js` → arreglo `PAQUETES` |
| Agregar un paquete nuevo | Agregar un objeto a `PAQUETES` con `id` único + su imagen en `img/`. El catálogo y el select de registro se actualizan solos |
| Agregar o renombrar un enlace del menú | `js/utilidades.js` → `ENLACES_MENU` |
| Cambiar los colores del sitio | `css/estilos.css` → variables en `:root` (`--azul`, `--coral`, `--turquesa`…) |
| Cambiar la imagen del banner | Reemplazar `img/banner-viajes.jpg` (mismo nombre) |
| Agregar o quitar una foto del carrusel | `index.html` → un `carousel-item` **y** su botón indicador correspondiente |
| Cambiar un mensaje de validación | `js/registro.js` → función `validarCampo()` |
| Borrar todos los clientes guardados | F12 → Consola → `localStorage.removeItem('clientes');` y recargar |

---

## 10. Cosas que hay que saber (y que preguntarán al exponer)

- **¿Dónde se guardan los datos?** En `localStorage` del navegador, bajo la clave `clientes`. Es **temporal y local**: solo existe en ese navegador y en ese equipo; si se borra el historial, se pierde. Por eso existe la exportación a `.txt` como respaldo.
- **¿Por qué no hay base de datos ni servidor?** El proyecto es solo *frontend*. Para compartir datos entre usuarios haría falta un backend (por ejemplo PHP + MySQL), fuera del alcance de esta práctica.
- **¿Cómo se genera el archivo `.txt`?** Con un objeto `Blob` y un enlace temporal con el atributo `download` al que se le hace clic por código (`exportarClientesTXT()` en `utilidades.js`).
- **¿Por qué se valida con JavaScript y no solo con HTML?** Para controlar el mensaje exacto de cada error, validar el formato de correo y comparar la fecha contra el día actual.
- **¿Por qué `escaparHTML`?** Para que si alguien escribe código HTML o JavaScript en un campo (por ejemplo `<script>`), se muestre como texto y no se ejecute.
- **¿Por qué Editar y Eliminar solo muestran un alert?** Así lo pide la práctica: no se implementa la edición real.
- **Si dos personas registran desde navegadores distintos:** cada navegador tiene su propia lista; no se comparten.

---

## 11. Limitaciones conocidas

- Editar y Eliminar son demostrativos (solo `alert()`).
- Los datos de `localStorage` no se comparten entre navegadores ni equipos.
- El formulario de contacto no envía el mensaje a ningún lado.
- Se requiere internet para cargar Bootstrap, los íconos y la tipografía (CDN).
- Precios, dirección, teléfono y correo de la agencia son de ejemplo.