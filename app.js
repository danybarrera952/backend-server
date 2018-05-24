// Requieres importacion de librerias para que funcione algo

var express = require('express');
var mongoose = require('mongoose');



// inicializar variables aqui usaremos las librerias

var app = express(); // aqui inicialize el servidor de express

mongoose.connect('mongodb://localhost:27017/hospital', (err, res) => {

    if (err) throw err;
    console.log('ONline!!!!good');

});

//rutas 

app.get('/', (rep, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });
});


// escuchar peticiones

app.listen(3000, () => {
        console.log('ONline!!!!good'); // para probar la conexion con el servidor abrimos
    }) // la console y escribimos node apps