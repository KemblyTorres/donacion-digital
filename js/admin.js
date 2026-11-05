// admin.js

document.addEventListener("DOMContentLoaded", function () {
    cargarDatosIniciales();

    if (document.getElementById("tablaUsuarios") != null) {
        mostrarPanel();
    }

    if (document.getElementById("listaRecibidas") != null) {
        mostrarRecibidas();
    }
});

// localStorage y JSON: ver w3schools, Web Storage API y JSON
function leer(clave) {
    let datos = JSON.parse(localStorage.getItem(clave));

    if (datos == null) {
        return [];
    }

    return datos;
}

function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function cargarDatosIniciales() {

    if (localStorage.getItem("usuarios_app") == null) {
        guardar("usuarios_app", [
            { id: 1, nombre: "Administrador", correo: "admin@donacion.com", rol: "administrador", estado: "Activo", fecha: "2026-01-15" },
            { id: 2, nombre: "María González", correo: "donante@demo.com", rol: "donante", estado: "Activo", fecha: "2026-01-20" },
            { id: 3, nombre: "Fundación Esperanza", correo: "org@demo.com", rol: "organizacion", estado: "Activo", fecha: "2026-02-03" },
            { id: 4, nombre: "Carlos Méndez", correo: "carlos@demo.com", rol: "donante", estado: "Activo", fecha: "2026-03-10" },
            { id: 5, nombre: "Hogar San Martín", correo: "hogar@demo.com", rol: "organizacion", estado: "Inactivo", fecha: "2026-03-22" },
            { id: 6, nombre: "Ana Rodríguez", correo: "ana@demo.com", rol: "donante", estado: "Activo", fecha: "2026-04-01" },
            { id: 7, nombre: "Banco de Alimentos", correo: "banco@demo.com", rol: "organizacion", estado: "Activo", fecha: "2026-04-18" },
            { id: 8, nombre: "Roberto Torres", correo: "roberto@demo.com", rol: "donante", estado: "Inactivo", fecha: "2026-05-07" }
        ]);
    }

    if (localStorage.getItem("categorias_app") == null) {
        guardar("categorias_app", [
            { id: 1, nombre: "Ropa y Calzado" },
            { id: 2, nombre: "Útiles Escolares" },
            { id: 3, nombre: "Tecnología" },
            { id: 4, nombre: "Mobiliario" },
            { id: 5, nombre: "Alimentos no perecederos" }
        ]);
    }
}

function buscarPorId(lista, id) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id == id) {
            return lista[i];
        }
    }

    return null;
}

function nuevoId(lista) {
    let mayor = 0;

    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id > mayor) {
            mayor = lista[i].id;
        }
    }

    return mayor + 1;
}

function etiqueta(texto) {
    return '<span class="pill pill-' + texto.toLowerCase() + '">' + texto + '</span>';
}

// ventana de confirmacion (la abre Bootstrap con data-bs-toggle)
let accionPendiente = "";
let idPendiente = 0;

function prepararModal(titulo, texto, boton, peligro) {
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").innerHTML = texto;
    document.getElementById("modalBoton").textContent = boton;

    if (peligro) {
        document.getElementById("modalIcono").className = "icono-dato icono-rojo mb-3";
        document.getElementById("modalIcono").textContent = "🗑️";
        document.getElementById("modalBoton").className = "btn btn-peligro flex-fill";
    } else {
        document.getElementById("modalIcono").className = "icono-dato icono-verde mb-3";
        document.getElementById("modalIcono").textContent = "✅";
        document.getElementById("modalBoton").className = "btn btn-donacion flex-fill";
    }
}

function confirmarAccion() {
    if (accionPendiente == "categoria") {
        eliminarCategoria(idPendiente);
    } else if (accionPendiente == "rechazar") {
        rechazarSolicitud(idPendiente);
    } else if (accionPendiente == "entregar") {
        marcarEntregada(idPendiente);
    }
}


// ===== panel del administrador =====

function mostrarPanel() {
    mostrarResumen();
    mostrarUsuarios();
    mostrarCategorias();
    mostrarDonaciones();
    mostrarSolicitudes();
}

function marcarMenu(id) {
    let menus = ["menuDashboard", "menuUsuarios", "menuCategorias", "menuDonaciones", "menuSolicitudes"];

    for (let i = 0; i < menus.length; i++) {
        document.getElementById(menus[i]).classList.remove("activo");
    }

    document.getElementById(id).classList.add("activo");
}

