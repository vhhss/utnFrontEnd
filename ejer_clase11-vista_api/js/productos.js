window.addEventListener("load", () => {
    mostrarListado();
});

async function mostrarListado() {

    try {

        const opciones = {
            method: "GET",
        };

        let res = await manejadorFetch(URL_API + "productos", opciones);

        let resJSON = await res.json();

        mostrarListadoProductos(resJSON);

    } catch (err) {

        fail(err);
    }          
}

function mostrarListadoProductos(prod_obj_array) {

    console.log("Mostrar: ", prod_obj_array);

    let div = document.getElementById("divListado");

    let tabla = `<table class="table table-hover">
                    <tr>
                        <th>CÓDIGO</th><th>MARCA</th><th>PRECIO</th><th>ACCIONES</th>
                    </tr>`;
                if(prod_obj_array.length < 1){
                    tabla += `<tr><td>---</td><td>---</td><td>---</td><td>---</td></tr>`;
                }
                else {

                    for (let index = 0; index < prod_obj_array.length; index++) {
                        const dato = prod_obj_array[index];
                        if(dato == null){
                            continue;
                        }
                        tabla += `<tr><td>${dato.codigo}</td><td>${dato.marca}</td><td>${dato.precio}</td>
                                    <td><button type="button" class="btn btn-info" id="" 
                                            data-obj='${JSON.stringify(dato)}' name="btnSeleccionar">
                                            <span class="bi bi-pencil"></span>
                                        </button>
                                        <button type="button" class="btn btn-danger" id="" 
                                            data-codigo='${dato.codigo}' name="btnEliminar">
                                            <span class="bi bi-x-circle"></span>
                                        </button>
                                    </td></tr>`;
                    }  
                }
    tabla += `</table>`;

    div.innerHTML = tabla;

    document.getElementsByName("btnSeleccionar").forEach((boton)=> {

        boton.addEventListener("click", ()=> { 

            let obj= boton.getAttribute("data-obj");
            let obj_dato = JSON.parse(obj);

            document.getElementById("codigo").value = obj_dato.codigo;
            document.getElementById("marca").value = obj_dato.marca;
            document.getElementById("precio").value = obj_dato.precio;   

            document.getElementById("codigo").readOnly = true;

            let btn = document.getElementById("btnForm");
            btn.value = "Modificar";

            btn.onclick = ()=> modificarProducto();
        });
    });

    document.getElementsByName("btnEliminar").forEach((boton)=>{

        boton.addEventListener("click", ()=>{ 

            let codigo = boton.getAttribute("data-codigo");

            if(confirm(`¿Seguro de eliminar producto con código ${codigo}?`)){
                
                eliminarProducto(codigo);
            }                
        });
    });

}

async function agregarProducto() {
        
    let codigo = parseInt(document.getElementById("codigo").value);
    let marca = document.getElementById("marca").value;
    let precio = parseFloat(document.getElementById("precio").value);

    let data = {
        "codigo" : codigo,
        "marca" : marca,
        "precio" : precio
    };

    const opciones = {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json",  },
    };

    try {

        let res = await manejadorFetch(URL_API + "productos", opciones);
    
        let resCadena = await res.text(); 
        
        console.log("Agregar: ", resCadena);
        
        success();

    } catch (err) {
    
        fail(err);
    }
}

async function modificarProducto() {

    let codigo = parseInt(document.getElementById("codigo").value);
    let marca = document.getElementById("marca").value;
    let precio = parseFloat(document.getElementById("precio").value);

    let data = {
        "codigo" : codigo,
        "marca" : marca,
        "precio" : precio
    };

    const opciones = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json",  },
    };

    try {

        let res = await manejadorFetch(URL_API + "productos", opciones);
    
        let resCadena = await res.text(); 
        
        console.log("Modificar: ", resCadena);

        let btn = document.getElementById("btnForm");
        btn.value = "Agregar";

        btn.onclick = ()=> agregarProducto();

        success();

    } catch (err) {
    
        fail(err);
    }
}

async function eliminarProducto(codigo) {

    let data = `{"codigo": ${codigo}}`;

    const opciones = {
        method: "DELETE",
        body: data,
        headers: {"Accept": "*/*", "Content-Type": "application/json"},
    };

    try {

        let res = await manejadorFetch(URL_API + "productos", opciones);
    
        let resCadena = await res.text(); 
        
        console.log("Eliminar: ", resCadena);

        success();

    } catch (err) {
    
        fail(err);
    }
}


function fail(retorno) {
    console.error(retorno);
    alert("Ha ocurrido un ERROR!!!");
}

function success() {
    mostrarListado();
    limpiarForm();
}

function limpiarForm() {
    document.getElementById("codigo").readOnly = false;
    document.getElementById("codigo").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("precio").value = "";
}