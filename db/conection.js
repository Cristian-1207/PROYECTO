const mongoose = require('mongoose');
const dbName = "db_proyecto_seminario"
mongoose.connect("mongodb://localhost/"+dbName,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conexion a la DB exitosa");
}).catch((err)=>{
    console.error(err);
})

module.exports =mongoose;