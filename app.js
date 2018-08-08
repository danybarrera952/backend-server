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

var rutaPrincipal = require('./routes/mainRoute');
var hopitalesRoutes = require('./routes/hospitales.routes');
var Busquedas = require('./routes/busquedas');
var login = require('./routes/login');
var medicos = require('./routes/medicos');
var usuarios = require('./routes/usuario.routes');
var upload = require('./routes/upload');
var imagenes = require('./routes/imagenes');



//rutas 
// definir un milderware que es algo que se ejecuta antes de que se resulevan otras rutas
app.use('/upload', upload);
app.use('/usuario', usuarios);
app.use('/medico', medicos);
app.use('/login', login);
app.use('/busqueda', Busquedas);
app.use('/hospital', hopitalesRoutes);
app.use('/imagen', imagenes);
app.use('/', rutaPrincipal);
// escuchar peticiones

app.listen(3000, () => {
    console.log('online!!');
});