const express = require('express');

const app = express();

app.set('puerto', 9876);

//AGREGO JSON
app.use(express.json());

app.use(express.static("public"));

const cors = require("cors");

app.use(cors());

//##############################################################################################//
//RUTAS PARA EL CRUD ARCHIVOS
//##############################################################################################//

const rutas = require("./routes");

app.use("/productos", rutas);

const rutas_fotos = require("./routes_fotos");

app.use("/productos_fotos", rutas_fotos);


app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});