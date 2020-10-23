var express = require('express');
var router = express.Router();
var valid = require('./../../Utils/valid');

const {OrdenStructureSchema} = require('./../../db/Models/Orden');

const ORDEN = require('./../../db/Models/Orden').OrdenModel;
const MENU = require('./../../db/Models/Menus');

const Mail = require('./../../Utils/Mail');

function sendFactura(or){
    var orden = or;

            for(var i = 0;i<doc.pedidos.length;i++){
                orden.pedidos[i]={...orden.pedidos[i]};
                orden.pedidos[i].menu = await MENU.findOne({_id:orden.pedidos[i].idmenu}).exec();

            }   
            //cambiar el usuario
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
    //validar
    if(!valid.checkParams(req.body,OrdenStructureSchema)){
        res.status(403).json({
            msn: "error en los parametros"
        });
        return;

    };
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
    for(let i=0;i<req.pedidos.length;i++)
	    if((restaurantes.indexOf(req.pedidos[i].idrestaurante)==-1)){
		    restaurantes.push(req.pedidos[i].idrestaurante);
    }

    for(let i=0; i<restaurantes.length;i++){
	    let pedidos = [];
	    for(let j=0;j<req.pedidos.length;j++){
		    if(restaurantes[j]==req.pedidos[j].idrestaurante){
			    pedidos.push({... req.pedidos[j]});
		    }
	    }
    	let pagoTotal= 0;
        for(j=0;j<pedidos.length;i++){
            let menu = await MENU.findOne({_id:pedidos[j].idmenu}).exe();
            pago_total+= pedidos[j].cantidad * memu.precio;
        }
	
        ordenes.push({
            idrestaurte: restaurantes[i],
            idcliente: req.body.idcliente,
            lugardeenvio: req.bodylugardeenvio,
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
