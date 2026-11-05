// catalogo.js

// Organización de prueba del login (org@demo.com)
const nombreOrganizacion = "Fundación Esperanza";

// se cargan antes que donaciones.js para que todas las páginas vean los mismos datos
cargarDatosDemo();

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("gridDonaciones") != null) {
        mostrarCatalogo();
    }

    if (document.getElementById("detalleContenedor") != null) {
        mostrarDetalle();
    }

    if (document.getElementById("tbodySolicitudes") != null) {
        mostrarMisSolicitudes();
    }

    if (document.getElementById("formPerfil") != null) {
        mostrarPerfil();
    }
});

// localStorage y JSON: ver w3schools, Web Storage API y JSON
function leerLista(clave) {
    let datos = JSON.parse(localStorage.getItem(clave));

    if (datos == null) {
        return [];
    }

    return datos;
}

function guardarLista(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function cargarDatosDemo() {

    if (localStorage.getItem("donaciones_app") != null) {
        return;
    }

    guardarLista("donaciones_app", [
        {
            id: 1,
            titulo: "Lote de Cuadernos y Cartucheras Escolares",
            descripcion: "30 cuadernos cosidos nuevos de 100 páginas y paquetes de lápices para escuela primaria o comedor comunal.",
            categoria: "Útiles Escolares",
            cantidad: 30,
            estado_bien: "Nuevo",
            provincia: "San José",
            fotografia: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500",
            donante: "Librería La Sabana",
            estado: "Disponible"
        },
        {
            id: 2,
            titulo: "Pupitres individuales de madera",
            descripcion: "Pupitres escolares en excelente condición estructural, debidamente lijados y barnizados para aula educativa.",
            categoria: "Mobiliario",
            cantidad: 15,
            estado_bien: "Usado en buen estado",
            provincia: "Alajuela",
            fotografia: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500",
            donante: "Colegio Bilingüe de Alajuela",
            estado: "Disponible"
        },
        {
            id: 3,
            titulo: "Computadoras de escritorio para laboratorio",
            descripcion: "Equipos con procesador Core i3, teclado y monitor, completamente funcionales para talleres comunales o secundaria.",
            categoria: "Tecnología",
            cantidad: 5,
            estado_bien: "Usado en buen estado",
            provincia: "Cartago",
            fotografia: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
            donante: "María González",
            estado: "Solicitada"
        },
        {
            id: 4,
            titulo: "Ropa infantil surtida para niñas y niños (3 a 8 años)",
            descripcion: "Lote de camisetas, pantalones y suéteres limpios y clasificados en excelente estado para familias vulnerables.",
            categoria: "Ropa y Calzado",
            cantidad: 40,
            estado_bien: "Usado en buen estado",
            provincia: "Puntarenas",
            fotografia: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
            donante: "Iniciativa Comunitaria Gómez",
            estado: "Disponible"
        }
    ]);

    // la solicitud de prueba se crea junto con las donaciones para que su donacionId exista
    guardarLista("solicitudes_app", [
        {
            id: 1,
            donacionId: 3,
            donacionTitulo: "Computadoras de escritorio para laboratorio",
            donante: "María González",
            organizacion: nombreOrganizacion,
            provincia: "Cartago",
            fecha: "2026-03-28",
            motivo: "Equipamiento de centro comunitario en Guararí de Heredia.",
            telefono: "8888-1122",
            estado: "Pendiente"
        }
    ]);
}

function sePuedeSolicitar(donacion) {
    return donacion.estado == "Disponible";
}

function imagenDonacion(donacion, clase) {
    if (donacion.fotografia == "" || donacion.fotografia == null) {
        return '<div class="' + clase + ' sin-foto">📦</div>';
    }

    return '<img src="' + donacion.fotografia + '" alt="' + donacion.titulo + '" class="' + clase + '">';
}


// ===== catálogo =====

function mostrarCatalogo() {
    let donaciones = leerLista("donaciones_app");
    let texto = document.getElementById("inputBuscar").value.toLowerCase().trim();
    let categoria = document.getElementById("selectCategoria").value;
    let provincia = document.getElementById("selectProvincia").value;
    let html = "";

    for (let i = 0; i < donaciones.length; i++) {
        let d = donaciones[i];

        let coincideTexto = d.titulo.toLowerCase().includes(texto) || d.descripcion.toLowerCase().includes(texto);
        let coincideCategoria = categoria == "" || d.categoria == categoria;
        let coincideProvincia = provincia == "" || d.provincia == provincia;

        if (coincideTexto && coincideCategoria && coincideProvincia && sePuedeSolicitar(d)) {
            html = html +
                '<div class="col-12 col-sm-6 col-lg-4 col-xl-3">' +
                    '<article class="card h-100 card-donacion shadow-sm rounded-3 overflow-hidden">' +
                        imagenDonacion(d, "card-donacion-img") +
                        '<div class="card-body d-flex flex-column">' +
                            '<span class="categoria-tag">' + d.categoria + '</span>' +
                            '<h2 class="h5 card-title mt-1 mb-2 text-dark">' + d.titulo + '</h2>' +
                            '<p class="small text-muted mb-3">📍 ' + d.provincia + ' &bull; Cantidad: ' + d.cantidad + '</p>' +
                            '<a href="detalle-donacion.html" class="btn btn-donacion btn-sm mt-auto w-100" onclick="seleccionarDonacion(' + d.id + ')">Ver Detalle</a>' +
                        '</div>' +
                    '</article>' +
                '</div>';
        }
    }

    if (html == "") {
        html =
            '<div class="col-12 text-center py-5">' +
                '<p class="text-muted fs-5">No se encontraron donaciones disponibles con los filtros seleccionados.</p>' +
            '</div>';
    }

    document.getElementById("gridDonaciones").innerHTML = html;
}

function limpiarFiltros() {
    document.getElementById("inputBuscar").value = "";
    document.getElementById("selectCategoria").value = "";
    document.getElementById("selectProvincia").value = "";
    mostrarCatalogo();
}

function seleccionarDonacion(id) {
    localStorage.setItem("donacion_seleccionada", id);
}


// ===== detalle y solicitud =====

function buscarDonacion(donaciones, id) {
    for (let i = 0; i < donaciones.length; i++) {
        if (donaciones[i].id == id) {
            return donaciones[i];
        }
    }

    return null;
}

function yaLaSolicito(donacionId) {
    let solicitudes = leerLista("solicitudes_app");

    for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].donacionId == donacionId && solicitudes[i].organizacion == nombreOrganizacion) {
            return true;
        }
    }

    return false;
}

