// Simulan la base de datos. PHP y MySQL se usan hasta el Avance 3.

let usuarios = [
    {correo: "donante@demo.com", clave: "donor123", rol: "donante"},
    {correo: "org@demo.com", clave: "org12345", rol: "organizacion"},
    {correo: "admin@donacion.com", clave: "admin123", rol: "administrador"}
];


// registro 

let tipoUsuario = "";
let errores = 0;


let campos = ["nombre", "correo", "clave", "confirmar", "telefono",
              "id-organizacion", "representante"];

function elegirTipo(tipo) {

    tipoUsuario = tipo;
    limpiarErrores();

    document.getElementById("tipo-donante").className = "tipo-usuario";
    document.getElementById("tipo-organizacion").className = "tipo-usuario";

    if (tipo == "donante") {

        document.getElementById("tipo-donante").className = "tipo-usuario activo";
        document.getElementById("titulo-seccion").textContent = "Información del donante";
        document.getElementById("texto-nombre").textContent = "Nombre Completo";
        document.getElementById("nombre").placeholder = "Ej. María González";
        document.getElementById("datos-organizacion").style.display = "none";

    } else {

        document.getElementById("tipo-organizacion").className = "tipo-usuario activo";
        document.getElementById("titulo-seccion").textContent = "Información de la organización";
        document.getElementById("texto-nombre").textContent = "Nombre de la Organización";
        document.getElementById("nombre").placeholder = "Ej. Fundación Esperanza";
        document.getElementById("datos-organizacion").style.display = "block";
    }

    document.getElementById("mensaje-tipo").style.display = "none";
    document.getElementById("formulario-registro").style.display = "block";
}

function limpiarErrores() {

    for (let i = 0; i < campos.length; i++) {
        document.getElementById(campos[i]).className = "form-control";
        document.getElementById("error-" + campos[i]).textContent = "";
    }

    document.getElementById("alerta-registro").style.display = "none";
}

function mostrarError(campo, texto) {

    document.getElementById(campo).className = "form-control input-error";
    document.getElementById("error-" + campo).textContent = texto;
    errores = errores + 1;
}

function correoYaRegistrado(correo) {

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo == correo.toLowerCase()) {
            return true;
        }
    }

    return false;
}

function registrar() {

    limpiarErrores();
    errores = 0;

    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let clave = document.getElementById("clave").value;
    let confirmar = document.getElementById("confirmar").value;
    let telefono = document.getElementById("telefono").value.trim();


    if (nombre == "") {
        mostrarError("nombre", "El nombre es requerido.");
    }

   
    if (correo == "") {
        mostrarError("correo", "El correo es requerido.");
    } else if (!correo.includes("@") || !correo.includes(".")) {
        mostrarError("correo", "Ingrese un correo electrónico válido.");
    } else if (correoYaRegistrado(correo)) {
        mostrarError("correo", "Este correo ya se encuentra registrado.");
    }

   
    if (clave == "") {
        mostrarError("clave", "La contraseña es requerida.");
    } else if (clave.length < 8) {
        mostrarError("clave", "La contraseña debe contener al menos 8 caracteres.");
    }

   
    if (confirmar == "") {
        mostrarError("confirmar", "Confirme su contraseña.");
    } else if (confirmar != clave) {
        mostrarError("confirmar", "Las contraseñas no coinciden.");
    }

   
    if (telefono == "") {
        mostrarError("telefono", "El teléfono es requerido.");
    } else if (telefono.length < 8) {
        mostrarError("telefono", "Ingrese un número de teléfono válido.");
    }

  
    if (tipoUsuario == "organizacion") {

        let idOrganizacion = document.getElementById("id-organizacion").value.trim();
        let representante = document.getElementById("representante").value.trim();

        if (idOrganizacion == "") {
            mostrarError("id-organizacion", "El ID de la organización es requerido.");
        } else if (idOrganizacion.length != 12 || idOrganizacion[1] != "-" || idOrganizacion[5] != "-") {
            mostrarError("id-organizacion", "El formato del ID debe ser 0-000-000000.");
        }

        if (representante == "") {
            mostrarError("representante", "El representante autorizado es requerido.");
        }
    }

  
    let alerta = document.getElementById("alerta-registro");

    if (errores > 0) {

        alerta.className = "alert-error mb-3";
        alerta.textContent = "Por favor corrija los campos marcados antes de continuar.";
        alerta.style.display = "block";

    } else {

        alerta.className = "alert-exito mb-3";
        alerta.textContent = "Registro exitoso. Redirigiendo al inicio de sesión...";
        alerta.style.display = "block";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 2000);
    }
}