function mostrarResumen() {
    let usuarios = leer("usuarios_app");
    let donaciones = leer("donaciones_app");
    let solicitudes = leer("solicitudes_app");

    let organizaciones = 0;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].rol == "organizacion" && usuarios[i].estado == "Activo") {
            organizaciones = organizaciones + 1;
        }
    }

    let disponibles = 0;
    let entregadas = 0;
    for (let i = 0; i < donaciones.length; i++) {
        if (donaciones[i].estado == "Disponible") {
            disponibles = disponibles + 1;
        } else if (donaciones[i].estado == "Entregada") {
            entregadas = entregadas + 1;
        }
    }

    let pendientes = 0;
    for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].estado == "Pendiente") {
            pendientes = pendientes + 1;
        }
    }

    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalOrganizaciones").textContent = organizaciones;
    document.getElementById("totalDisponibles").textContent = disponibles;
    document.getElementById("totalEntregadas").textContent = entregadas;
    document.getElementById("totalPendientes").textContent = pendientes;
    document.getElementById("totalCategorias").textContent = leer("categorias_app").length;
    document.getElementById("contadorPendientes").textContent = pendientes;

    // las 5 solicitudes mas recientes
    let html = "";
    for (let i = solicitudes.length - 1; i >= 0 && i >= solicitudes.length - 5; i--) {
        html = html +
            '<li>' +
                '<span class="icono-dato icono-naranja">📥</span>' +
                '<div>' +
                    '<p class="mb-1">Solicitud ' + solicitudes[i].estado.toLowerCase() + ': ' + solicitudes[i].donacionTitulo + '</p>' +
                    '<small class="texto-secundario">' + solicitudes[i].fecha + '</small>' +
                '</div>' +
            '</li>';
    }

    if (html == "") {
        html = '<li class="texto-secundario">Todavía no hay actividad.</li>';
    }

    document.getElementById("listaActividad").innerHTML = html;
}

function iniciales(nombre) {
    let espacio = nombre.indexOf(" ");

    if (espacio == -1) {
        return nombre.substring(0, 2).toUpperCase();
    }

    return (nombre.charAt(0) + nombre.charAt(espacio + 1)).toUpperCase();
}

function nombreRol(rol) {
    if (rol == "organizacion") {
        return "Organización";
    } else if (rol == "administrador") {
        return "Administrador";
    } else {
        return "Donante";
    }
}

function mostrarUsuarios() {
    let usuarios = leer("usuarios_app");
    let html = "";

    for (let i = 0; i < usuarios.length; i++) {
        let u = usuarios[i];
        let boton = "";

        if (u.rol != "administrador") {
            if (u.estado == "Activo") {
                boton = '<button type="button" class="btn btn-sm btn-eliminar" onclick="cambiarEstadoUsuario(' + u.id + ')">Desactivar</button>';
            } else {
                boton = '<button type="button" class="btn btn-sm btn-accion" onclick="cambiarEstadoUsuario(' + u.id + ')">Activar</button>';
            }
        }

        html = html +
            '<tr>' +
                '<td>' +
                    '<div class="d-flex align-items-center gap-2">' +
                        '<span class="avatar avatar-' + u.rol + '">' + iniciales(u.nombre) + '</span>' +
                        '<strong>' + u.nombre + '</strong>' +
                    '</div>' +
                '</td>' +
                '<td class="texto-secundario">' + u.correo + '</td>' +
                '<td><span class="pill pill-' + u.rol + '">' + nombreRol(u.rol) + '</span></td>' +
                '<td>' + etiqueta(u.estado) + '</td>' +
                '<td class="texto-secundario text-nowrap">' + u.fecha + '</td>' +
                '<td>' + boton + '</td>' +
            '</tr>';
    }

    document.getElementById("cantidadUsuarios").textContent = usuarios.length + " usuarios";
    document.getElementById("tablaUsuarios").innerHTML = html;
}

function cambiarEstadoUsuario(id) {
    let usuarios = leer("usuarios_app");
    let usuario = buscarPorId(usuarios, id);

    if (usuario.estado == "Activo") {
        usuario.estado = "Inactivo";
    } else {
        usuario.estado = "Activo";
    }

    guardar("usuarios_app", usuarios);
    mostrarUsuarios();
    mostrarResumen();
}

function contarDonaciones(categoria) {
    let donaciones = leer("donaciones_app");
    let total = 0;

    for (let i = 0; i < donaciones.length; i++) {
        if (donaciones[i].categoria == categoria) {
            total = total + 1;
        }
    }

    return total;
}

function mostrarCategorias() {
    let categorias = leer("categorias_app");
    let html = "";

    for (let i = 0; i < categorias.length; i++) {
        let c = categorias[i];
        let total = contarDonaciones(c.nombre);
        let texto = total + " donaciones asociadas";
        let boton = "";

        if (total == 1) {
            texto = "1 donación asociada";
        }

        // una categoria con donaciones no se puede eliminar
        if (total > 0) {
            boton = '<button type="button" class="btn btn-sm btn-eliminar" disabled>Eliminar</button>';
        } else {
            boton = '<button type="button" class="btn btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalConfirmar" onclick="prepararEliminarCategoria(' + c.id + ')">Eliminar</button>';
        }

        html = html +
            '<li>' +
                '<div>' +
                    '<strong>' + c.nombre + '</strong>' +
                    '<small class="d-block texto-secundario">' + texto + '</small>' +
                '</div>' +
                boton +
            '</li>';
    }

    document.getElementById("listaCategorias").innerHTML = html;
}