function mostrarDetalle() {
    let id = localStorage.getItem("donacion_seleccionada");
    let donacion = buscarDonacion(leerLista("donaciones_app"), id);
    let contenedor = document.getElementById("detalleContenedor");

    if (donacion == null) {
        contenedor.innerHTML =
            '<div class="text-center py-5">' +
                '<p class="text-danger fs-5">La donación solicitada no fue encontrada o ya no está disponible.</p>' +
                '<a href="catalogo.html" class="btn btn-donacion-borde">Regresar al catálogo</a>' +
            '</div>';
        return;
    }

    let accion = "";

    if (yaLaSolicito(donacion.id)) {
        accion = '<p class="alert alert-success mt-2 mb-0">Su organización ya solicitó esta donación. Puede ver el estado en Mis Solicitudes.</p>';
    } else if (sePuedeSolicitar(donacion)) {
        accion = '<button type="button" class="btn btn-donacion btn-lg mt-2" data-bs-toggle="modal" data-bs-target="#modalSolicitud">Solicitar esta donación</button>';
    } else {
        accion = '<p class="alert alert-secondary mt-2 mb-0">Esta donación ya no recibe solicitudes.</p>';
    }

    contenedor.innerHTML =
        '<div class="row g-4 align-items-center">' +
            '<div class="col-12 col-md-5">' + imagenDonacion(donacion, "detalle-img shadow-sm") + '</div>' +
            '<div class="col-12 col-md-7">' +
                '<span class="badge bg-success mb-2">' + donacion.estado + '</span>' +
                '<h1 class="h2 fw-bold text-dark">' + donacion.titulo + '</h1>' +
                '<p class="text-secondary mt-3">' + donacion.descripcion + '</p>' +
                '<ul class="list-group list-group-flush my-3">' +
                    '<li class="list-group-item px-0"><strong>Categoría:</strong> ' + donacion.categoria + '</li>' +
                    '<li class="list-group-item px-0"><strong>Cantidad disponible:</strong> ' + donacion.cantidad + ' unidades</li>' +
                    '<li class="list-group-item px-0"><strong>Condición del bien:</strong> ' + donacion.estado_bien + '</li>' +
                    '<li class="list-group-item px-0"><strong>Ubicación:</strong> ' + donacion.provincia + ', Costa Rica</li>' +
                    '<li class="list-group-item px-0"><strong>Donante:</strong> ' + donacion.donante + '</li>' +
                '</ul>' +
                accion +
            '</div>' +
        '</div>';

    document.getElementById("solicitudDonacionId").value = donacion.id;
    document.getElementById("solicitudTitulo").value = donacion.titulo;
}

