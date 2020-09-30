var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

const USER = require('./../../db/Models/Usuario');



router.get('/',(req,res) => {
    //validacion
    USER.find({}).exec((err,docs)=>{
        if(!err)
            res.status(200).json({
                // devolver lista de todos los usuarios
                msm: 'ok',
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
    req.body.password = sha1(req.body.password);
    var usuario = new USER(req.body);
    usuario.save((err, doc)=>{
        if(!err)
            res.status(200).json({
                msn: 'ok inserta nuevo usuario',
                doc: doc
            })
        else
            res.status(403).json({
                error: err
            })
    })
})


router.delete('/:id',(req,res)=>{
    //validacion
    USER.findByIdAndDelete(req.params.id,(err, doc)=>{
        if(!err)
            if(doc)
                res.status(200).json({
                    msn: 'ok elimando',
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



module.exports = router;