//inicio de sesion 

const MAX_INTENTOS = 3;

let intentosFallidos = 0;
let cuentaBloqueada = false;


function paginaDelRol(rol) {

    switch (rol) {

        case "donante":
            return "donaciones.html";

        case "organizacion":
            return "catalogo.html";

        case "administrador":
            return "admin.html";

        default:
            return "../index.html";
    }
}

function nombreDelRol(rol) {

    switch (rol) {

        case "donante":
            return "Donante";

        case "organizacion":
            return "Organización Social";

        case "administrador":
            return "Administrador";

        default:
            return "Usuario";
    }
}

function limpiarErroresLogin() {

    document.getElementById("login-correo").className = "form-control";
    document.getElementById("login-clave").className = "form-control";
    document.getElementById("error-login-correo").textContent = "";
    document.getElementById("error-login-clave").textContent = "";
    document.getElementById("alerta-login").style.display = "none";
}

function iniciarSesion() {

    if (cuentaBloqueada == true) {
        return;
    }

    limpiarErroresLogin();
    errores = 0;

    let correo = document.getElementById("login-correo").value.trim().toLowerCase();
    let clave = document.getElementById("login-clave").value;

   
    if (correo == "") {
        mostrarError("login-correo", "El correo es requerido.");
    }

    if (clave == "") {
        mostrarError("login-clave", "La contraseña es requerida.");
    }


    if (errores == 0) {

        let alerta = document.getElementById("alerta-login");
        let usuarioEncontrado = null;

        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].correo == correo && usuarios[i].clave == clave) {
                usuarioEncontrado = usuarios[i];
            }
        }

        if (usuarioEncontrado == null) {

         
            intentosFallidos = intentosFallidos + 1;

            if (intentosFallidos >= MAX_INTENTOS) {

                cuentaBloqueada = true;
                document.getElementById("boton-login").disabled = true;

                alerta.className = "alert-aviso mb-3";
                alerta.innerHTML = "<strong>Cuenta bloqueada temporalmente</strong><br>" +
                    "Tu cuenta ha sido bloqueada temporalmente durante 15 minutos " +
                    "debido a múltiples intentos de inicio de sesión fallidos.";

            } else {

                alerta.className = "alert-error mb-3";
                alerta.innerHTML = "<strong>El correo electrónico o la contraseña son incorrectos.</strong><br>" +
                    "Intentos fallidos: " + intentosFallidos + "/" + MAX_INTENTOS +
                    ". Tras " + MAX_INTENTOS + " intentos la cuenta se bloqueará.";
            }

            alerta.style.display = "block";

        } else {

           
            intentosFallidos = 0;


            sessionStorage.setItem("rol", usuarioEncontrado.rol);
            sessionStorage.setItem("correo", usuarioEncontrado.correo);

            alerta.className = "alert-exito mb-3";
            alerta.innerHTML = "<strong>Inicio de sesión exitoso.</strong><br>" +
                "Redirigiendo al panel de " + nombreDelRol(usuarioEncontrado.rol) + "...";
            alerta.style.display = "block";

            setTimeout(function () {
                window.location.href = paginaDelRol(usuarioEncontrado.rol);
            }, 2000);
        }
    }
}


function olvidoClave() {

    let alerta = document.getElementById("alerta-login");

    alerta.className = "alert-aviso mb-3";
    alerta.textContent = "La recuperación de contraseña estará disponible próximamente.";
    alerta.style.display = "block";
}