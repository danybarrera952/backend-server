var express = require('express');
var app = express();

var Medico = require('../models/medico');

var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');




// =============================
//Obtener medicos
// ============================

app.get('/', (req, res, next) => {


    var desde = req.query.desde;
    desde = Number(desde);


    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en Base datos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: contador
                    });

                });



            });




});





// ==================================
// Actualizar usuario
// =================================

app.put('/:id', mdAutenticacion.varificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Medico',
                errors: err
            });
        }
        if (!medico) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico' + id,
                errors: { message: " no existe un medico con ese ID" }
            });

        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoguardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }




            res.status(200).json({
                ok: true,
                medico: medicoguardado
            });

        });


    });




});

// ==================================
// Crear MEDICO
// =================================

app.post('/', mdAutenticacion.varificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    medico.save((err, medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear medicos',
                errors: err,

            });
        }
        res.status(200).json({
            ok: true,
            usuario: medicos
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