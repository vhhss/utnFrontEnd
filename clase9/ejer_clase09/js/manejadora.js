document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById('formulario');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

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
    
});