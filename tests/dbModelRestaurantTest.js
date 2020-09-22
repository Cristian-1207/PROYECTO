const RESTAURANT = require('./../db/Models/Restaurant');

// crear nuevo restaurante
var rest = new RESTAURANT({
    nombre: 'mi restaurant',
    nit: '123',
    propietario: 'el dueño',
    Calle: 'avenida',
    telefono: '12334545',
    log: 123.4552,
    lat: 321.3456,
    logo: 'bonito logo',
    foto_lugar: 'foto.jpg'
});

rest.save(function(err){
    if(!err)
    console.log('Success!')
    mostrar();
});


function mostrar(){
    RESTAURANT.find({}).exec((err,docs)=>{
        if(!err){
            console.log(docs);
        }
    });
}