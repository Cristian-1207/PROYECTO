const mongoose = require('./../conection');
//crear el Restaurantsquema 
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    ci: String,
    telefono: String,
    email: String,
    password: String,
    rol: String,
    fechaderegistro: {type: Date, default: Date.now}
});

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
// importar el modelo
module.exports = UsuarioModel;
