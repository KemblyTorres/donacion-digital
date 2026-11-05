

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatosDemo();

    if (document.getElementById("gridDonaciones")) {
        iniciarCatalogo();
    } else if (document.getElementById("detalleContenedor")) {
        iniciarDetalleDonacion();
    } else if (document.getElementById("tbodySolicitudes")) {
        iniciarMisSolicitudes();
    }
});

// 1. Datos Demo Iniciales 
function inicializarDatosDemo() {
    if (!localStorage.getItem("donaciones_app")) {
        const donacionesIniciales = [
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
                estado_bien: "Usado - Buen estado",
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
                estado_bien: "Usado - Buen estado",
                provincia: "Cartago",
                fotografia: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
                donante: "Innovación Tecnológica TEC",
                estado: "Disponible"
            },
            {
                id: 4,
                titulo: "Ropa infantil surtida para niñas y niños (3 a 8 años)",
                descripcion: "Lote de camisetas, pantalones y suéteres limpios y clasificados en excelente estado para familias vulnerables.",
                categoria: "Ropa y Calzado",
                cantidad: 40,
                estado_bien: "Usado - Buen estado",
                provincia: "Puntarenas",
                fotografia: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
                donante: "Iniciativa Comunitaria Gómez",
                estado: "Disponible"
            }
        ];
        localStorage.setItem("donaciones_app", JSON.stringify(donacionesIniciales));
    }

    if (!localStorage.getItem("solicitudes_app")) {
        const solicitudesIniciales = [
            {
                id: 101,
                donacionId: 3,
                donacionTitulo: "Computadoras de escritorio para laboratorio",
                donante: "Innovación Tecnológica TEC",
                provincia: "Cartago",
                fecha: "2026-03-28",
                motivo: "Equipamiento de centro comunitario en Guararí de Heredia.",
                telefono: "8888-1122",
                estado: "Pendiente"
            }
        ];
        localStorage.setItem("solicitudes_app", JSON.stringify(solicitudesIniciales));
    }
}

