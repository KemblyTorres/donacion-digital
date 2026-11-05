// admin.js

document.addEventListener("DOMContentLoaded", function () {
    inicializarDatosAdmin();

    if (document.getElementById("tablaUsuarios")) {
        iniciarPanelAdmin();
    }
});

function leer(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

// Datos de prueba hasta que exista la base de datos (Avance 3)
function inicializarDatosAdmin() {
    if (!localStorage.getItem("usuarios_app")) {
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

    if (!localStorage.getItem("categorias_app")) {
        guardar("categorias_app", [
            { id: 1, nombre: "Ropa y Calzado" },
            { id: 2, nombre: "Útiles Escolares" },
            { id: 3, nombre: "Tecnología" },
            { id: 4, nombre: "Mobiliario" },
            { id: 5, nombre: "Alimentos no perecederos" }
        ]);
    }
}

// Ventana de confirmacion compartida por las dos paginas
let accionPendiente = null;

function confirmar(titulo, texto, boton, accion, peligro) {
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").innerHTML = texto;
    document.getElementById("modalBoton").textContent = boton;
    document.getElementById("modalBoton").className = peligro ? "btn btn-peligro flex-fill" : "btn btn-donacion flex-fill";
    document.getElementById("modalIcono").className = peligro ? "icono-dato icono-rojo mb-3" : "icono-dato icono-verde mb-3";
    document.getElementById("modalIcono").innerHTML = peligro ? '<i class="bi bi-trash"></i>' : '<i class="bi bi-check-lg"></i>';
    accionPendiente = accion;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalConfirmar")).show();
}

function ejecutarAccion() {
    accionPendiente();
    bootstrap.Modal.getInstance(document.getElementById("modalConfirmar")).hide();
}

function pill(texto) {
    return `<span class="pill pill-${texto.toLowerCase()}">${texto}</span>`;
}

// ---------- Panel del administrador (HU10) ----------

function iniciarPanelAdmin() {
    mostrarResumen();
    mostrarUsuarios();
    mostrarCategorias();
    mostrarDonaciones();
    mostrarSolicitudes();

    document.getElementById("formCategoria").addEventListener("submit", agregarCategoria);

    document.querySelectorAll(".admin-menu a").forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            document.querySelector(".admin-menu a.activo").classList.remove("activo");
            enlace.classList.add("activo");
        });
    });
}

function mostrarResumen() {
    const usuarios = leer("usuarios_app");
    const donaciones = leer("donaciones_app");
    const solicitudes = leer("solicitudes_app");
    const pendientes = solicitudes.filter(s => s.estado === "Pendiente").length;

    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalOrganizaciones").textContent = usuarios.filter(u => u.rol === "organizacion" && u.estado === "Activo").length;
    document.getElementById("totalDisponibles").textContent = donaciones.filter(d => d.estado === "Disponible").length;
    document.getElementById("totalEntregadas").textContent = donaciones.filter(d => d.estado === "Entregada").length;
    document.getElementById("totalPendientes").textContent = pendientes;
    document.getElementById("totalCategorias").textContent = leer("categorias_app").length;
    document.getElementById("contadorPendientes").textContent = pendientes;

    const recientes = solicitudes.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);
    const lista = document.getElementById("listaActividad");

    if (recientes.length === 0) {
        lista.innerHTML = `<li class="texto-secundario">Todavía no hay actividad.</li>`;
        return;
    }

    lista.innerHTML = recientes.map(s => `
        <li>
            <span class="icono-dato icono-naranja"><i class="bi bi-inbox"></i></span>
            <div>
                <p class="mb-1">Solicitud ${s.estado.toLowerCase()}: ${s.donacionTitulo}</p>
                <small class="texto-secundario">${s.fecha}</small>
            </div>
        </li>
    `).join("");
}

function iniciales(nombre) {
    const partes = nombre.split(" ");
    const segunda = partes.length > 1 ? partes[1][0] : partes[0][1];
    return (partes[0][0] + segunda).toUpperCase();
}

function nombreRol(rol) {
    if (rol === "organizacion") return "Organización";
    if (rol === "administrador") return "Administrador";
    return "Donante";
}

