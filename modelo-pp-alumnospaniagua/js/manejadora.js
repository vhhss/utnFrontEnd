document.addEventListener("DOMContentLoaded", () => {
    const mostrarBtn = document.getElementById("mostrar");
    if (mostrarBtn) {
        mostrarBtn.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarTablaDinamica();
            obtenerAlumnos();
        });
    }

    // Mostrar solo alumnos de Argentina
    const btnArg = document.getElementById("mostrar-argentinos");
    if (btnArg) {
        btnArg.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarTablaDinamica();
            toggleSpinner(true);
            fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos")
                .then(res => res.json())
                .then(data => {
                    const argentinos = data.filter(al => al.pais?.toLowerCase() === "argentina");
                    mostrarTablaAlumnos(argentinos);
                })
                .catch(err => alert("Error al filtrar argentinos: " + err))
                .finally(() => toggleSpinner(false));
        });
    }

    // Mostrar alumnos homónimos
    const btnHom = document.getElementById("mostrar-homonimos");
    if (btnHom) {
        btnHom.addEventListener("click", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value.trim();
            if (!nombre) {
                alert("Ingrese un nombre en el formulario para buscar homónimos");
                return;
            }
            mostrarTablaDinamica();
            toggleSpinner(true);
            fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos")
                .then(res => res.json())
                .then(data => {
                    const homonimos = data.filter(al =>
                        al.nombre?.toLowerCase() === nombre.toLowerCase()
                    );
                    mostrarTablaAlumnos(homonimos);
                })
                .catch(err => alert("Error al filtrar homónimos: " + err))
                .finally(() => toggleSpinner(false));
        });
    }

    // Manejo del formulario para crear o modificar alumno
    const form = document.getElementById("formulario");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            limpiarValidaciones();
            const legajo = document.getElementById("legajo").value;
            let esValido = true;

            if (!validarNombre()) esValido = false;
            if (!validarEmail()) esValido = false;
            if (!validarPais()) esValido = false;
            if (!validarFoto(legajo)) esValido = false;
            if (!validarTerminos()) esValido = false;

            if (!esValido) {
                form.classList.add("was-validated");
                return;
            }

            const alumno = obtenerDatosFormulario();
            if (alumno.id) {
                modificarAlumno(alumno.id, alumno);
            } else {
                crearAlumno(alumno);
            }
        });

        // Validaciones en tiempo real
        document.getElementById("nombre").addEventListener("input", validarNombre);
        document.getElementById("email").addEventListener("input", validarEmail);
        document.getElementById("pais").addEventListener("change", validarPais);
        document.getElementById("terminos").addEventListener("change", validarTerminos);

        // Vista previa de foto
        const fotoInput = document.getElementById("foto");
        if (fotoInput) {
            fotoInput.addEventListener("change", function () {
                const file = fotoInput.files[0];
                if (file) {
                    if (validarExtensionFoto(file)) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            document.getElementById("foto_img").src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                        fotoInput.setCustomValidity("");
                        fotoInput.classList.remove("is-invalid");
                        fotoInput.classList.add("is-valid");
                        document.getElementById("error-foto").textContent = "";
                    } else {
                        fotoInput.setCustomValidity("Extensión no válida");
                        fotoInput.classList.remove("is-valid");
                        fotoInput.classList.add("is-invalid");
                        document.getElementById("error-foto").textContent =
                            "Solo se permiten archivos JPG, JPEG, PNG o GIF";
                    }
                }
            });
        }

        // Reset
        form.addEventListener("reset", () => {
            setTimeout(() => {
                resetFormulario();
            }, 0);
        });
    }
});

function resetFormulario() {
    const form = document.getElementById("formulario");
    if (!form) return;

    form.reset();
    form.classList.remove("was-validated"); // quitar estado de validación
    limpiarValidaciones();

    // resetear preview de imagen
    document.getElementById("foto_img").src = "./img/user.png";

    // limpiar input de archivo manualmente
    const fotoInput = document.getElementById("foto");
    if (fotoInput) {
        fotoInput.value = "";
    }
}

// Función para limpiar todas las validaciones
function limpiarValidaciones() {
    const inputs = ["nombre", "email", "pais", "foto", "terminos"];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.classList.remove("is-valid", "is-invalid");
            input.setCustomValidity("");
            const errorDiv = document.getElementById(`error-${id}`);
            if (errorDiv) errorDiv.textContent = "";
        }
    });
}

// Validación del nombre
function validarNombre() {
    const nombreInput = document.getElementById("nombre");
    const errorDiv = document.getElementById("error-nombre");
    const nombre = nombreInput.value.trim();

    if (nombre === "") {
        nombreInput.setCustomValidity("El nombre es obligatorio");
        nombreInput.classList.remove("is-valid");
        nombreInput.classList.add("is-invalid");
        errorDiv.textContent = "Por favor, ingrese su nombre";
        return false;
    } else if (nombre.length < 3) {
        nombreInput.setCustomValidity("El nombre debe tener al menos 3 caracteres");
        nombreInput.classList.remove("is-valid");
        nombreInput.classList.add("is-invalid");
        errorDiv.textContent = "El nombre debe tener al menos 3 caracteres";
        return false;
    } else {
        nombreInput.setCustomValidity("");
        nombreInput.classList.remove("is-invalid");
        nombreInput.classList.add("is-valid");
        errorDiv.textContent = "";
        return true;
    }
}

