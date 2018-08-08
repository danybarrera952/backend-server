var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospitales');
var Medico = require('../models/medico');


app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de collecciones

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: { message: 'debe seleccionar una imagen' }
        });
    }


    // primero validar si viene una imagen
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no valida',
            errors: { message: 'debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // extensiones validas

    var ExtensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (ExtensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones Validas son ' + ExtensionesValidas.join(',') }
        });

    }

    // crear nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal al path

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        }
        subirArchivo(tipo, nombreArchivo, id, res);

    })



});

// para poder usar archivo fuera necesitamos exportarlo

function subirArchivo(tipo, nombreArchivo, id, res) {

    if (tipo === 'usuarios') {

        //Encontrar el usuario por el id
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'usuario no existe' }
                });

            }

            //obtener el path viejo de la imagen en caso de tener una imagen 
            var pathViejo = './uploads/usuarios/' + usuario.img;
            //verificar si existe el archivo lo borra para despues poner uno nuevo

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            //guardar el nuevo archivo

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });


            });



        });


    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });

            }

            //obtener el path viejo de la imagen en caso de tener una imagen 
            var pathViejo = './uploads/hospitales/' + hospital.img;
            //verificar si existe el archivo lo borra para despues poner uno nuevo

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            //guardar el nuevo archivo

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de Hospital actualizada',
                    hospital: hospitalActualizado
                });


            });



        });

    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });

            }

            //obtener el path viejo de la imagen en caso de tener una imagen 
            var pathViejo = './uploads/medicos/' + medico.img;
            //verificar si existe el archivo lo borra para despues poner uno nuevo

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            //guardar el nuevo archivo

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de medico actualizada',
                    medico: medicoActualizado
                });


            });



        });

    }


}

module.exports = app;