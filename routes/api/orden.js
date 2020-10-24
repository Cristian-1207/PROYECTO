var express = require('express');
var router = express.Router();
var valid = require('./../../Utils/valid');

const {OrdenStructureSchema} = require('./../../db/Models/Orden');
const USUARIO = require('./../../db/Models/Usuario')
const ORDEN = require('./../../db/Models/Orden').OrdenModel;
const MENU = require('./../../db/Models/Menus');

const Mail = require('./../../Utils/Mail');

async function sendFactura(or){

    for(var i = 0;i<or.pedidos.length; i++){
        or.pedidos[i] = {... or.pedidos[i]};
        or.pedidos[i].menu = await MENU.findOne({_id:or.pedidos[i].idmenu}).exec();
    }

            let user = await USUARIO.findOne({_id:or.idcliente}).exec();
   
            //cambiar el usuario
            var info={
               nombre: user.nombre,
               apellido: user.apellido,
               ci: user.ci,
               orden: or
           }
        
            Mail.sendMailWithFactura(
                user.email,
                "Pedido realizado",
                '<p>'+user.nombre+' '+user.apellido+'\n'+'pedido realizado exitosamente con un valor de:' +or.pago_total+'   '+'gracias por su compra'+'</p>',
                info,
                (error,info)=>{
                    if(error)
                        console.log("Error Mail: ",error);
                    else
                        console.log("Mail: ","Correo enviado a ", user.email);
                    
                }
            )
    
};

router.get('/',(req,res) => {
    //validacion
    ORDEN.find(req.query).exec((err,docs)=>{
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

router.post('/',async(req, res)=>{
    //validacion
    if((typeof req.body.lugardeenvio)=='string'){
        req.body.lugardeenvio = JSON.parse(req.body.lugardeenvio);
    }
    if((typeof req.body.pedidos)=='string'){
        req.body.pedidos = JSON.parse(req.body.pedidos);
    }
    
    /** 
    * @params
    * idcliente
    * lugar de entrega {lat, log}
    * pago_total
    * pedidos   [{}idmenu,idrestaurant,cantidad]
    */
    req.body.hora_pedido = (new Date().getDate()+"/"+(new Date().getMonth()+1)+"/"+(new Date().getFullYear()))+" "+ Date().toString().split(" ")[4];
    
    var ordenes = [];
    var restaurantes = [];
    for(let i=0;i<req.body.pedidos.length;i++)
	    if((restaurantes.indexOf(req.body.pedidos[i].idrestaurante)==-1)){
		    restaurantes.push(req.body.pedidos[i].idrestaurante);
    }

    for(let i=0; i<restaurantes.length;i++){
	    let pedidos = [];
	    for(let j=0;j<req.body.pedidos.length;j++){
		    if(restaurantes[i]==req.body.pedidos[j].idrestaurante){
			    pedidos.push({... req.body.pedidos[j]});
		    }
	    }
    	let pagoTotal= 0;
        for(let j=0;j<pedidos.length;j++){
            let menu = await MENU.findOne({_id:pedidos[j].idmenu}).exec();
            pagoTotal+= pedidos[j].cantidad * menu.precio;
        }
	
        ordenes.push({
            idrestaurte: restaurantes[i],
            idcliente: req.body.idcliente,
            lugardeenvio: req.body.lugardeenvio,
            pago_total: pagoTotal,
            hora_pedido: req.body.hora_pedido,
            estado: 'espera',
            pedidos: pedidos
        });

    }
    for(let i=0;i<ordenes.length;i++){
        let orden = new ORDEN(ordenes[i]);
        orden.save((err,doc)=>{
            if(err){
                res.status(403).json({
                    error: err
                }); 
                return;           
            }

        });
    }    
    res.status(200).json({
        msn: 'ok nuevo pedido realizado',
        doc: ordenes
    });
})


router.patch('/:id',(req, res)=>{
   //validacion
    ORDEN.findByIdAndUpdate(req.params.id,req.body,(err,doc)=>{
        if(!err)
            if(doc){
                if(req.body.estado=="enviado"){
                    sendFactura(doc);
                }    




                res.status(200).json({
                    msn: 'ok registro actualizado',
                    doc: doc
                })
            }
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
