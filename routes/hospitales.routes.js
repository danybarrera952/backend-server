var express = require('express');
var app = express();

var Hospital = require('../models/hospitales');



var mdAutenticacion = require('../middlewares/autenticacion');




// =============================
//Obtener Hospitales
// ============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde;
    desde = Number(desde);



    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en Base datos',
                        errors: err
                    });
                }

                Hospital.count({}, (err, contador) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
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

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!hospital) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital' + id,
                errors: { message: " no existe un Hospital con ese ID" }
            });

        }

        hospital.nombre = body.nombre;

        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalguardado) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                hospital: hospitalguardado

            });

        });


    });




});

// ==================================
// Crear Hospital
// =================================

app.post('/', mdAutenticacion.varificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalguardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: hospitalguardado
        });


    });


});

// ==================================
// Eliminar Usauario por id
// =================================

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            usuario: hospitalBorrado
        });

    });

});






//para poder usar archivo fuera necesitamos exportarlo

module.exports = app;