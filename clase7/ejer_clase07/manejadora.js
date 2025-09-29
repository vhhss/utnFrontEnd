let pagina = 1;

document.addEventListener("DOMContentLoaded", () => {

    listarUsuarios(pagina);

    document.querySelector("#btnAnterior").addEventListener("click", () => {
        if (pagina > 1){
            pagina--;
            listarUsuarios(pagina);
        }
    })

    document.querySelector("#btnSiguiente").addEventListener("click", () => {
        pagina++;
        listarUsuarios(pagina);
    })

});

async function listarUsuarios(p = 1) {

    try {
        let res = await manejadorFetch(API_URL + `users?page=${p}`, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "x-api-key": "reqres-free-v1"
                }
            });
        console.log(res)
        let resJSON = await res.json();
        console.log(resJSON)

        //console.log("Página actual: ", p, resJSON);

        document.querySelector("#listado").innerHTML = armarListadoHTML(resJSON);



    } catch (err) {

        alert(err);
    }    

}

function armarListadoHTML(params) {
  
  let html = `
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Correo</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Avatar</th>
        </tr>
      </thead>
      <tbody>
  `;

  params.data.forEach(u => {
    html += `
      <tr>
        <td><a href="#" onclick="mostrarDetalle(${u.id})">${u.id}</a></td>
        <td>${u.email}</td>
        <td>${u.first_name}</td>
        <td>${u.last_name}</td>
        <td><img src="${u.avatar}" alt="avatar" /></td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

async function mostrarDetalle(id) {
  console.log(id)
  
  try {
    const res = await manejadorFetch(API_URL + `users/${id}`, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "x-api-key": "reqres-free-v1"
                }
            });
    console.log("Respuesta fetch:", res);
    const resJson = await res.json();
    console.log("JSON recibido:", resJson);

    const u = resJson.data;

    document.getElementById("inputNombre").value = u.first_name || "";
    document.getElementById("inputApellido").value = u.last_name || "";
    document.getElementById("inputCorreo").value = u.email || "";

    document.getElementById("imgAvatar").src = u.avatar || "./img/utnLogo.png";
    
  } catch (err) {
    alert("Error al cargar usuario: " + err);
  }
}