function agregarCategoria() {
    let campo = document.getElementById("nombreCategoria");
    let error = document.getElementById("errorCategoria");
    let nombre = campo.value.trim();
    let categorias = leer("categorias_app");
    let mensaje = "";

    if (nombre == "") {
        mensaje = "Escriba el nombre de la categoría.";
    } else {
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].nombre.toLowerCase() == nombre.toLowerCase()) {
                mensaje = "Esa categoría ya existe.";
            }
        }
    }

    error.textContent = mensaje;

    if (mensaje != "") {
        campo.className = "form-control input-error";
        return;
    }

    campo.className = "form-control";
    categorias.push({ id: nuevoId(categorias), nombre: nombre });
    guardar("categorias_app", categorias);
    campo.value = "";
    mostrarCategorias();
    mostrarResumen();
}

function prepararEliminarCategoria(id) {
    let categoria = buscarPorId(leer("categorias_app"), id);

    accionPendiente = "categoria";
    idPendiente = id;
    prepararModal(
        "¿Eliminar categoría?",
        "Está a punto de eliminar <strong>" + categoria.nombre + "</strong>. Esta acción no se puede deshacer.",
        "Eliminar",
        true
    );
}

function eliminarCategoria(id) {
    let categorias = leer("categorias_app");
    let quedan = [];

    for (let i = 0; i < categorias.length; i++) {
        if (categorias[i].id != id) {
            quedan.push(categorias[i]);
        }
    }

    guardar("categorias_app", quedan);
    mostrarCategorias();
    mostrarResumen();
}

function mostrarDonaciones() {
    let donaciones = leer("donaciones_app");
    let html = "";

    for (let i = 0; i < donaciones.length; i++) {
        let d = donaciones[i];

        html = html +
            '<li>' +
                '<div>' +
                    '<strong>' + d.titulo + '</strong>' +
                    '<small class="d-block texto-secundario">' + d.donante + ' · ' + d.categoria + ' · ' + d.provincia + '</small>' +
                '</div>' +
                '<div class="d-flex align-items-center gap-2">' +
                    etiqueta(d.estado) +
                    '<a href="detalle-donacion.html?id=' + d.id + '" class="btn btn-sm btn-accion">Ver</a>' +
                '</div>' +
            '</li>';
    }

    if (html == "") {
        html = '<li class="texto-secundario">No hay donaciones registradas.</li>';
    }

    document.getElementById("listaDonaciones").innerHTML = html;
}

function mostrarSolicitudes() {
    let solicitudes = leer("solicitudes_app");
    let html = "";

    for (let i = 0; i < solicitudes.length; i++) {
        let s = solicitudes[i];

        html = html +
            '<tr>' +
                '<td class="texto-secundario text-nowrap">' + s.fecha + '</td>' +
                '<td><strong>' + s.donacionTitulo + '</strong></td>' +
                '<td>' + s.donante + '</td>' +
                '<td class="texto-secundario">' + s.motivo + '</td>' +
                '<td>' + etiqueta(s.estado) + '</td>' +
            '</tr>';
    }

    if (html == "") {
        html = '<tr><td colspan="5" class="text-center texto-secundario py-4">No hay solicitudes registradas.</td></tr>';
    }

    document.getElementById("tablaSolicitudes").innerHTML = html;
}


// ===== solicitudes recibidas por el donante =====

