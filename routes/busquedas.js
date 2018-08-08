var express = require('express');
var app = express();

var Hospital = require('../models/hospitales');

var Medico = require('../models/medico');

var Usuario = require('../models/usuario');


//=================================
//BUSQUEDA POR COLECCION ESPECIFICA
//=================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var exReg = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, exReg);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, exReg);
            break;

        case 'hospitales':
            promesa = buscarMedicos(busqueda, exReg);
            break;

        default:

            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son usuarios, medicos, hospitales',
                error: { message: 'tipo de datos o coleccion no validos' }

            });


    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data

        });

    })


});

//==================
//BUSQUEDA GENERAL
//==================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var exReg = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, exReg),
            buscarMedicos(busqueda, exReg),
            buscarUsuarios(busqueda, exReg)

        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

});




// La funcion va retornar una promesa

function buscarHospitales(busqueda, exReg) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: exReg })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {


                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {

                    resolve(hospitales);
                }


            });
    });


}

function buscarMedicos(busqueda, exReg) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: exReg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {

                    resolve(medicos);
                }


            });
    });


}


//Buscar en dos columnas en nombre y email
function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}


// para poder usar archivo fuera necesitamos exportarlo

module.exports = app;