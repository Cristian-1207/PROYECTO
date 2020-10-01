var express = require('express');
var router = express.Router();
var sha1 = require('sha1');


const USER = require('./../../db/Models/Usuario');

const AuthJWT = require('./../../Utils/AuthJWT');


router.post('/login',(req,res)=>{
    
    var email = req.body.email
    var password = sha1(req.body.password)

    USER.findOne({email: email, password: password},(err, doc)=>{
        if(!err){
            if(doc){
                var token = AuthJWT.getToken({
                    nombre: doc.nombre,
                    apellido: doc.apellido,
                    ci: doc.ci,
                    email: doc.email,
                    rol: doc.rol
                })
                res.status(200).json({
                    msn: 'ok sesion iniciada',
                    _token: token
                })

            }
            else{
                res.status(400).json({
                    msn: "el correo o la contraseña es incorrecta"

                })

            }
        }
        else
        res.status(403).json({
            error: err
        })
    })
}) 


module.exports = router;