const express = require('express');

const app = express();

app.set('puerto', 9876);


//AGREGO FILE SYSTEM
const fs = require('fs');

//AGREGO JSON
app.use(express.json());

//INDICO RUTA HACIA EL ARCHIVO
const PATH_ARCHIVO = "./archivos/productos.json";


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

    response.send('POST - servidor Node.JS');

});

//MODIFICAR
app.put('/productos', (request, response)=>{

    response.send('PUT - servidor Node.JS');

});

//ELIMINAR
app.delete('/productos', (request, response)=>{

    response.send('DELETE - servidor Node.JS');

});




app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});

