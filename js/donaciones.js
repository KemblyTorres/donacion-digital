// localStorage y JSON: ver w3schools, Web Storage API y JSON

/* 
    Importante, una vez se implemente una base de datos MySQL que vamos a ver más adelante en el curso
    se cambiara este localstorage y probalemente se elimine. Esta es unicamente una solucion temporal.
    En el README se agrego la referencia de donde salio localstorage. Esta sale de "w3schools".
    Pagina proporcionada por el profesor en la primera semana del curso.
*/

// Este es el donante de prueba del admin y del login
const nombreDonante = "María González";

// Leer donaciones guardadas
let donaciones = JSON.parse(localStorage.getItem("donaciones_app"));
if (donaciones === null) {
  donaciones = [];
}

let indiceEliminar = -1;


// Guardar en storage
function guardarEnStorage() {
  localStorage.setItem("donaciones_app", JSON.stringify(donaciones));
}


// Creador de ID
function nuevoId() {
  let mayor = 0;
  for (let i = 0; i < donaciones.length; i++) {
    if (donaciones[i].id > mayor) {
      mayor = donaciones[i].id;
    }
  }
  return mayor + 1;
}


// Guardar
function guardarDonacion() {

  limpiarErrores();

  
  let titulo = document.getElementById("titulo").value;
  let descripcion = document.getElementById("descripcion").value;
  let categoria = document.getElementById("categoria").value;
  let cantidad = document.getElementById("cantidad").value;
  let estado_bien = document.getElementById("estado_bien").value;
  let provincia = document.getElementById("provincia").value;
  let fotografia = document.getElementById("fotografia").value.trim();
  let indice = document.getElementById("idDonacion").value;   // vacío = publicar, número = editar

  let valido = true;

  if (titulo === "") {
    document.getElementById("errorTitulo").innerHTML = "El título es obligatorio.";
    valido = false;
  }

  if (categoria === "") {
    document.getElementById("errorCategoria").innerHTML = "Seleccione una categoría.";
    valido = false;
  }

  if (cantidad === "") {
    document.getElementById("errorCantidad").innerHTML = "La cantidad es obligatoria.";
    valido = false;
  } else if (isNaN(cantidad)) {
    document.getElementById("errorCantidad").innerHTML = "La cantidad debe ser un número.";
    valido = false;
  } else if (cantidad <= 0 || cantidad > 999) {
    document.getElementById("errorCantidad").innerHTML = "La cantidad debe estar entre 1 y 999.";
    valido = false;
  }

  if (provincia === "") {
    document.getElementById("errorProvincia").innerHTML = "Seleccione una provincia.";
    valido = false;
  }

  if (valido === false) {
    return;
  }

  // 4. ¿Publicar o editar?
  if (indice === "") {
    // Publicar: se crea la donación con los campos que usa todo el equipo
    const donacion = {
      id: nuevoId(),              
      titulo: titulo,
      descripcion: descripcion,
      categoria: categoria,
      cantidad: cantidad,
      estado_bien: estado_bien,
      provincia: provincia,
      fotografia: fotografia,
      donante: nombreDonante,     
      estado: "Disponible"
    };
    donaciones[donaciones.length] = donacion;
  } else {
    // Actualizar: solo se cambian los datos del formulario (id, donante y estado se mantienen)
    const d = donaciones[indice];
    d.titulo = titulo;
    d.descripcion = descripcion;
    d.categoria = categoria;
    d.cantidad = cantidad;
    d.estado_bien = estado_bien;
    d.provincia = provincia;
    d.fotografia = fotografia;
  }

  guardarEnStorage();
  mostrarDonaciones();
  limpiarFormulario();
}


// Editar
function editarDonacion(i) {
  const d = donaciones[i];

  if (d.estado !== "Disponible") {
    return;
  }

  document.getElementById("titulo").value = d.titulo;
  document.getElementById("descripcion").value = d.descripcion;
  document.getElementById("categoria").value = d.categoria;
  document.getElementById("cantidad").value = d.cantidad;
  document.getElementById("estado_bien").value = d.estado_bien;
  document.getElementById("provincia").value = d.provincia;
  document.getElementById("fotografia").value = d.fotografia;

  document.getElementById("idDonacion").value = i;

  document.getElementById("tituloFormulario").innerHTML = "Editar donación";
  document.getElementById("btnGuardar").innerHTML = "Guardar cambios";

  document.getElementById("seccionFormulario").scrollIntoView();
}