function mostrarRecibidas() {
    let donaciones = leer("donaciones_app");
    let solicitudes = leer("solicitudes_app");
    let html = "";

    for (let i = 0; i < donaciones.length; i++) {
        let d = donaciones[i];
        let filas = "";

        for (let j = 0; j < solicitudes.length; j++) {
            let s = solicitudes[j];

            if (s.donacionId == d.id) {
                let botones = "";

                if (s.estado == "Pendiente") {
                    botones =
                        '<button type="button" class="btn btn-sm btn-donacion" onclick="aceptarSolicitud(' + s.id + ')">Aceptar</button> ' +
                        '<button type="button" class="btn btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#modalConfirmar" onclick="prepararRechazo(' + s.id + ')">Rechazar</button>';
                }

                filas = filas +
                    '<tr>' +
                        '<td class="texto-secundario text-nowrap">' + s.fecha + '</td>' +
                        '<td>' + s.motivo + '</td>' +
                        '<td class="text-nowrap">' + s.telefono + '</td>' +
                        '<td>' + etiqueta(s.estado) + '</td>' +
                        '<td class="text-end text-nowrap">' + botones + '</td>' +
                    '</tr>';
            }
        }

        if (filas != "") {
            let entrega = "";

            if (d.estado == "Aceptada") {
                entrega = '<button type="button" class="btn btn-donacion btn-sm" data-bs-toggle="modal" data-bs-target="#modalConfirmar" onclick="prepararEntrega(' + d.id + ')">Marcar como entregada</button>';
            } else if (d.estado == "Entregada") {
                entrega = '<span class="texto-secundario small">✔ Entrega registrada</span>';
            }

            html = html +
                '<section class="card mb-4">' +
                    '<div class="card-body">' +
                        '<div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">' +
                            '<div>' +
                                '<h2 class="titulo-tarjeta">' + d.titulo + '</h2>' +
                                '<small class="texto-secundario">' + d.categoria + ' · ' + d.provincia + ' · Cantidad: ' + d.cantidad + '</small>' +
                            '</div>' +
                            '<div class="d-flex align-items-center gap-2">' + etiqueta(d.estado) + entrega + '</div>' +
                        '</div>' +
                        '<div class="table-responsive">' +
                            '<table class="table tabla-admin align-middle mb-0">' +
                                '<thead>' +
                                    '<tr><th>Fecha</th><th>Motivo</th><th>Teléfono</th><th>Estado</th><th class="text-end">Acciones</th></tr>' +
                                '</thead>' +
                                '<tbody>' + filas + '</tbody>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                '</section>';
        }
    }

    if (html == "") {
        html = '<div class="card card-body text-center texto-secundario py-5">Todavía no ha recibido solicitudes.</div>';
    }

    document.getElementById("listaRecibidas").innerHTML = html;
}

function avisar(texto) {
    let aviso = document.getElementById("avisoRecibidas");
    aviso.textContent = texto;
    aviso.style.display = "block";
}

function aceptarSolicitud(id) {
    let solicitudes = leer("solicitudes_app");
    let donaciones = leer("donaciones_app");
    let elegida = buscarPorId(solicitudes, id);

    // las demas pendientes de la misma donacion quedan rechazadas
    for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].donacionId == elegida.donacionId && solicitudes[i].estado == "Pendiente") {
            solicitudes[i].estado = "Rechazada";
        }
    }

    elegida.estado = "Aceptada";
    buscarPorId(donaciones, elegida.donacionId).estado = "Aceptada";

    guardar("solicitudes_app", solicitudes);
    guardar("donaciones_app", donaciones);
    mostrarRecibidas();
    avisar("Solicitud aceptada. Coordine la entrega con la organización y luego márquela como entregada.");
}

function prepararRechazo(id) {
    accionPendiente = "rechazar";
    idPendiente = id;
    prepararModal(
        "¿Rechazar solicitud?",
        "La organización verá la solicitud como <strong>Rechazada</strong>. Esta acción no se puede deshacer.",
        "Rechazar",
        true
    );
}

function rechazarSolicitud(id) {
    let solicitudes = leer("solicitudes_app");
    let donaciones = leer("donaciones_app");
    let elegida = buscarPorId(solicitudes, id);
    elegida.estado = "Rechazada";

    // si no queda ninguna abierta, la donacion vuelve a estar disponible
    let abiertas = 0;
    for (let i = 0; i < solicitudes.length; i++) {
        let s = solicitudes[i];
        if (s.donacionId == elegida.donacionId && (s.estado == "Pendiente" || s.estado == "Aceptada")) {
            abiertas = abiertas + 1;
        }
    }

    if (abiertas == 0) {
        buscarPorId(donaciones, elegida.donacionId).estado = "Disponible";
    }

    guardar("solicitudes_app", solicitudes);
    guardar("donaciones_app", donaciones);
    mostrarRecibidas();
    avisar("Solicitud rechazada.");
}

function prepararEntrega(donacionId) {
    accionPendiente = "entregar";
    idPendiente = donacionId;
    prepararModal(
        "¿Marcar como entregada?",
        "La donación quedará como <strong>Entregada</strong> y ya no se podrá editar.",
        "Confirmar entrega",
        false
    );
}

function marcarEntregada(donacionId) {
    let solicitudes = leer("solicitudes_app");
    let donaciones = leer("donaciones_app");
    let aceptada = false;

    for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].donacionId == donacionId && solicitudes[i].estado == "Aceptada") {
            aceptada = true;
        }
    }

    // solo se entrega si hay una solicitud aceptada
    if (aceptada == false) {
        avisar("Solo se puede marcar como entregada una donación con una solicitud aceptada.");
        return;
    }

    buscarPorId(donaciones, donacionId).estado = "Entregada";
    guardar("donaciones_app", donaciones);
    mostrarRecibidas();
    avisar("Entrega registrada. El proceso de esta donación quedó cerrado.");
}
