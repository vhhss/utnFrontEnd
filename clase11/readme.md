1.- Inicializar node
    npm init -y

2.- Agregar: express 
    npm install express

3.- Opcionalmente agregar nodemon
    npm install --save-dev nodemon

4.- Armar servidor nodeJS (preferentemente, utilizando code-snippet)

5.- Correr el servidor
    nodemon nombre_archivo

NOTA: Si no se usa nodemon, cada cambio que se realice sobre 'nombre_archivo' requiere que se reinicie

6.- Probar en el navegador
    http://localhost:puerto

7.- Agregar las rutas para el CRUD
    app.get('/productos' ....
    app.post('/productos' ....
    app.post('/productos ....
    app.delete('/productos' ....

8.- Requerir filesystem y usar json
    const fs = require('fs');
    app.use(express.json());

9.- Probar las rutas. Ulilizar Postman o extensión similar

10.- Agregar: multer y mime-types
	npm install multer mime-types

11.- Requerir: multer y mime-types
    const multer = require('multer');
    const mime = require('mime-types');

12.- Configurar multer 
    const upload = multer({
        storage: multer.diskStorage({
                    destination: "path_destino",
                });
    });

13.- Agregar las rutas para el CRUD con fotos
    app.get('/productos_fotos' ....
    app.post('/productos_fotos' ....
    app.put('/productos_fotos' ....
    app.delete('/productos_fotos' ....

14.- En las rutas productos_fotos (post) y productos_fotos (put), 
    agregar el middleware multer
	const upload = multer({dest:'path_destino'});
	app.post('ruta', upload.single('nombre_del_name_del_input:file'), ...)
	
15.- Configurar en las rutas productos_fotos (post) y productos_fotos (put) (para renombrar la foto)
    fs.renameSync(request.file.path, 'path_destino_final');

16.- Probar las rutas. Ulilizar Postman o extensión similar



Apéndice:
Crear code-snippet para la creación del servidor NodeJs

1.- Menú -> Archivo --> Preferencias >> Configurar fragmentos de código.
2.- Crear el code-snippet dentro de las llaves ({ })
3.- 
	"servidor_express" : 
	{
		"scope": "javascript",
		"prefix": "serv_exp",
		"body": [
			"const express = require('express');",
			"",
			"const app = express();",
			"",
			"app.set('puerto', $1);",
			"",
			"app.get('/', (request, response)=>{",
			"\tresponse.send('GET - servidor NodeJS');",
			"});",
			"",
			"",
			"app.listen(app.get('puerto'), ()=>{",
			"\tconsole.log('Servidor corriendo sobre puerto:', app.get('puerto'));",
			"});"
		],
		"description": "Creación de servidor NodeJS con Express"
	}

4.- Guardar.
