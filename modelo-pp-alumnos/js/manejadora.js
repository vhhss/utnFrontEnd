document.addEventListener("DOMContentLoaded", () => {

    const mostrarEnlace = document.getElementById("mostrar");
    const form = document.getElementById("formulario");
    const btnArg = document.getElementById("mostrar-argentinos");
    const btnHom = document.getElementById("mostrar-homonimos");

    if (mostrarEnlace) {
        mostrarEnlace.addEventListener("click", (e) => {
            e.preventDefault();
            recuperarAlumnos();
        });
    }
    
    if (form) {
    form.addEventListener("submit", (e) =>{
        e.preventDefault();

        const nombreOk = validarNombre();
        const emailOk = validarEmail();
        const paisOk = validarPais();
        const fotoOk = validarFoto();
        const terminosOk = validarTerminos();

        if (nombreOk && emailOk && paisOk && fotoOk && terminosOk) {
            enviarAlumno(); // tu función fetch POST
        } else {
            alert("Corrija los errores antes de enviar.");
        }
    });
    
    if (btnArg) {
        btnArg.addEventListener("click", (e) => {
            e.preventDefault();
            toggleSpinner(true);

            fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos")
                .then(res => res.json())
                .then(data => {
                    const argentinos = data.filter(al => al.pais?.toLowerCase() === "argentina");
                    mostrarListadoEnPanelDerecha(argentinos);
                })
                .catch(err => alert("Error al filtrar argentinos: " + err))
                .finally(() => toggleSpinner(false));
        });
    }

    if (btnHom) {
        btnHom.addEventListener("click", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value.trim();
            if (!nombre) {
                alert("Ingrese un nombre en el formulario para buscar homónimos");
                return;
            }
            toggleSpinner(true);

            fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos")
                .then(res => res.json())
                .then(data => {
                    const homonimos = data.filter(al =>
                        al.nombre?.toLowerCase() === nombre.toLowerCase()
                    );
                    mostrarListadoEnPanelDerecha(homonimos);
                })
                .catch(err => alert("Error al filtrar homónimos: " + err))
                .finally(() => toggleSpinner(false));
        });
    }
}
});

