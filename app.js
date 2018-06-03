// Requieres importacion de librerias para que funcione algo

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// inicializar variables aqui unmp ssaremos las librerias


var app = express(); // aqui inicialize el servidor de express

//body parser
app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())

// fin de boy parse

mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {

    if (err) throw err;
    console.log('Base de datos online!!');

});

// importar rutas

var approutes = require('./routes/mainRoute');
var usuarioroutes = require('./routes/usuario.routes');
var login = require('./routes/login');



//rutas 
// definir un milderware que es algo que se ejecuta antes de que se resulevan otras rutas

app.use('/usuario', usuarioroutes);
app.use('/login', login);
app.use('/', approutes);



// escuchar peticiones

app.listen(3000, () => {
    console.log('online!!');
});