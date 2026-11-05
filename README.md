# Donación Digital

Plataforma de Donación de Bienes de Primera Necesidad para comunidades vulnerables.

## Avance 2 (frontend)

Desarrollado únicamente con HTML5, CSS3 y JavaScript. PHP queda para el Avance 3.

## Estructura

- `index.html`: vista principal
- `css/`: hojas de estilo (`styles.css` global y una por integrante)
- `js/`: scripts (uno por integrante)
- `img/`: imágenes
- `pages/`: páginas del sistema

## Reparto

- Integrante 1: registro e inicio de sesión (`auth.css`, `auth.js`, `registro.html`, `login.html`)
- Integrante 2: publicación y gestión de donaciones propias (`donaciones.css`, `donaciones.js`)
- Integrante 3: catálogo, búsqueda y solicitudes (`catalogo.css`, `catalogo.js`)
- Integrante 4: gestión de solicitudes y administración (`admin.css`, `admin.js`)

## Almacenamiento temporal (localStorage)

En el Avance 2 todavía no se cuenta con base de datos, por lo que se utilizó `localStorage`
para que las páginas del sistema compartan información entre sí:

- `donaciones_app`: donaciones publicadas por los donantes (Integrante 2), mostradas en el
  catálogo (Integrante 3) y en el panel de administración (Integrante 4).
- `solicitudes_app`: solicitudes realizadas por las organizaciones.

Se eligió `localStorage` porque viene incluido en el navegador (no requiere instalar nada),
los datos se mantienen al recargar la página y todas las páginas del proyecto abiertas desde
el mismo servidor local comparten la misma información. Como `localStorage` solo guarda texto,
los arreglos se convierten con `JSON.stringify()` al guardar y con `JSON.parse()` al leer.

Es una solución temporal: en el Avance 3 será reemplazada por una base de datos MySQL con PHP.

## Referencias

- MDN Web Docs. (2024, 28 de julio). *Usando la API de almacenamiento web*. https://developer.mozilla.org/es/docs/Web/API/API_de_almacenamiento_web/Usando_la_API_de_almacenamiento_web
- W3Schools. (s.f.). *HTML Web Storage API*. https://www.w3schools.com/html/html5_webstorage.asp
- W3Schools. (s.f.). *JavaScript Web Storage API*. https://www.w3schools.com/js/js_api_web_storage.asp
- W3Schools. (s.f.). *JSON.stringify()*. https://www.w3schools.com/js/js_json_stringify.asp
