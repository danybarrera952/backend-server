var express = require('express');
var app = express();


app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });
});

// para poder usar archivo fuera necesitamos exportarlo

module.exports = app;