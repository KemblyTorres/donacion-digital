let donaciones = [];

let indiceEliminar = -1;


// Guardar
function guardarDonacion() {

  limpiarErrores();

  
  let titulo = document.getElementById("titulo").value;
  let descripcion = document.getElementById("descripcion").value;
  let categoria = document.getElementById("categoria").value;
  let cantidad = document.getElementById("cantidad").value;
  let estadoBien = document.getElementById("estadoBien").value;
  let provincia = document.getElementById("provincia").value;
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

  const donacion = {
    titulo: titulo,
    descripcion: descripcion,
    categoria: categoria,
    cantidad: cantidad,
    estadoBien: estadoBien,
    provincia: provincia,
    estado: "Disponible"
  };

  // 4. ¿Publicar o editar?
  if (indice === "") {
    // Publicar: se agrega al final
    donaciones[donaciones.length] = donacion;
  } else {
    // Editar: se reemplaza la que estaba en esa posición
    donaciones[indice] = donacion;
  }

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
  document.getElementById("estadoBien").value = d.estadoBien;
  document.getElementById("provincia").value = d.provincia;

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
  document.getElementById("estadoBien").value = "";
  document.getElementById("provincia").value = "";
  document.getElementById("idDonacion").value = "";

  document.getElementById("tituloFormulario").innerHTML = "Publicar donación";
  document.getElementById("btnGuardar").innerHTML = "Publicar";

  limpiarErrores();
}


// Mostrar
function mostrarDonaciones() {
  const contenedor = document.getElementById("listaDonaciones");
  contenedor.innerHTML = "";

  if (donaciones.length === 0) {
    document.getElementById("sinDonaciones").classList.remove("d-none");
  } else {
    document.getElementById("sinDonaciones").classList.add("d-none");
  }

  for (let i = 0; i < donaciones.length; i++) {
    const d = donaciones[i];

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

    let textoEstadoBien = d.estadoBien;
    if (d.estadoBien === "") {
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
          '<button type="button" class="btn btn-outline-danger btn-sm" onclick="pedirEliminar(' + i + ')"' + bloqueo + '>Eliminar</button>' +
        '</div>' +
      '</div>';

    contenedor.appendChild(columna);
  }
}

mostrarDonaciones();