// 2. HU04: Catálogo, Búsqueda y Filtros
function iniciarCatalogo() {
    const grid = document.getElementById("gridDonaciones");
    const inputBuscar = document.getElementById("inputBuscar");
    const selectCategoria = document.getElementById("selectCategoria");
    const selectProvincia = document.getElementById("selectProvincia");
    const btnLimpiar = document.getElementById("btnLimpiar");

    function renderizar() {
        const donaciones = JSON.parse(localStorage.getItem("donaciones_app")) || [];
        const query = inputBuscar.value.toLowerCase().trim();
        const cat = selectCategoria.value;
        const prov = selectProvincia.value;

        const filtradas = donaciones.filter(d => {
            const coincideTexto = d.titulo.toLowerCase().includes(query) || d.descripcion.toLowerCase().includes(query);
            const coincideCat = cat === "" || d.categoria === cat;
            const coincideProv = prov === "" || d.provincia === prov;
            const estaDisponible = d.estado === "Disponible";
            return coincideTexto && coincideCat && coincideProv && estaDisponible;
        });

        if (filtradas.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted fs-5">No se encontraron donaciones disponibles con los filtros seleccionados.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtradas.map(d => `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <article class="card h-100 card-donacion shadow-sm rounded-3 overflow-hidden">
                    <img src="${d.fotografia}" alt="${d.titulo}" class="card-donacion-img">
                    <div class="card-body d-flex flex-column">
                        <span class="categoria-tag">${d.categoria}</span>
                        <h2 class="h5 card-title mt-1 mb-2 text-dark">${d.titulo}</h2>
                        <p class="small text-muted mb-3">📍 ${d.provincia} &bull; Cantidad: ${d.cantidad}</p>
                        <a href="detalle-donacion.html?id=${d.id}" class="btn btn-donacion btn-sm mt-auto w-100">
                            Ver Detalle
                        </a>
                    </div>
                </article>
            </div>
        `).join("");
    }

    inputBuscar.addEventListener("input", renderizar);
    selectCategoria.addEventListener("change", renderizar);
    selectProvincia.addEventListener("change", renderizar);
    btnLimpiar.addEventListener("click", () => {
        inputBuscar.value = "";
        selectCategoria.value = "";
        selectProvincia.value = "";
        renderizar();
    });

    renderizar();
}

// 3. HU05 y HU06: Detalle y Modal de Solicitud
function iniciarDetalleDonacion() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const contenedor = document.getElementById("detalleContenedor");
    const donaciones = JSON.parse(localStorage.getItem("donaciones_app")) || [];
    const donacion = donaciones.find(d => d.id === id);

    if (!donacion) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <p class="text-danger fs-5">La donación solicitada no fue encontrada o ya no está disponible.</p>
                <a href="catalogo.html" class="btn btn-outline-secondary">Regresar al catálogo</a>
            </div>
        `;
        return;
    }

    // Renderizar Detalle HU05
    contenedor.innerHTML = `
        <div class="row g-4 align-items-center">
            <div class="col-12 col-md-5">
                <img src="${donacion.fotografia}" alt="${donacion.titulo}" class="detalle-img shadow-sm">
            </div>
            <div class="col-12 col-md-7">
                <span class="badge bg-success mb-2">${donacion.estado}</span>
                <h1 class="h2 fw-bold text-dark">${donacion.titulo}</h1>
                <p class="text-secondary mt-3">${donacion.descripcion}</p>
                
                <ul class="list-group list-group-flush my-3">
                    <li class="list-group-item px-0"><strong>Categoría:</strong> ${donacion.categoria}</li>
                    <li class="list-group-item px-0"><strong>Cantidad disponible:</strong> ${donacion.cantidad} unidades</li>
                    <li class="list-group-item px-0"><strong>Condición del bien:</strong> ${donacion.estado_bien}</li>
                    <li class="list-group-item px-0"><strong>Ubicación:</strong> ${donacion.provincia}, Costa Rica</li>
                    <li class="list-group-item px-0"><strong>Donante:</strong> ${donacion.donante}</li>
                </ul>

                <button id="btnAbrirModal" class="btn btn-donacion btn-lg mt-2">
                    Solicitar esta donación
                </button>
            </div>
        </div>
    `;

    // Modal y Validación HU06
    const modalEl = document.getElementById("modalSolicitud");
    const bsModal = new bootstrap.Modal(modalEl);
    const btnAbrir = document.getElementById("btnAbrirModal");
    const form = document.getElementById("formSolicitar");

    btnAbrir.addEventListener("click", () => {
        document.getElementById("solicitudDonacionId").value = donacion.id;
        document.getElementById("solicitudTitulo").value = donacion.titulo;
        bsModal.show();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const motivo = document.getElementById("motivoSolicitud").value.trim();
        const telefono = document.getElementById("telefonoContacto").value.trim();
        const errMotivo = document.getElementById("errorMotivo");
        const errTelefono = document.getElementById("errorTelefono");

        errMotivo.textContent = "";
        errTelefono.textContent = "";

        let esValido = true;
        if (motivo.length < 20) {
            errMotivo.textContent = "El motivo debe ser detallado (mínimo 20 caracteres).";
            esValido = false;
        }

        const regexTelCR = /^[2|6|7|8]\d{3}-?\d{4}$/;
        if (!regexTelCR.test(telefono)) {
            errTelefono.textContent = "Ingrese un número costarricense válido (ej: 8888-8888 o 2222-3333).";
            esValido = false;
        }

        if (!esValido) return;

        // Validar no duplicar solicitudes pendientes (Criterio HU06)
        let solicitudes = JSON.parse(localStorage.getItem("solicitudes_app")) || [];
        const yaExiste = solicitudes.some(s => s.donacionId === donacion.id && s.estado === "Pendiente");

        if (yaExiste) {
            alert("Su organización ya tiene una solicitud pendiente registrada para este bien.");
            return;
        }

        // Registrar solicitud
        const nuevaSolicitud = {
            id: Date.now(),
            donacionId: donacion.id,
            donacionTitulo: donacion.titulo,
            donante: donacion.donante,
            provincia: donacion.provincia,
            fecha: new Date().toISOString().split("T")[0],
            motivo: motivo,
            telefono: telefono,
            estado: "Pendiente"
        };
        solicitudes.push(nuevaSolicitud);
        localStorage.setItem("solicitudes_app", JSON.stringify(solicitudes));

        // Actualizar donación a 'Solicitada' (Criterio HU06)
        donacion.estado = "Solicitada";
        localStorage.setItem("donaciones_app", JSON.stringify(donaciones));

        bsModal.hide();
        alert("¡Solicitud enviada exitosamente! Ahora se encuentra en estado Pendiente.");
        window.location.href = "mis-solicitudes.html";
    });
}

// 4. HU07: Listado de Solicitudes y Estados
function iniciarMisSolicitudes() {
    const tbody = document.getElementById("tbodySolicitudes");
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes_app")) || [];

    if (solicitudes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    No ha realizado ninguna solicitud todavía.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = solicitudes.map(s => {
        let claseBadge = "badge-pendiente";
        if (s.estado === "Aceptada") claseBadge = "badge-aceptada";
        if (s.estado === "Rechazada") claseBadge = "badge-rechazada";

        return `
            <tr>
                <td class="px-3 text-secondary">${s.fecha}</td>
                <td><strong class="text-dark">${s.donacionTitulo}</strong></td>
                <td>${s.donante}</td>
                <td>${s.provincia}</td>
                <td class="px-3"><span class="badge-estado ${claseBadge}">${s.estado}</span></td>
            </tr>
        `;
    }).join("");
}
