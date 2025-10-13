const express = require('express');

const app = express();

app.set('puerto', 9876);


//AGREGO FILE SYSTEM
const fs = require('fs');

//AGREGO JSON
app.use(express.json());

//INDICO RUTA HACIA EL ARCHIVO
const PATH_ARCHIVO = "./archivos/productos.json";

const multer = require('multer');
const mime = require('mime-types');

const PATH_ARCHIVO_FOTOS = "./archivos/productos_fotos.json";

const upload = multer({
    storage: multer.diskStorage({
                destination: "public/fotos/",
            })
});

app.use(express.static("public"));


//##############################################################################################//
//RUTAS PARA EL CRUD ARCHIVOS
//##############################################################################################//

//LISTAR
app.get('/productos', (request, response) => {

    let retorno = {};

    if(fs.existsSync(PATH_ARCHIVO)){

        const data = fs.readFileSync(PATH_ARCHIVO);
        retorno = JSON.parse(data);
    }

    response.json(retorno);

});

//AGREGAR
app.post('/productos', (request, response)=>{

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
app.put('/productos', (request, response)=>{

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
app.delete('/productos', (request, response)=>{

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


app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});

//AGREGAR
app.post('/productos_fotos', upload.single("foto"), (request, response)=>{

    //response.send('POST - servidor Node.JS');

    let estado = 200;
    const obj_resp  = {"exito" : false, "mesaje" : "No se pudo agregar"};
    //const producto = { ...request.body };

    let file = request.file;
    let ext = mime.extension(file.mimetype)
    let obj = JSON.parse(request.body.obj_producto)
    let path = file.destination + obj.codigo + "." + ext

    fs.renameSync(request.file.path, path);

    obj.path = path.split("public/")[1];

    if(fs.existsSync(PATH_ARCHIVO_FOTOS)){

        const data = fs.readFileSync(PATH_ARCHIVO_FOTOS);
        const productos = JSON.parse(data);

        productos.push(obj)

        fs.writeFileSync(PATH_ARCHIVO_FOTOS, JSON.stringify(productos, null, 2))

        estado = 201;
        obj_resp.mensaje = "el prod con foto fue agregado con éxito.";
    }

    response.json(producto);
    //response.status(estado).json(obj_resp);
});