function telefonoValido(telefono) {
    let numero = telefono.replace("-", "");
    let inicio = numero.charAt(0);

    if (numero.length != 8 || isNaN(numero)) {
        return false;
    }

    return inicio == "2" || inicio == "6" || inicio == "7" || inicio == "8";
}

function fechaHoy() {
    let hoy = new Date();
    let mes = hoy.getMonth() + 1;
    let dia = hoy.getDate();

    if (mes < 10) {
        mes = "0" + mes;
    }

    if (dia < 10) {
        dia = "0" + dia;
    }

    return hoy.getFullYear() + "-" + mes + "-" + dia;
}

function enviarSolicitud() {
    let motivo = document.getElementById("motivoSolicitud").value.trim();
    let telefono = document.getElementById("telefonoContacto").value.trim();
    let valido = true;

    document.getElementById("errorMotivo").textContent = "";
    document.getElementById("errorTelefono").textContent = "";

    if (motivo.length < 20) {
        document.getElementById("errorMotivo").textContent = "El motivo debe ser detallado (mínimo 20 caracteres).";
        valido = false;
    }

    if (!telefonoValido(telefono)) {
        document.getElementById("errorTelefono").textContent = "Ingrese un número costarricense válido (ej: 8888-8888 o 2222-3333).";
        valido = false;
    }

    if (!valido) {
        return;
    }

    let donaciones = leerLista("donaciones_app");
    let solicitudes = leerLista("solicitudes_app");
    let donacion = buscarDonacion(donaciones, document.getElementById("solicitudDonacionId").value);

    if (donacion == null || yaLaSolicito(donacion.id)) {
        return;
    }

    let mayor = 0;
    for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].id > mayor) {
            mayor = solicitudes[i].id;
        }
    }

    solicitudes.push({
        id: mayor + 1,
        donacionId: donacion.id,
        donacionTitulo: donacion.titulo,
        donante: donacion.donante,
        organizacion: nombreOrganizacion,
        provincia: donacion.provincia,
        fecha: fechaHoy(),
        motivo: motivo,
        telefono: telefono,
        estado: "Pendiente"
    });
    guardarLista("solicitudes_app", solicitudes);

    donacion.estado = "Solicitada";
    guardarLista("donaciones_app", donaciones);

    alert("Solicitud enviada. Ahora se encuentra en estado Pendiente.");
    window.location.href = "mis-solicitudes.html";
}


