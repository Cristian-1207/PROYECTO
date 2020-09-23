const mongoose = require('./../conection');
//crear el Restaurantsquema 
const ClienteSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    ci: String,
    telefono: String,
    Calle: String,
    email: String,
    fechaderegistro: {type: Date, default: Date.now}
});

const ClientetModel = mongoose.model('Cliente', ClienteSchema);
// importar el modelo
module.exports = ClienteModel;
