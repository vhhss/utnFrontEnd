const express = require('express');

const rutas = express.Router();

//AGREGO FILE SYSTEM
const fs = require('fs');

const Producto = require("./producto")

//INDICO RUTA HACIA EL ARCHIVO
const PATH_ARCHIVO = "./archivos/productos.json";

//listar

rutas.get('/', (request, response) => {

    response.json(Producto.obtenerTodos());

})

//AGREGAR

rutas.post('/', (request, response)=>{

    //response.send('POST - servidor Node.JS');

    let estado = 200;
    const obj_resp  = {"exito" : false, "mesaje" : "No se pudo agregar"};
    const producto = { ...request.body };

    console.log(producto);

    if(fs.existsSync(PATH_ARCHIVO)){

        const data = fs.readFileSync(PATH_ARCHIVO);
        const productos = JSON.parse(data);

        productos.push(producto)

        fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos, null, 2))

        estado = 201;
        obj_resp.mensaje = "el prod fue agregado con exito.";
    }

    response.json(producto);
    //response.status(estado).json(obj_resp);
});

//MODIFICAR
rutas.put('/', (request, response)=>{

    let estado = 200;
    const obj_resp  = {"exito" : false, "mesaje" : "No se pudo modificar"};
    const producto = { ...request.body };

    console.log(producto);

    if(fs.existsSync(PATH_ARCHIVO)){

        const data = fs.readFileSync(PATH_ARCHIVO);
        const productos = JSON.parse(data);

        const indice = productos.findIndex(p => parseInt(p.codigo) === parseInt(producto.codigo))
        
        if(indice === -1){
            obj_resp.mensaje = "No se ha encontrado el product " + producto.codigo;
        }else{
            productos[indice] = producto;
            fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos, null, 2))

            estado = 201;
            obj_resp.mensaje = "el prod fue modificado con exito.";
            
        }
        
    }

    response.json(producto);
    //response.status(estado).json(obj_resp);

});

//ELIMINAR
rutas.delete('/', (request, response)=>{

    let estado = 200;
    const obj_resp  = {"exito" : false, 'mesaje' : "No se pudo eliminar"};
    const producto = { ...request.body };

    console.log(producto);

    if(fs.existsSync(PATH_ARCHIVO)){

        const data = fs.readFileSync(PATH_ARCHIVO);
        const productos = JSON.parse(data);

        const indice = productos.findIndex(p => parseInt(p.codigo) === parseInt(producto.codigo))
        
        if(indice === -1){
            obj_resp.mensaje = "No se ha encontrado el product " + producto.codigo;
        }else{
            
            const productos_delete = productos.filter(p => parseInt(p.codigo) !== parseInt(producto.codigo))

            fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos_delete, null, 2))

            estado = 205;

            obj_resp.exito = true;
            obj_resp.mensaje = "el prod fue se eliminó con exito.";
            
        }
        
    }

    response.status(estado).json(obj_resp);

});

module.exports = rutas;