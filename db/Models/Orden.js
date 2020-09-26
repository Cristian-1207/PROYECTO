const { model } = require("mongoose");
const mongoose = require("../conection");

const OrdenSchema = new mongoose.Schema({
    
    idcliente: String,
    lugardeenvio: Object, 
    pago_total: Number,
    hora_pedido: String,
    estado: String,
    pedidos: Array
});

const OrdenModel = mongoose.model('Orden', OrdenSchema);

module.exports = OrdenModel;