var express = require('express');
var router = express.Router();



const RESTAURANT = require('./../../db/Models/Restaurant');

//Guardar fotos
const {catchFile, getFile} = require('./../../Utils/FileManagerOnRequest')


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
    RESTAURANT.findByIdAndDelete(req.params.id,(err, doc)=>{
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

//foto_lugar

var pathFotoLugarStore = './public/foto_lugar/'
var defaultNameFL = 'foto_lugar'
var requestKeyImageFotoLugar ='img_foto_lugar'
router.post('/upload/:id/foto_lugar',catchFile(requestKeyImageFotoLugar,pathFotoLugarStore,defaultNameFL),(req,res)=>{
    var FileName = req.file.filename;
    RESTAURANT.findByIdAndUpdate(req.params.id,{foto_lugar: FileName},(err,doc)=>{
        if(!err){
            if(doc)
            res.status(200).json({
                msn: 'ok -> foto_lugar añadido exitosamente', 
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

router.get('/download/foto_lugar/:filename',(req,res)=>{ 
    var file =getFile(pathFotoLugarStore,req.params.filename);
    res.contentType(file.mimetype);
    res.status(200).send(file.content);
})

//logo
var pathLogoStore = './public/logos/'
var defaultName = 'logo'
var requestKeyImageLogo ='img_logo'
router.post('/upload/:id/logo',catchFile(requestKeyImageLogo,pathLogoStore,defaultName),(req,res)=>{
    var FileName = req.file.filename;
    RESTAURANT.findByIdAndUpdate(req.params.id,{logo: FileName},(err,doc)=>{
        if(!err){
            if(doc)
            res.status(200).json({
                msn: 'ok -> logo añadido exitosamente', 
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

router.get('/download/logo/:filename',(req,res)=>{ 
    var file =getFile(pathLogoStore,req.params.filename);
    res.contentType(file.mimetype);
    res.status(200).send(file.content);
})

 
module.exports = router;