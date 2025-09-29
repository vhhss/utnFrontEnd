let articulo = [
    {
        codigoBarraL: 123456,
        nombre: "Arroz",
        precio: 150,
        vencimiento: "2024-12-31"
    },
    {
        codigoBarraL: 789012,
        nombre: "Fideos",
        precio: 100,
        vencimiento: "2024-11-30"
    },
    {
        codigoBarraL: 345678,
        nombre: "Aceite",
        precio: 300,
        vencimiento: "2025-01-15"
    }
]

articulo.forEach(e => {
    console.log(e);
    console.log("---");
});