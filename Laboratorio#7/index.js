const express = require('express');
const app = express();
const port = 3000; 


function fibonacciSeries(num) {
    const fibonacci = [0, 1];
    for (let i = 2; i < num; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
    }
    return fibonacci;
}


app.get('/fibonacci', (req, res) => {
    const num = parseInt(req.query.num);
    const sequence = fibonacciSeries(num);
    res.json(sequence);
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
