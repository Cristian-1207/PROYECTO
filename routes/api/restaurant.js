var express = require('express');
var router = express.Router();



const RESTAURANT = require('./../../db/Models/Restaurant');


router.get('/',(req,res) => {
    //validacion
    RESTAURANT.find({}).exec((err,docs)=>{
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
    var restaurant = new RESTAURANT(req.body);
    restaurant.save((err, doc)=>{
        if(!err)
            res.status(200).json({
                msn: 'ok inserta nuevo registro',
                doc: doc
            })
        else
            res.status(403).json({
                error: err
            })
    })
})

router.put('/:id',(req, res)=>{
    //validacion
     RESTAURANT.findById(req.params.id).exec((err,doc)=>{
        if(!err){
            if(doc){
                RESTAURANT.findByIdAndUpdate(req.params.id,req.body,(err,doc)=>{
                    if(!err)
                        res.status(200).json({
                            msn: 'ok registro modificado',
                            doc: doc
                        })
                    else   
                        res.status(403).json({
                            error: err
                        })
            
                })
            }
            else{
                req.body._id = req.params.id;
                var restaurant = new RESTAURANT(req.body);
                restaurant.save((err, doc)=>{
                    if(!err)
                        res.status(200).json({
                            msn: 'ok nuevo registro insertado',
                            doc: doc
                        })
                    else
                        res.status(403).json({
                            error: err
                        })
                })
            }


        }
        else
            res.status(403).json({
                error: err
            })

    });
        

    
})


router.patch('/:id',(req, res)=>{
   //validacion
    RESTAURANT.findByIdAndUpdate(req.params.id,req.body,(err,doc)=>{
        if(!err)
            if(!doc)
                res.status(200).json({
                    msn: 'ok registro actualizado',
                    doc: doc
                })
            else
                 res.status(200).json({
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
    RESTAURANT.findByIdAndDelete(req.params.id,(err, doc)=>{
        if(!err)
            if(doc)
                res.status(200).json({
                    msn: 'ok elimando',
                    doc: doc
                })
            else
                res.status(200).json({
                    msn: 'el registro no existe'
                })
        else 
            res.status(403).json({
                error: err
            })
    })
})

 
module.exports = router;