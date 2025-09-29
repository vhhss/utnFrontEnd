document.addEventListener("DOMContentLoaded", () => {

    const mensajes ={

        "nombre":{valueMissing:"Por favor ingrese su nombre."},
        "email":{valueMissing:"", typeMismatch: ""},
        "clave":{valueMissing:"",tooShort:"",tooLong:""},
        "pais":{valueMissing:""},
        "terminos":{valueMissing:""}

    }

    const form = document.getElementById('formulario');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Mostrar los ids y analizar el objeto validityState de los campos inválidos
        const invalidFields = form.querySelectorAll(":invalid");
        invalidFields.forEach(campo => {
            if (campo.id) {
                console.log("Campo inválido:", campo.id);
                console.log("validityState:", campo.validity);
                establecerError(campo.id)
            }
        });

        if(form.checkValidity()) {
            const obj = {};
            obj.nombre = document.querySelector("#nombre").value;
            obj.email = document.querySelector("#email").value;
            obj.clave = document.querySelector("#clave").value;
            obj.pais = document.querySelector("#pais").value;

            console.log(obj);
            alert("se enviaron los datos...");
        } else {
            alert("el formulario tiene errores, revise los campos.");
        }
        form.classList.add('was-validated');
    });

    function establecerError(id){
    let divError = document.getElementById("error-"+id);
    const campo = document.getElementById(id);
    for(const error in campo.validity){
        if(campo.validity[error] == true && mensajes[id][error]){
            divError.innerHTML = mensajes[id][error]
            break
        }
    }
}
    
});