// Validación del email
function validarEmail() {
    const emailInput = document.getElementById("email");
    const errorDiv = document.getElementById("error-email");
    const email = emailInput.value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        emailInput.setCustomValidity("El correo electrónico es obligatorio");
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
        errorDiv.textContent = "Por favor, ingrese un correo electrónico";
        return false;
    } else if (!regexEmail.test(email)) {
        emailInput.setCustomValidity("Formato de correo inválido");
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");
        errorDiv.textContent = "Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)";
        return false;
    } else {
        emailInput.setCustomValidity("");
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
        errorDiv.textContent = "";
        return true;
    }
}

// Validación del país
function validarPais() {
    const paisInput = document.getElementById("pais");
    const errorDiv = document.getElementById("error-pais");

    if (paisInput.value === "") {
        paisInput.setCustomValidity("Debe seleccionar un país");
        paisInput.classList.remove("is-valid");
        paisInput.classList.add("is-invalid");
        errorDiv.textContent = "Por favor, seleccione un país";
        return false;
    } else {
        paisInput.setCustomValidity("");
        paisInput.classList.remove("is-invalid");
        paisInput.classList.add("is-valid");
        errorDiv.textContent = "";
        return true;
    }
}

// Validación de extensión de foto
function validarExtensionFoto(file) {
    const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif'];
    const nombreArchivo = file.name.toLowerCase();
    const extension = nombreArchivo.split('.').pop();
    return extensionesPermitidas.includes(extension);
}

// Validación de foto
function validarFoto(legajo) {
    const fotoInput = document.getElementById("foto");
    const errorDiv = document.getElementById("error-foto");

    // Si estamos editando (hay legajo) y no se seleccionó archivo nuevo
    if (legajo && fotoInput.files.length === 0) {
        fotoInput.setCustomValidity("");
        fotoInput.classList.remove("is-invalid");
        fotoInput.classList.add("is-valid");
        errorDiv.textContent = "";
        return true;
    }

    // Si estamos creando (sin legajo) y no hay archivo
    if (!legajo && fotoInput.files.length === 0) {
        fotoInput.setCustomValidity("La foto es obligatoria");
        fotoInput.classList.remove("is-valid");
        fotoInput.classList.add("is-invalid");
        errorDiv.textContent = "Por favor, seleccione una foto";
        return false;
    }

    // Si hay archivo, validar extensión
    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        if (!validarExtensionFoto(file)) {
            fotoInput.setCustomValidity("Extensión no válida");
            fotoInput.classList.remove("is-valid");
            fotoInput.classList.add("is-invalid");
            errorDiv.textContent = "Solo se permiten archivos JPG, JPEG, PNG o GIF";
            return false;
        }
    }

    fotoInput.setCustomValidity("");
    fotoInput.classList.remove("is-invalid");
    fotoInput.classList.add("is-valid");
    errorDiv.textContent = "";
    return true;
}

// Validación de términos y condiciones
function validarTerminos() {
    const terminosInput = document.getElementById("terminos");
    const errorDiv = document.getElementById("error-terminos");

    if (!terminosInput.checked) {
        terminosInput.setCustomValidity("Debe aceptar los términos y condiciones");
        terminosInput.classList.remove("is-valid");
        terminosInput.classList.add("is-invalid");
        errorDiv.textContent = "Debe aceptar los términos y condiciones para continuar";
        return false;
    } else {
        terminosInput.setCustomValidity("");
        terminosInput.classList.remove("is-invalid");
        terminosInput.classList.add("is-valid");
        errorDiv.textContent = "";
        return true;
    }
}

// Genera la tabla de alumnos dinámicamente en el panel derecho si no existe
function mostrarTablaDinamica() {
    let panel = document.getElementById("panel-derecha");
    if (!panel) {
        const colDerecha = document.querySelector(".col-7.bg-danger-subtle");
        if (colDerecha) {
            panel = document.createElement("nav");
            panel.id = "panel-derecha";
            colDerecha.appendChild(panel);
        }
    }
    if (panel) {
        panel.innerHTML = `
            <table class="table table-hover" id="tabla">
                <thead class="table-dark">
                    <tr>
                        <th>Legajo</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>País</th>
                        <th>Foto</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="cuerpoTabla">
                </tbody>
            </table>
        `;
    }
}

// Obtener datos del formulario
function obtenerDatosFormulario() {
    const fotoInput = document.getElementById("foto");
    const fotoImgActual = document.getElementById("foto_img").src;

    return {
        id: document.getElementById("legajo").value || undefined,
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        pais: document.getElementById("pais").value,
        foto: fotoInput.files.length > 0 ? fotoImgActual : fotoImgActual
    };
}

