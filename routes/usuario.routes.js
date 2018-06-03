var express = require('express');
var app = express();

var Usuario = require('../models/usuario');

var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');




// =============================
//Obtener usuarios
// ============================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en Base datos',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });


            });




});





// ==================================
// Actualizar usuario
// =================================

app.put('/:id', (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario' + id,
                errors: { message: " no existe un usuario con ese ID" }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioguardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioguardado.password = ';)';


            res.status(200).json({
                ok: true,
                usuario: usuarioguardado
            });

        });


    });




});

// ==================================
// Crear usuario
// =================================

app.post('/', mdAutenticacion.varificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, nombreguardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: nombreguardado,
            usuarioToken: req.usuario
        });


    });


});

// ==================================
// Eliminar Usauario por id
// =================================

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});






//para poder usar archivo fuera necesitamos exportarlo

module.exports = app;