var express = require('express');
var router = express.Router();



const MENU = require('./../../db/Models/Menus');

//Guardar fotos
const {catchFile, getFile} = require('./../../Utils/FileManagerOnRequest')

//GET

router.get('/',(req,res) => {
    //validacion
    MENU.find({}).exec((err,docs)=>{
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

//POST

router.post('/',(req, res)=>{
    //validacion
    var menu = new MENU(req.body);
    menu.save((err, doc)=>{
        if(!err)
            res.status(200).json({
                msn: 'ok inserta nuevo menu',
                doc: doc
            })
        else
            res.status(403).json({
                error: err
            })
    })
})


//PATCH

router.patch('/:id',(req, res)=>{
    //validacion
     MENU.findByIdAndUpdate(req.params.id,req.body,(err,doc)=>{
         if(!err)
             if(doc)
                 res.status(200).json({
                     msn: 'ok Menu actualizado',
                     doc: doc
                 })
             else
                  res.status(400).json({
                      msn: 'el menu no existe'
                  })
         else   
             res.status(403).json({
                 error: err
             })
 
     })
 })

//DELETE

router.delete('/:id',(req,res)=>{
    //validacion
    MENU.findByIdAndDelete(req.params.id,(err, doc)=>{
        if(!err)
            if(doc)
                res.status(200).json({
                    msn: 'ok MENU elimando',
                    doc: doc
                })
            else
                res.status(400).json({
                    msn: 'el MENU no existe'
                })
        else 
            res.status(403).json({
                error: err
            })
    })
})

//foto_de_producto

var pathFProdStore = './public/foto_producto/'
var defaultNameFProd = 'foto_producto'
var requestKeyImageFProd ='img_foto_producto'
router.post('/upload/:id/foto_producto',catchFile(requestKeyImageFProd,pathFProdStore,defaultNameFProd,"jpg"),(req,res)=>{
    var FileName = req.file.filename;
    MENU.findByIdAndUpdate(req.params.id,{fotografia_producto: FileName},(err,doc)=>{
        if(!err){
            if(doc)
            res.status(200).json({
                msn: 'ok -> foto_producto añadido exitosamente', 
                doc: doc
            })
            else
                res.status(400).json({error: 'no existe este registro'})

        }
        else{
            res.status(403).json({error: err});

        }
        
    })
})

router.get('/download/foto_producto/:filename',(req,res)=>{ 
    var file =getFile(pathFProdStore,req.params.filename);
    res.contentType(file.mimetype);
    res.status(200).send(file.content);
})


 
module.exports = router;