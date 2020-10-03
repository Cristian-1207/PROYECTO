var express = require('express');
var router = express.Router();
var valid = require('./../../Utils/valid');

const {OrdenStructureSchema} = require('./../../db/Models/Orden');

const ORDEN = require('./../../db/Models/Orden').OrdenModel;
const MENU = require('./../../db/Models/Menus');

const Mail = require('./../../Utils/Mail');

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
    req.body.hora_pedido = (new Date().getDate()+"/"+(new Date().getMonth()+1)+"/"+(new Date().getFullYear()))+" "+ Date().toString().split(" ")[4];
    req.body.estado = 'pendiente';
    
    //validar
    if(!valid.checkParams(req.body,OrdenStructureSchema)){
        res.status(403).json({
            msn: "error en los parametros"
        });
        return;

    };
    
    var orden = new ORDEN(req.body);
    orden.save(async(err, doc)=>{
        if(!err){
            var orden = doc;
            for(var i = 0;i<doc.pedidos.length;i++){
                orden.pedidos[i].menu = await MENU.findOne({_id:orden.pedidos[i].idmenu}).exec();

            }   
            
            var info={
               nombre: req.authUser.nombre,
               apellido: req.authUser.apellido,
               ci:  req.authUser.ci,
               orden: orden
           }
        
            Mail.sendMailWithFactura(
                req.authUser.email,
                "Pedido realizado",
                '<p>'+req.authUser.nombre+' '+req.authUser.apellido+'\n'+'peido realiazado exitosamente con un valor de:' +req.body.pago_total+'</p>',
                info,
                (error,info)=>{
                    if(error)
                        console.log("Error Mail: ",error);
                    else
                        console.log("Mail: ","Correo enviado a ", req.authUser.email);
                    
                }
            )

            res.status(200).json({
                msn: 'ok nuevo pedido',
                doc: doc
            })
        }
        else
            res.status(403).json({
                error: err
            })
    })
});


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
