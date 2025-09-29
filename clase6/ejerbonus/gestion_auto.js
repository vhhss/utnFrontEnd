document.addEventListener("DOMContentLoaded", () => {
    var autos_local = [];
    if (localStorage.getItem("autos") === null) {
        alert("No hay nada en el localStorage, se crea");
        setAutos(MOCK);
        autos_local = MOCK;
        
    } else {
        autos_local = getAutos();
    }
    console.log(autos_local);
    armar_tabla();

    document.querySelector("#formAuto").addEventListener("submit", guardar)

    document.querySelector("#tablaAutos tbody").addEventListener("click", (e) => {
        if (e.target.classList.contains("btnEliminar")){
            //let id = parseInt(e.target.getAttribute("data-is"));
            let id = e.target.dataset.id;
            
            let autos = getAutos();
            if(confirm("¿confirma la eliminación?")){
                autos = autos.filter((auto) => auto.id != id);
            
                setAutos(autos);
                armar_tabla()
            }
        }
    })
    document.querySelector("#head").addEventListener("click", (e)=>{
        if (e.target.classList.contains("btnJSON")){
            mostrarJson();
        }
    })
});


function getAutos() {
  return JSON.parse(localStorage.getItem("autos"));
}

function setAutos(autos) {
  localStorage.setItem("autos", JSON.stringify(autos));
}

function armar_tabla() {
    const AUTOS = getAutos();
    let tbody = document.querySelector("#tablaAutos tbody");
    tbody.innerHTML = "";

    AUTOS.forEach(auto => {
        let fila = document.createElement("tr");
        fila.innerHTML = `<td> ${auto.id} </td>
                        <td> ${auto.marca} </td>
                        <td> ${auto.precio} </td>
                        <td><input type="color" value="${auto.color}" disabled> </td>
                        <td><button class="btnEliminar" data-id="${auto.id}">Eliminar</button></td>`;
        tbody.appendChild(fila);
    })
}

function guardar(e){
    //cancela la accion por default de este evento
    e.preventDefault();
    
    
    let id = 0;
    let marca = document.querySelector("#marca").value;
    let precio = parseFloat(document.querySelector("#precio").value);
    let color = document.querySelector("#color").value;

    let autos = getAutos();

    let maxId = autos.reduce((maximo,auto)=> auto.id > maximo ? auto.id:maximo, -1);
    id = maxId + 1
    console.log(maxId);

    autos.push({id:id, marca:marca, precio:precio, color:color})

    setAutos(autos);

    armar_tabla();
}

function mostrarJson(e){
    e.preventDefault();
    alert("Autos leido: " + JSON.stringify(autos));
}