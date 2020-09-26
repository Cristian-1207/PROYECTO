var express = require('express');
var router = express.Router();

const ORDEN = require('./../../db/Models/Orden');

router.get('/',(req,res) => {
    //validacion
    ORDEN.find({}).exec((err,docs)=>{
        if(!err)
            res.status(200).json({
                // devolver lista de todos los restaurantes
                data: docs
             });
        else
             res.status(500).json({
                 error: err
             });   
    });
   
})

router.post('/',(req, res)=>{
    //validacion

    /** 
    * @params
    * idcliente
    * lugar de entrega {lat, log}
    * pago_total
    * pedidos   [{}idmenu,idrestaurant,cantidad]
    */
    req.body.hora_pedido = Date().toString().split(" ")[4];
    req.body.estado = 'pendiente';
    var orden = new ORDEN(req.body);
    orden.save((err, doc)=>{
        if(!err)
            res.status(200).json({
                msn: 'ok inserta nuevo pedido',
                doc: doc
            })
        else
            res.status(403).json({
                error: err
            })
    })
})


router.patch('/:id',(req, res)=>{
   //validacion
    ORDEN.findByIdAndUpdate(req.params.id,req.body,(err,doc)=>{
        if(!err)
            if(doc)
                res.status(200).json({
                    msn: 'ok registro actualizado',
                    doc: doc
                })
            else
                 res.status(400).json({
                     msn: 'el registro no existe'
                 })
        else   
            res.status(403).json({
                error: err
            })

    })
})



router.delete('/:id',(req,res)=>{
    //validacion
    ORDEN.findByIdAndDelete(req.params.id,(err, doc)=>{
        if(!err)
            if(doc)
                res.status(200).json({
                    msn: 'ok pedido elimando',
                    doc: doc
                })
            else
                res.status(400).json({
                    msn: 'el pedido no existe'
                })
        else 
            res.status(403).json({
                error: err
            })
    })
})


module.exports = router;
