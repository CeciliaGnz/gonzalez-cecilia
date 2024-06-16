const express = require('express');
const app = express();

import cors from 'cors';
const port = 3000;

app.use(express.json());
app.use(cors());

function fibonacciSeries(num) {
    const fibonacci = [0, 1];
    for (let i = 2; i < num; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
    }
    return fibonacci.slice(0, num);
}

app.get('/fibonacci', (req, res) => {
    const num = parseInt(req.query.num); 
    const sequence = fibonacciSeries(num);
    res.json(sequence);
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

