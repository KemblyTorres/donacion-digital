# Donación Digital

Plataforma de Donación de Bienes de Primera Necesidad para comunidades vulnerables.

Repositorio: https://github.com/KemblyTorres/donacion-digital

## Avance 2 (frontend)

Desarrollado con HTML5, CSS3, JavaScript y Bootstrap 5.3. PHP y MySQL quedan para el Avance 3.

## Cómo ejecutarlo

1. Copiar la carpeta `donacion-digital` dentro de `C:\xampp\htdocs\`.
2. Iniciar Apache desde el panel de XAMPP.
3. Abrir `http://localhost/donacion-digital/` en el navegador.

También se puede abrir `index.html` directamente, pero con el servidor todas las páginas comparten los mismos datos.

Credenciales de prueba:

- Donante: `donante@demo.com` / `donor123`
- Organización: `org@demo.com` / `org12345`
- Administrador: `admin@donacion.com` / `admin123`

## Estructura

- `index.html`: página de inicio
- `css/`: hojas de estilo (`styles.css` global y una por integrante)
- `js/`: scripts (uno por integrante)
- `pages/`: páginas del sistema

`pages/plantilla.html` es la plantilla base (encabezado y pie de página) que usó el grupo para crear cada página.

## Integrantes y reparto

Grupo 3, SC-502 Ambiente Web Cliente/Servidor, Universidad Fidélitas.

- Integrante 1, Kembly Torres Ureña (ktorres30303@ufide.ac.cr): inicio, registro e inicio de sesión (`index.html`, `registro.html`, `login.html`, `auth.css`, `auth.js`)
- Integrante 2, Oscar Antonio Hernández Alfaro (ohernandez50579@ufide.ac.cr): publicación y gestión de donaciones propias (`donaciones.html`, `donaciones.css`, `donaciones.js`)
- Integrante 3, Jorge Andrés Blanco Mora (jblanco80292@ufide.ac.cr): catálogo, detalle, solicitud, mis solicitudes y perfil de la organización (`catalogo.html`, `detalle-donacion.html`, `mis-solicitudes.html`, `perfil-organizacion.html`, `catalogo.css`, `catalogo.js`)
- Integrante 4, Nicolás González Alfaro (ngonzalez50448@ufide.ac.cr): solicitudes recibidas por el donante, panel de administración y diagrama relacional (`solicitudes-recibidas.html`, `admin.html`, `admin.css`, `admin.js`)

## Mapa del sitio

| Módulo | Páginas |
|---|---|
| Inicio | `index.html` |
| Acceso | `registro.html`, `login.html` |
| Donaciones | `catalogo.html` (búsqueda y filtros), `detalle-donacion.html` (detalle y solicitud) |
| Panel del donante | `donaciones.html` (publicar y mis donaciones), `solicitudes-recibidas.html` |
| Panel de la organización | `mis-solicitudes.html`, `perfil-organizacion.html` |
| Administrador | `admin.html` (usuarios, categorías, donaciones y solicitudes) |

El diagrama relacional de tablas está en el documento IEEE del avance (Fig. 2).

## Almacenamiento temporal (localStorage)

En el Avance 2 todavía no se cuenta con base de datos, por lo que se utilizó `localStorage`
para que las páginas del sistema compartan información entre sí:

- `donaciones_app`: donaciones publicadas por los donantes (Integrante 2), mostradas en el
  catálogo (Integrante 3) y en el panel de administración (Integrante 4).
- `solicitudes_app`: solicitudes realizadas por las organizaciones (Integrante 3), que el donante
  acepta, rechaza o marca como entregadas (Integrante 4).
- `usuarios_app` y `categorias_app`: usuarios y categorías que gestiona el administrador.
- `donacion_seleccionada`: donación que se abre en la página de detalle.

Se eligió `localStorage` porque viene incluido en el navegador (no requiere instalar nada),
los datos se mantienen al recargar la página y todas las páginas del proyecto abiertas desde
el mismo servidor local comparten la misma información. Como `localStorage` solo guarda texto,
los arreglos se convierten con `JSON.stringify()` al guardar y con `JSON.parse()` al leer.

Es una solución temporal: en el Avance 3 será reemplazada por una base de datos MySQL con PHP.

Para volver a los datos de prueba se borra el almacenamiento del sitio desde las herramientas
del navegador (F12, Aplicación, Almacenamiento local).

## Referencias

- MDN Web Docs. (2024, 28 de julio). *Usando la API de almacenamiento web*. https://developer.mozilla.org/es/docs/Web/API/API_de_almacenamiento_web/Usando_la_API_de_almacenamiento_web
- W3Schools. (s.f.). *HTML Web Storage API*. https://www.w3schools.com/html/html5_webstorage.asp
- W3Schools. (s.f.). *JavaScript Web Storage API*. https://www.w3schools.com/js/js_api_web_storage.asp
- W3Schools. (s.f.). *JSON.stringify()*. https://www.w3schools.com/js/js_json_stringify.asp
- W3Schools. (s.f.). *JavaScript JSON*. https://www.w3schools.com/js/js_json.asp
- Bootstrap. (s.f.). *Modal*. Bootstrap v5.3. https://getbootstrap.com/docs/5.3/components/modal/