// Mostrar alumnos en la tabla principal
function mostrarTablaAlumnos(alumnos) {
    const cuerpo = document.getElementById("cuerpoTabla");
    if (!cuerpo) return;
    cuerpo.innerHTML = "";

    alumnos.forEach(alumno => {
        // Obtener valores completos
        const legajoCompleto = alumno.id || alumno.legajo || "";
        const nombreCompleto = alumno.nombre || "";
        const emailCompleto = alumno.email || "";

        // Limitar los caracteres de los campos para mostrar
        const legajoMostrar = legajoCompleto.length > 8 ? legajoCompleto.slice(0, 8) + '...' : legajoCompleto;
        const nombreMostrar = nombreCompleto.length > 15 ? nombreCompleto.slice(0, 15) + '...' : nombreCompleto;
        const emailMostrar = emailCompleto.length > 20 ? emailCompleto.slice(0, 20) + '...' : emailCompleto;

        cuerpo.innerHTML += `
            <tr>
                <td data-bs-toggle="tooltip" data-bs-placement="top" title="${legajoCompleto}">
                    ${legajoMostrar}
                </td>
                <td data-bs-toggle="tooltip" data-bs-placement="top" title="${nombreCompleto}">
                    ${nombreMostrar}
                </td>
                <td data-bs-toggle="tooltip" data-bs-placement="top" title="${emailCompleto}">
                    ${emailMostrar}
                </td>
                <td>${alumno.pais || ""}</td>
                <td><img src="${alumno.foto || "./img/user.png"}" width="70" height="70"></td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="cargarAlumnoEnFormulario('${legajoCompleto}')">Editar</button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarAlumno('${legajoCompleto}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    // Inicializar los tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// GET todos los alumnos
function obtenerAlumnos() {
    toggleSpinner(true);
    fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos")
        .then(response => response.json())
        .then(data => {
            mostrarTablaAlumnos(data);
        })
        .catch(error => {
            alert("Error al obtener alumnos: " + error);
        })
        .finally(() => toggleSpinner(false));
}

// GET alumno por legajo
function obtenerAlumnoPorLegajo(legajo) {
    toggleSpinner(true);
    return fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`)
        .then(response => response.json())
        .finally(() => toggleSpinner(false));
}

// POST crear alumno
function crearAlumno(alumno) {
    toggleSpinner(true);
    fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumno)
    })
        .then(response => response.json())
        .then(() => {
            mostrarTablaDinamica();
            obtenerAlumnos();
            alert("Alumno creado exitosamente");
            resetFormulario();
        })
        .catch(error => alert("Error al crear alumno: " + error))
        .finally(() => toggleSpinner(false));
}

// PUT modificar alumno
function modificarAlumno(legajo, alumno) {
    fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumno)
    })
        .then(response => response.json())
        .then(() => {
            mostrarTablaDinamica();
            obtenerAlumnos();
            alert("Alumno modificado exitosamente");
            resetFormulario();
        })
        .catch(error => alert("Error al modificar alumno: " + error));
}

// DELETE eliminar alumno
function eliminarAlumno(legajo) {
    if (!confirm("¿Está seguro de eliminar este alumno?")) return;
    fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`, {
        method: "DELETE"
    })
        .then(() => {
            mostrarTablaDinamica();
            obtenerAlumnos();
            alert("Alumno eliminado exitosamente");
            resetFormulario();
        })
        .catch(error => alert("Error al eliminar alumno: " + error));
}

// Cargar datos en el formulario para editar
function cargarAlumnoEnFormulario(legajo) {
    obtenerAlumnoPorLegajo(legajo).then(alumno => {
        document.getElementById("legajo").value = alumno.legajo || "";
        document.getElementById("nombre").value = alumno.nombre;
        document.getElementById("email").value = alumno.email || "";
        document.getElementById("pais").value = alumno.pais || "";
        document.getElementById("foto_img").src = alumno.foto || "./img/user.png";

        // Limpiar validaciones y marcar campos como válidos
        limpiarValidaciones();

        const fotoInput = document.getElementById("foto");
        if (fotoInput) {
            fotoInput.value = "";
            fotoInput.setCustomValidity("");
            fotoInput.classList.remove("is-invalid");
            fotoInput.classList.add("is-valid");
        }

        // Marcar campos cargados como válidos
        document.getElementById("nombre").classList.add("is-valid");
        document.getElementById("email").classList.add("is-valid");
        document.getElementById("pais").classList.add("is-valid");

        const form = document.getElementById("formulario");
        if (form) {
            form.classList.remove("was-validated");
        }
    });
}

// ############################ EXTRAS ####################################
function toggleSpinner(mostrar) {
    const spinner = document.getElementById("spinner");
    if (!spinner) return;

    if (mostrar) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
}

// Para que las funciones sean accesibles desde los botones 
window.eliminarAlumno = eliminarAlumno;
window.cargarAlumnoEnFormulario = cargarAlumnoEnFormulario;