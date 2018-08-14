// definimos moongose que nos ayudara a realizar modelos 

var mongoose = require('mongoose');

var mongooseValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesvalidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'

};

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es Necesario'] },
    email: { type: String, unique: true, required: [true, 'El Correo es Necesario'] },
    password: { type: String, required: [true, 'El password es Necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesvalidos },
    google:{type:Boolean,default:false}

});





// Aqui mandamos llamar el plugin para hacer la validacion 
usuarioSchema.plugin(mongooseValidator, { message: '{PATH} debe ser unico' });


// DESPUES QUE CREAMOS EL SCHEMA NECESITAMOS EXPORTARLO
module.exports = mongoose.model('Usuario', usuarioSchema);