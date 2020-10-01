var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var { verifyToken } =require('./Utils/AuthJWT');

var restaurantRouter = require('./routes/api/restaurant');
var menuRouter = require('./routes/api/menu');
var ordenRouter = require('./routes/api/orden');
var usuarioRouter = require('./routes/api/usuario');
var authRouter = require('./routes/api/auth');
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var ejs = require('ejs');



app.get('/mail',async(req,res,next)=>{//renderisar
  res.contentType('text/html')
  var html = await ejs.renderFile('./views/ordenMail.ejs',
    {
      nombre: 'marco',
      apellido: 'flores',
      ci: '1234',
      orden:{
        _id: "234",
        idcliente: 'werre',
        lugardeenvio: {lat: 1234, log:443},
        pago_total: 125,
        hora_pedido: '21:45:12',
        pedidos:[
          {
          idrestaurant: '123456',
          idmenu: '4567',
          menu: {
            nombre: "milaneza",
            precio: '15',
          },
          cantidad: 2
        }
        ]
      }
    }
  );
  res.send(new Buffer(html));
})




app.use('/api/auth', authRouter);
app.use(verifyToken);
app.use('/api/usuario', usuarioRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orden', ordenRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    msn: 'No se encontro la ruta',
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = 8000;
app.listen(port,()=>{
  console.log("servidor corriendo en el puerto ",port);
});

module.exports = app;
