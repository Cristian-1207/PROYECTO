const { model } = require("mongoose");
const mongoose = require("../conection");

var OrdenStructureSchema =({
    idrestaurante: String,
    idcliente: String,
    lugardeenvio: Object, 
    pago_total: Number,
    hora_pedido: String,
    estado: String,
    pedidos: Array
});



const OrdenSchema = new mongoose.Schema(OrdenStructureSchema);

const OrdenModel = mongoose.model('Orden', OrdenSchema);

module.exports = {
    OrdenStructureSchema,
    OrdenModel};