function recuperarAlumnos() {
    toggleSpinner(true);
    fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos")
        .then(response => response.json())
        .then(data => {
            mostrarListadoEnPanelDerecha(data);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => toggleSpinner(false));
}

function mostrarListadoEnPanelDerecha(alumnos) {
    const panel = document.getElementById("panel-derecha");
    if (!panel) return;
    if (!Array.isArray(alumnos) || alumnos.length === 0) {
        panel.innerHTML = "<div class='alert alert-warning'>No hay alumnos para mostrar.</div>";
        return;
    }
    let html = 
            `<table class='table table-striped table-hover table-bordered'>
                <thead>
                    <tr>
                    <th>LEGAJO</th>
                    <th>NOMBRE</th>
                    <th>CORREO</th>
                    <th>FOTO</th>
                    <th>PAÍS</th>
                    <th>X</th>
                    </tr>
                </thead><tbody>`;
    alumnos.forEach(alumno => {
        html += `<tr>
            <td>
            <a href="#" onclick="obtenerAlumnoPorLegajo(${alumno.legajo}); return false;">
                ${alumno.legajo}
            </a>
            </td>
            <td>${alumno.nombre}</td>
            <td>${alumno.email}</td>
            <td><img src='${alumno.foto}' alt='Foto' class='foto-listado'></td>
            <td>${alumno.pais}</td>
            <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarAlumno(${alumno.legajo})">
                <i class="bi bi-trash"></i>
            </button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    panel.innerHTML = html;
}

function enviarAlumno() {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const pais = document.getElementById("pais").value;
    const foto = document.getElementById("foto");
    const terminos = document.getElementById("terminos").checked;

    if (
        !validarNombre(nombre) ||
        !validarEmail(email) ||
        !validarPais(pais) ||
        !validarFoto(foto) ||
        !validarTerminos(terminos)
    ) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const alumno = {
            nombre: nombre,
            email: email,
            pais: pais,
            foto: reader.result
        };
        toggleSpinner(true);
        fetch("https://api-alumnos-modelo-pp.onrender.com/alumnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumno)
        })
        .then(res => {
            if (!res.ok) {
                // Si la respuesta no es exitosa, lanza un error para ir directo al catch
                throw new Error("Error al agregar el alumno");
            }
            // Si todo va bien, convierte la respuesta a JSON
            return res.json();
        })
        .then(() => {
            alert("Alumno agregado correctamente");
            recuperarAlumnos(); // ✅ solo se actualiza si el POST fue exitoso
        })
        .catch(err => {
            console.error("Error:", err);
            alert("No se pudo agregar el alumno. Verifique los datos o intente más tarde.");
        })
        .finally(() => toggleSpinner(false));
    };

    if (foto.files.length > 0) {
        reader.readAsDataURL(foto.files[0]);
    }
}

function validarNombre() {
    const input = document.getElementById("nombre");
    const errorDiv = document.getElementById("error-nombre");
    const valor = input.value.trim();

    if (valor === "") {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "El nombre es obligatorio.";
        return false;
    } else if (valor.length < 3) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "Debe tener al menos 3 caracteres.";
        return false;
    } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        errorDiv.textContent = "";
        return true;
    }
}

function validarEmail() {
    const input = document.getElementById("email");
    const errorDiv = document.getElementById("error-email");
    const valor = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === "") {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "El correo electrónico es obligatorio.";
        return false;
    } else if (!regex.test(valor)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "Formato de correo inválido (ej: usuario@dominio.com).";
        return false;
    } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        errorDiv.textContent = "";
        return true;
    }
}

function validarPais() {
    const input = document.getElementById("pais");
    const errorDiv = document.getElementById("error-pais");

    if (input.value === "") {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "Debe seleccionar un país.";
        return false;
    } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        errorDiv.textContent = "";
        return true;
    }
}

function validarFoto() {
    const input = document.getElementById("foto");
    const errorDiv = document.getElementById("error-foto");
    const file = input.files[0];

    if (!file) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "Debe seleccionar una foto.";
        return false;
    }

    const extensiones = ["jpg", "jpeg", "png", "gif"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!extensiones.includes(extension)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "Extensión no válida (JPG, JPEG, PNG o GIF).";
        return false;
    } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        errorDiv.textContent = "";
        return true;
    }
}

function validarTerminos() {
    const input = document.getElementById("terminos");
    const errorDiv = document.getElementById("error-terminos");

    if (!input.checked) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorDiv.textContent = "Debe aceptar los términos y condiciones.";
        return false;
    } else {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        errorDiv.textContent = "";
        return true;
    }
}

function obtenerAlumnoPorLegajo(legajo) {
    if (!legajo) return;

    toggleSpinner(true);
    fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener datos del alumno.");
            }
            return response.json();
        })
        .then(alumno => {
            // Mostrar la info en los campos del formulario
            document.getElementById("legajo").value = alumno.legajo || "";
            document.getElementById("nombre").value = alumno.nombre || "";
            document.getElementById("email").value = alumno.email || "";
            document.getElementById("pais").value = alumno.pais || "";
            document.getElementById("foto_img").src = alumno.foto || "./img/user.png";

            // Limpiar clases visuales y marcar los campos como válidos
            limpiarValidacionesFormulario();

            document.getElementById("nombre").classList.add("is-valid");
            document.getElementById("email").classList.add("is-valid");
            document.getElementById("pais").classList.add("is-valid");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudo obtener la información del alumno.");
        })
        .finally(() => toggleSpinner(false));
}

function limpiarValidacionesFormulario() {
    const campos = ["nombre", "email", "pais", "foto", "terminos"];
    campos.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.classList.remove("is-valid", "is-invalid");
        }
    });
}

function modificarAlumno(legajo) {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const pais = document.getElementById("pais").value;
    const foto = document.getElementById("foto");
    const terminos = document.getElementById("terminos").checked;

    // Validaciones antes de enviar
    if (!validarNombre() || !validarEmail() || !validarPais() || !validarFoto() || !validarTerminos()) {
        alert("Corrija los errores antes de enviar.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const alumno = {
            nombre: nombre,
            email: email,
            pais: pais,
            foto: reader.result
        };

        // Envío de modificación (PUT /alumnos/:legajo)

        toggleSpinner(true);
        fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumno)
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al modificar el alumno.");
            return res.json();
        })
        .then(() => {
            alert("Alumno modificado correctamente");
            recuperarAlumnos(); // refrescar listado
            resetearModoFormulario(); // volver a modo alta
        })
        .catch(err => {
            console.error("Error:", err);
            alert("No se pudo modificar el alumno.");
        })
        .finally(() => toggleSpinner(false));
    };

    // Si no se cargó una nueva foto, usa la actual mostrada en pantalla
    if (foto.files.length > 0) {
        reader.readAsDataURL(foto.files[0]);
    } else {
        const alumno = {
            nombre: nombre,
            email: email,
            pais: pais,
            foto: document.getElementById("foto_img").src
        };

        fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumno)
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al modificar el alumno.");
            return res.json();
        })
        .then(() => {
            alert("Alumno modificado correctamente");
            recuperarAlumnos(); // refrescar listado
            resetearModoFormulario(); // volver a modo alta
        })
        .catch(err => {
            console.error("Error:", err);
            alert("No se pudo modificar el alumno.");
        });
    }
}

function resetearModoFormulario() {
    const form = document.getElementById("formulario");
    const nuevoForm = form.cloneNode(true); // clona para eliminar manejadores previos
    form.parentNode.replaceChild(nuevoForm, form);

    // Reasignar manejador para agregar alumno nuevo (POST)
    nuevoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        enviarAlumno();
    });

    // Limpiar formulario visualmente
    nuevoForm.reset();
    document.getElementById("foto_img").src = "./img/user.png";
}

function eliminarAlumno(legajo) {
    // Buscar los datos del alumno antes de confirmar

    toggleSpinner(true);
    fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener datos del alumno.");
            return res.json();
        })
        .then(alumno => {
            // Confirmar eliminación mostrando legajo, nombre y correo
            const confirmar = confirm(`¿Eliminar alumno?\n\nLegajo: ${alumno.legajo}\nNombre: ${alumno.nombre}\nCorreo: ${alumno.email}`);
            if (!confirmar) return;

            // Eliminar alumno (DELETE /alumnos/:legajo)
            fetch(`https://api-alumnos-modelo-pp.onrender.com/alumnos/${legajo}`, {
                method: "DELETE"
            })
            .then(res => {
                if (!res.ok) throw new Error("Error al eliminar el alumno.");
                return res.json();
            })
            .then(() => {
                alert("Alumno eliminado correctamente.");
                recuperarAlumnos(); // refrescar listado
            })
            .catch(err => {
                console.error("Error:", err);
                alert("No se pudo eliminar el alumno.");
            })
            .finally(() => toggleSpinner(false));
        })
        .catch(err => {
            console.error("Error:", err);
            alert("No se pudo obtener la información del alumno.");
        });
}

function toggleSpinner(mostrar) {
    const spinner = document.getElementById("spinner");
    if (!spinner) return;

    if (mostrar) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
}