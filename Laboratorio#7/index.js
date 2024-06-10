const express = require('express');
const app = express();
const port = 3000; // Puerto en el que Express escuchará

// Función para calcular la serie de Fibonacci
function fibonacciSeries(num) {
    const fibonacci = [0, 1];
    for (let i = 2; i < num; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
    }
    return fibonacci;
}

// Endpoint para calcular la serie de Fibonacci
app.get('/fibonacci', (req, res) => {
    const num = parseInt(req.query.num);
    const sequence = fibonacciSeries(num);
    res.json(sequence);
});

// Iniciando el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
