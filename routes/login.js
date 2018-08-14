var express = require('express');
var app = express();

var Usuario = require('../models/usuario');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var CLIENT_ID = require('../config/config').CLIENT_ID;


//=======
//GOOGLE
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// ==================================
// Login validacion con gooogle
// ==================================

app.post('/google', async(req, res) => {

    //obtener el token que mandamos por el body
    var token = req.body.token;
    // crear una funcion async para comparar el token que viene de google con el del backend
    var googleUser = await verify(token)
        .catch(e => {

            return res.status(403).json({
                ok: false,
                mensaje: 'token no valido'

            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        //validar si el usuario existe
        if (usuarioDB) {

            //si es true quiere decir que el usuario se creo por google
            if (usuarioDB.google == false) {

                //si es false quiere decir que el usuario

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar la autenticacion normal'
                });
                //si el usuario ya se autentefico por google le daremos un token para porder usar la aplicacion
            } else {
                var token = jwt.sign({ usuario: usuarioValido }, SEED, { expiresIn: 14400 });



                res.status(200).json({
                    ok: true,
                    usuario: usuarioValido,
                    id: usuarioValido._id,
                    token: token

                });
            }

            // si el usuario es la primera ves que se auntentifica en nuestra aplicacion

        } else {

            // el usuario no existe hay que crearlo

            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                var token = jwt.sign({ usuario: usuarioValido }, SEED, { expiresIn: 14400 });



                res.status(200).json({
                    ok: true,
                    usuario: usuarioValido,
                    id: usuarioValido._id,
                    token: token

                });


            });



        }


    });
    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'OK!!!',
    //     googleUser: googleUser

    // });
});

// ==================================
// Login validacion normal
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