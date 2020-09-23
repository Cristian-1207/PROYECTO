const { model } = require("mongoose");
const mongoose = require("../conection");

const OrdenSchema = new mongoose.Schema({
    idrestaurant: String,
    idmenu: String,
    cantidad: String,
    idcliente: String,
    lugardeenvio: String,
    lat: String,
    long: String, 
    pagotota: Number
});

const OrdenModel = mongoose.model('Orden', OrdenSchema);

module.exports = OrdenModel;