function mostrarUsuarios() {
    const usuarios = leer("usuarios_app");
    document.getElementById("cantidadUsuarios").textContent = usuarios.length + " usuarios";

    document.getElementById("tablaUsuarios").innerHTML = usuarios.map(u => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <span class="avatar avatar-${u.rol}">${iniciales(u.nombre)}</span>
                    <strong>${u.nombre}</strong>
                </div>
            </td>
            <td class="texto-secundario">${u.correo}</td>
            <td><span class="pill pill-${u.rol}">${nombreRol(u.rol).toUpperCase()}</span></td>
            <td><span class="pill pill-${u.estado.toLowerCase()}">● ${u.estado}</span></td>
            <td class="texto-secundario text-nowrap">${u.fecha}</td>
            <td>
                ${u.rol === "administrador" ? "" : `
                <button type="button" class="btn btn-sm ${u.estado === "Activo" ? "btn-eliminar" : "btn-accion"}" onclick="cambiarEstadoUsuario(${u.id})">
                    ${u.estado === "Activo" ? "Desactivar" : "Activar"}
                </button>`}
            </td>
        </tr>
    `).join("");
}

function cambiarEstadoUsuario(id) {
    const usuarios = leer("usuarios_app");
    const usuario = usuarios.find(u => u.id === id);
    usuario.estado = usuario.estado === "Activo" ? "Inactivo" : "Activo";
    guardar("usuarios_app", usuarios);
    mostrarUsuarios();
    mostrarResumen();
}

function contarDonaciones(categoria) {
    return leer("donaciones_app").filter(d => d.categoria === categoria).length;
}

function textoDonaciones(total) {
    return total === 1 ? "1 donación asociada" : total + " donaciones asociadas";
}

function mostrarCategorias() {
    document.getElementById("listaCategorias").innerHTML = leer("categorias_app").map(c => `
        <li>
            <div>
                <strong>${c.nombre}</strong>
                <small class="d-block texto-secundario">${textoDonaciones(contarDonaciones(c.nombre))}</small>
            </div>
            <button type="button" class="btn btn-sm btn-eliminar" onclick="pedirEliminarCategoria(${c.id})">Eliminar</button>
        </li>
    `).join("");
}

function agregarCategoria(evento) {
    evento.preventDefault();

    const campo = document.getElementById("nombreCategoria");
    const error = document.getElementById("errorCategoria");
    const nombre = campo.value.trim();
    const categorias = leer("categorias_app");
    let mensaje = "";

    if (nombre === "") {
        mensaje = "Escriba el nombre de la categoría.";
    } else if (categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        mensaje = "Esa categoría ya existe.";
    }

    campo.className = mensaje ? "form-control input-error" : "form-control";
    error.textContent = mensaje;
    if (mensaje) return;

    categorias.push({ id: Date.now(), nombre: nombre });
    guardar("categorias_app", categorias);
    campo.value = "";
    mostrarCategorias();
    mostrarResumen();
}

function pedirEliminarCategoria(id) {
    const categoria = leer("categorias_app").find(c => c.id === id);
    const total = contarDonaciones(categoria.nombre);
    const aviso = document.getElementById("avisoCategoria");

    if (total > 0) {
        aviso.textContent = `No se puede eliminar "${categoria.nombre}" porque tiene ${textoDonaciones(total)}.`;
        aviso.style.display = "block";
        return;
    }

    aviso.style.display = "none";
    confirmar(
        "¿Eliminar categoría?",
        `Está a punto de eliminar <strong>${categoria.nombre}</strong>. Esta acción no se puede deshacer.`,
        "Eliminar",
        function () {
            guardar("categorias_app", leer("categorias_app").filter(c => c.id !== id));
            mostrarCategorias();
            mostrarResumen();
        },
        true
    );
}

function mostrarDonaciones() {
    const donaciones = leer("donaciones_app");
    const lista = document.getElementById("listaDonaciones");

    if (donaciones.length === 0) {
        lista.innerHTML = `<li class="texto-secundario">No hay donaciones registradas.</li>`;
        return;
    }

    lista.innerHTML = donaciones.map(d => `
        <li>
            <div>
                <strong>${d.titulo}</strong>
                <small class="d-block texto-secundario">${d.donante} · ${d.categoria} · ${d.provincia}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                ${pill(d.estado)}
                <a href="detalle-donacion.html?id=${d.id}" class="btn btn-sm btn-accion">Ver</a>
            </div>
        </li>
    `).join("");
}

function mostrarSolicitudes() {
    const solicitudes = leer("solicitudes_app");
    const tabla = document.getElementById("tablaSolicitudes");

    if (solicitudes.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="text-center texto-secundario py-4">No hay solicitudes registradas.</td></tr>`;
        return;
    }

    tabla.innerHTML = solicitudes.map(s => `
        <tr>
            <td class="texto-secundario text-nowrap">${s.fecha}</td>
            <td><strong>${s.donacionTitulo}</strong></td>
            <td>${s.donante}</td>
            <td class="texto-secundario">${s.motivo}</td>
            <td>${pill(s.estado)}</td>
        </tr>
    `).join("");
}
