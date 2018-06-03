var express = require('express');
var app = express();

var Usuario = require('../models/usuario');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==================================
// Login 
// =================================

app.post('/', (req, res) => {

    var body = req.body;
    // verificar si usuario existe
    Usuario.findOne({ email: body.email }, (err, usuarioValido) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        if (!usuarioValido) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error no exite usuario',
                errors: err
            });

        }

        // verificar password

        if (!bcrypt.compareSync(body.password, usuarioValido.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error no exite password',
                errors: err
            });


        }
        usuarioValido.password = ':)';
        // crear token 


        var token = jwt.sign({ usuario: usuarioValido }, SEED, { expiresIn: 14400 });



        res.status(200).json({
            ok: true,
            usuario: usuarioValido,
            id: usuarioValido._id,
            token: token

        });


    });

    //======fin de verificacion=========


})





module.exports = app;