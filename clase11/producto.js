const PATH_ARCHIVO = "./archivos/productos.json";

const fs = require('fs');

class Producto {
    static async obtenerTodos(){
        let retorno = {};
        
        if(fs.existsSync(PATH_ARCHIVO)){
    
            const data = fs.readFileSync(PATH_ARCHIVO);
            retorno = JSON.parse(data);
        }
    
        return retorno;
    }
}

module.exports = Producto;