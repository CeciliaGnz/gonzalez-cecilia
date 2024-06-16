const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let ingresos = [];
let egresos = [];

app.post('/api/ingresos', (req, res) => {
    const { username } = req.query;
    const { amount, fecha, tipo } = req.body;
    const ingreso = { username, amount, fecha, tipo };
    ingresos.push(ingreso);
    res.status(201).send({ message: 'Ingreso almacenado', data: ingreso });
});


app.get('/api/ingresos', (req, res) => {
    const { username } = req.query;
    const userIngresos = ingresos.filter(item => item.username === username);
    res.json({ data: userIngresos });
});


app.post('/api/egresos', (req, res) => {
    const { username } = req.query;
    const { amount, fecha, tipo } = req.body;
    const egreso = { username, amount, fecha, tipo };
    egresos.push(egreso);
    res.status(201).send({ message: 'Egreso almacenado', data: egreso });
});


app.get('/api/egresos', (req, res) => {
    const { username } = req.query;
    const userEgresos = egresos.filter(item => item.username === username);
    res.json({ data: userEgresos });
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
