var express = require('express');
var app = express();

const path = require('path');

//verificar si la imagen existe en ese path
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;
    // obtener el path de la imagen
    var pathimagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    //verificar si existe el path

    if (fs.existsSync(pathimagen)) {

        res.sendFile(pathimagen);
    } else {
        var pathNoimage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoimage);
    }


});

// para poder usar archivo fuera necesitamos exportarlo

module.exports = app;