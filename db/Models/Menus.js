const mongoose = require('./../conection');

const MenuSchema = new mongoose.Schema({
    nombre: String,
    precio: String,
    descripcion: String,
    fechaderegistro: {type: Date, default: Date.now},
    fotografiadelproducto: String
});

const MenusModel = mongoose.model('Menus', MenusSchema);
// importar el modelo
module.exports = MenusModel;