// Eliminar
function pedirEliminar(i) {
  if (donaciones[i].estado !== "Disponible") {
    return;
  }

  indiceEliminar = i; 
  document.getElementById("confirmarEliminar").classList.remove("d-none");
  document.getElementById("confirmarEliminar").scrollIntoView();
}


// Confirmación Eliminar
function confirmarEliminar() {
  let nuevaLista = [];

  for (let i = 0; i < donaciones.length; i++) {
    if (i != indiceEliminar) {
      nuevaLista[nuevaLista.length] = donaciones[i];
    }
  }

  donaciones = nuevaLista;
  guardarEnStorage();
  cancelarEliminar();
  limpiarFormulario();
  mostrarDonaciones();
}


// Cancelar Eliminar
function cancelarEliminar() {
  indiceEliminar = -1;
  document.getElementById("confirmarEliminar").classList.add("d-none");
}


// Limpiar espacios
function limpiarErrores() {
  document.getElementById("errorTitulo").innerHTML = "";
  document.getElementById("errorCategoria").innerHTML = "";
  document.getElementById("errorCantidad").innerHTML = "";
  document.getElementById("errorProvincia").innerHTML = "";
}


// Limpiar espacios
function limpiarFormulario() {
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("estado_bien").value = "";
  document.getElementById("provincia").value = "";
  document.getElementById("fotografia").value = "";
  document.getElementById("idDonacion").value = "";

  document.getElementById("tituloFormulario").innerHTML = "Publicar donación";
  document.getElementById("btnGuardar").innerHTML = "Publicar";

  limpiarErrores();
}


// Mostrar
function mostrarDonaciones() {
  const contenedor = document.getElementById("listaDonaciones");
  contenedor.innerHTML = "";

  let cantidadMias = 0;

  for (let i = 0; i < donaciones.length; i++) {
    const d = donaciones[i];

    // Muestra solo las donaciones dl usuario actual
    if (d.donante !== nombreDonante) {
      continue;
    }
    cantidadMias++;

    let colorEstado = "";
    if (d.estado === "Disponible") {
      colorEstado = "bg-success";
    } else if (d.estado === "Solicitada") {
      colorEstado = "bg-warning text-dark";
    } else if (d.estado === "Aceptada") {
      colorEstado = "bg-info text-dark";
    } else if (d.estado === "Entregada") {
      colorEstado = "bg-secondary";
    }

    let bloqueo = "";
    let aviso = "";
    if (d.estado !== "Disponible") {
      bloqueo = " disabled";
      aviso = '<p class="text-danger small mt-2 mb-0">No se puede modificar porque está ' + d.estado + '.</p>';
    }

    let textoEstadoBien = d.estado_bien;
    if (d.estado_bien === "") {
      textoEstadoBien = "No indicado";
    }

    // Se crea una tarjeta, base a nuestro prototipo de figma
    const columna = document.createElement("div");
    columna.className = "col-md-6 col-lg-4 mb-4";
    columna.innerHTML =
      '<div class="card h-100">' +
        '<div class="card-body">' +
          '<span class="badge ' + colorEstado + '">' + d.estado + '</span>' +
          '<h3 class="h5 mt-2">' + d.titulo + '</h3>' +
          '<p class="texto-secundario mb-0">' +
            'Descripción: ' + d.descripcion + '<br>' +
            'Categoría: ' + d.categoria + '<br>' +
            'Cantidad: ' + d.cantidad + '<br>' +
            'Provincia: ' + d.provincia + '<br>' +
            'Estado del bien: ' + textoEstadoBien +
          '</p>' +
          aviso +
        '</div>' +
        '<div class="card-footer bg-white d-flex gap-2">' +
          '<button type="button" class="btn btn-donacion-borde btn-sm" onclick="editarDonacion(' + i + ')"' + bloqueo + '>Editar</button>' +
          '<button type="button" class="btn btn-eliminar btn-sm" onclick="pedirEliminar(' + i + ')"' + bloqueo + '>Eliminar</button>' +
        '</div>' +
      '</div>';

    contenedor.appendChild(columna);
  }

  if (cantidadMias === 0) {
    document.getElementById("sinDonaciones").classList.remove("d-none");
  } else {
    document.getElementById("sinDonaciones").classList.add("d-none");
  }
}

mostrarDonaciones();