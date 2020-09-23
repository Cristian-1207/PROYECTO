const mongoose = require('./../conection');
//crear el Restaurantsquema 
const RestaurantSchema = new mongoose.Schema({
    nombre: String,
    nit: String,
    propietario: String,
    calle: String,
    telefono: String,
    log: Number,
    lat: Number,
    logo: String,
    fechaderegistro: {type: Date, default: Date.now},
    foto_lugar: String
});

const RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);
// importar el modelo
module.exports = RestaurantModel;
