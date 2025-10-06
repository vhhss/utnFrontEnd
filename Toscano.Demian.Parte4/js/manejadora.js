document.addEventListener("DOMContentLoaded", () => {
    recuperarPinturas();
    const btnAgregar = document.getElementById("btnAgregar");
    btnAgregar.addEventListener("click", agregarPintura);
    
    const btnModificar = document.getElementById("btnModificar");
    btnModificar.addEventListener("click", modificarPintura);

    document.getElementById("btnFiltros").addEventListener("click", filtrarPorMarca);
    document.getElementById("btnPromedio").addEventListener("click", mostrarPromedio);
});

function recuperarPinturas() {
    activarSpinner(true);
    fetch("https://utnfra-api-pinturas.onrender.com/pinturas")
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos del servidor:", data);
            mostrarListadoPinturas(data);
        })
        .catch(error => {
            console.error("Error al recuperar pinturas:", error);
            alert("No se pudieron obtener las pinturas del servidor.");
        })
        .finally(() => activarSpinner(false));
}

function mostrarListadoPinturas(pinturas) {
    const divListado = document.getElementById("divListado");

    let html = `
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>MARCA</th>
                    <th>PRECIO</th>
                    <th>COLOR</th>
                    <th>CANTIDAD</th>
                    <th>ACCIONES</th>
                </tr>
            </thead>
            <tbody>
    `;

    pinturas.forEach(p => {
        html += `
            <tr>
                <td>${p.id}</td>
                <td>${p.marca}</td>
                <td>$${p.precio}</td>
                <td><input type="color" value="${p.color}" disabled></td>
                <td>${p.cantidad}</td>
                <td>
                    <button class="btn btn-warning btn-sm btnSeleccionar" data-id="${p.id}" title="Seleccionar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btnEliminar" data-id="${p.id}" data-marca="${p.marca}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    divListado.innerHTML = html;

    const botonesSeleccionar = document.querySelectorAll(".btnSeleccionar");
    botonesSeleccionar.forEach((b, i) => {
        b.addEventListener("click", () => seleccionarPintura(pinturas[i]));
    });

    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    botonesEliminar.forEach(b => {
        b.addEventListener("click", eliminarPintura);
    });
}

function agregarPintura() {
    if (!validarFormulario()) return;

    const pintura = {
        marca: document.getElementById("inputMarca").value,
        precio: parseFloat(document.getElementById("inputPrecio").value),
        color: document.getElementById("inputColor").value,
        cantidad: parseInt(document.getElementById("inputCantidad").value)
    };

    activarSpinner(true);

    fetch("https://utnfra-api-pinturas.onrender.com/pinturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pintura)
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            recuperarPinturas();
            limpiarFormulario();
        } else {
            alert("No se pudo agregar la pintura.");
        }
    })
    .catch(() => alert("Error al agregar la pintura."))
    .finally(() => activarSpinner(false));
}

function seleccionarPintura(pintura) {
    document.getElementById("inputID").value = pintura.id;
    document.getElementById("inputMarca").value = pintura.marca;
    document.getElementById("inputPrecio").value = pintura.precio;
    document.getElementById("inputColor").value = pintura.color;
    document.getElementById("inputCantidad").value = pintura.cantidad;

    alert(" Pintura cargada en el formulario para modificar.");
}

function modificarPintura() {
    if (!validarFormulario()) return;

    const id = document.getElementById("inputID").value;
    const pintura = {
        marca: document.getElementById("inputMarca").value,
        precio: parseFloat(document.getElementById("inputPrecio").value),
        color: document.getElementById("inputColor").value,
        cantidad: parseInt(document.getElementById("inputCantidad").value)
    };

    activarSpinner(true);

    fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pintura)
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            recuperarPinturas();
            limpiarFormulario();
        } else {
            alert(data.mensaje || "No se pudo modificar la pintura.");
        }
    })
    .catch(() => alert("Error al modificar la pintura."))
    .finally(() => activarSpinner(false));
}

function eliminarPintura(e) {
    const id = e.target.getAttribute("data-id");
    const marca = e.target.getAttribute("data-marca");

    const confirmar = confirm(`¿Desea eliminar la pintura con ID ${id} y MARCA ${marca}?`);
    if (!confirmar) return;

    activarSpinner(true);

    fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            recuperarPinturas();
        } else {
            alert(data.mensaje);
        }
    })
    .catch(() => alert("Error al eliminar la pintura."))
    .finally(() => activarSpinner(false));
}

function validarFormulario() {
    let esValido = true;

    //marca
    const marcaInput = document.getElementById("inputMarca");
    const errorMarca = document.getElementById("errorMarca");
    if (marcaInput.value.trim() === "") {
        marcaInput.classList.add("is-invalid");
        errorMarca.textContent = "La marca es obligatoria.";
        esValido = false;
    } else {
        marcaInput.classList.remove("is-invalid");
        marcaInput.classList.add("is-valid");
        errorMarca.textContent = "";
    }

    //precio
    const precioInput = document.getElementById("inputPrecio");
    const errorPrecio = document.getElementById("errorPrecio");
    const precio = parseFloat(precioInput.value);
    if (isNaN(precio) || precio < 50 || precio > 500) {
        precioInput.classList.add("is-invalid");
        errorPrecio.textContent = "El precio debe estar entre 50 y 500 USD.";
        esValido = false;
    } else {
        precioInput.classList.remove("is-invalid");
        precioInput.classList.add("is-valid");
        errorPrecio.textContent = "";
    }

    //color
    const colorInput = document.getElementById("inputColor");
    const errorColor = document.getElementById("errorColor");
    if (colorInput.value.trim() === "") {
        colorInput.classList.add("is-invalid");
        errorColor.textContent = "Debe seleccionar un color.";
        esValido = false;
    } else {
        colorInput.classList.remove("is-invalid");
        colorInput.classList.add("is-valid");
        errorColor.textContent = "";
    }

    //cantidad
    const cantidadInput = document.getElementById("inputCantidad");
    const errorCantidad = document.getElementById("errorCantidad");
    const cantidad = parseInt(cantidadInput.value);
    if (isNaN(cantidad) || cantidad < 1 || cantidad > 400) {
        cantidadInput.classList.add("is-invalid");
        errorCantidad.textContent = "La cantidad debe estar entre 1 y 400.";
        esValido = false;
    } else {
        cantidadInput.classList.remove("is-invalid");
        cantidadInput.classList.add("is-valid");
        errorCantidad.textContent = "";
    }

    return esValido;
}

function limpiarFormulario() {
    const form = document.getElementById("frmFormulario");
    form.reset();

    form.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
    });
}

function activarSpinner(mostrar) {
    const spinner = document.getElementById("spinner");
    if (!spinner) return;
    spinner.classList.toggle("d-none", !mostrar);
}

function filtrarPorMarca() {
    const marcaFiltro = document.getElementById("inputMarca").value.trim().toLowerCase();
    if (!marcaFiltro) {
        alert("Ingrese una marca para filtrar.");
        return;
    }

    activarSpinner(true);
    fetch("https://utnfra-api-pinturas.onrender.com/pinturas")
        .then(res => res.json())
        .then(data => {
            const normalizar = v => String(v ?? "").trim().toLowerCase();
            const filtradas = data.filter(p => normalizar(p.marca) === marcaFiltro);
            mostrarListadoPinturas(filtradas);

            if (filtradas.length === 0) {
                alert("No se encontraron pinturas con esa marca.");
            }
        })
        .catch(err => {
            console.error("Error al filtrar:", err);
            alert("No se pudieron obtener las pinturas para filtrar.");
        })
        .finally(() => activarSpinner(false));
}

function mostrarPromedio() {
    activarSpinner(true);
    fetch("https://utnfra-api-pinturas.onrender.com/pinturas")
        .then(res => res.json())
        .then(data => {
            const preciosValidos = data
                .map(p => parseFloat(p.precio))
                .filter(p => !isNaN(p) && p > 0);

            if (preciosValidos.length === 0) {
                alert("No hay precios válidos para calcular el promedio.");
                return;
            }

            const total = preciosValidos.reduce((acc, precio) => acc + precio, 0);
            const promedio = (total / preciosValidos.length).toFixed(2);

            alert(`💰🥵 Precio promedio: $${promedio} USD`);
        })
        .catch(() => alert("Error al calcular el promedio."))
        .finally(() => activarSpinner(false));
}

