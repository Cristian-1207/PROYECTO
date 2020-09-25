const mongoose = require('./../conection');

const MenuSchema = new mongoose.Schema({
    nombre: String,
    precio: String,
    descripcion: String,
    fechaderegistro: {type: Date, default: Date.now},
    fotografia_producto: String
});

const MenusModel = mongoose.model('Menus', MenuSchema);
// importar el modelo
module.exports = MenusModel;