// ===== mis solicitudes =====

function mostrarMisSolicitudes() {
    let solicitudes = leerLista("solicitudes_app");
    let html = "";

    for (let i = 0; i < solicitudes.length; i++) {
        let s = solicitudes[i];

        if (s.organizacion != nombreOrganizacion) {
            continue;
        }

        let clase = "badge-pendiente";
        if (s.estado == "Aceptada") {
            clase = "badge-aceptada";
        } else if (s.estado == "Rechazada") {
            clase = "badge-rechazada";
        }

        html = html +
            '<tr>' +
                '<td class="px-3 text-secondary">' + s.fecha + '</td>' +
                '<td><strong class="text-dark">' + s.donacionTitulo + '</strong></td>' +
                '<td>' + s.donante + '</td>' +
                '<td>' + s.provincia + '</td>' +
                '<td class="px-3"><span class="badge-estado ' + clase + '">' + s.estado + '</span></td>' +
            '</tr>';
    }

    if (html == "") {
        html = '<tr><td colspan="5" class="text-center py-4 text-muted">No ha realizado ninguna solicitud todavía.</td></tr>';
    }

    document.getElementById("tbodySolicitudes").innerHTML = html;
}


// ===== perfil de la organización =====

function buscarOrganizacion(usuarios) {
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].nombre == nombreOrganizacion) {
            return usuarios[i];
        }
    }

    return null;
}

function textoODefecto(valor) {
    if (valor == null || valor == "") {
        return "No indicado";
    }

    return valor;
}

function mostrarPerfil() {
    let org = buscarOrganizacion(leerLista("usuarios_app"));

    if (org == null) {
        return;
    }

    let solicitudes = leerLista("solicitudes_app");
    let total = 0;
    let aceptadas = 0;

    for (let i = 0; i < solicitudes.length; i++) {
        if (solicitudes[i].organizacion == nombreOrganizacion) {
            total++;
            if (solicitudes[i].estado == "Aceptada") {
                aceptadas++;
            }
        }
    }

    document.getElementById("perfilNombre").textContent = org.nombre;
    document.getElementById("perfilCorreo").textContent = org.correo;
    document.getElementById("perfilCedula").textContent = textoODefecto(org.cedula_juridica);
    document.getElementById("perfilEstado").textContent = org.estado;
    document.getElementById("perfilFecha").textContent = org.fecha;
    document.getElementById("perfilSolicitudes").textContent = total + " realizadas, " + aceptadas + " aceptadas";

    if (org.telefono != null) {
        document.getElementById("perfilTelefono").value = org.telefono;
    }

    if (org.representante != null) {
        document.getElementById("perfilRepresentante").value = org.representante;
    }
}

function guardarPerfil() {
    let telefono = document.getElementById("perfilTelefono").value.trim();
    let representante = document.getElementById("perfilRepresentante").value.trim();
    let aviso = document.getElementById("avisoPerfil");
    let valido = true;

    document.getElementById("errorPerfilTelefono").textContent = "";
    document.getElementById("errorPerfilRepresentante").textContent = "";
    aviso.style.display = "none";

    if (!telefonoValido(telefono)) {
        document.getElementById("errorPerfilTelefono").textContent = "Ingrese un número costarricense válido (ej: 2222-3333).";
        valido = false;
    }

    if (representante.length < 5) {
        document.getElementById("errorPerfilRepresentante").textContent = "Ingrese el nombre completo del representante.";
        valido = false;
    }

    if (!valido) {
        return;
    }

    let usuarios = leerLista("usuarios_app");
    let org = buscarOrganizacion(usuarios);

    if (org == null) {
        return;
    }

    org.telefono = telefono;
    org.representante = representante;
    guardarLista("usuarios_app", usuarios);

    aviso.className = "alert-exito mb-3";
    aviso.textContent = "Los datos de la organización se actualizaron.";
    aviso.style.display = "block";
}
