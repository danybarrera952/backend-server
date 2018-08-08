var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;



// =============================
//Verificar  token
// ============================


//creacion de Milware

exports.varificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err,

            });
        }

        req.usuario = decoded.usuario;
        req.hospital = decoded.hospital;
        next();
    });
}