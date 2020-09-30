var jwt=require('jsonwebtoken');
var Key="PonerLlaveSecreta";


module.exports.getToken=function(payload){
    var TOKEN = jwt.sign(payload,Key,{expiresIn: 1800 });
    return TOKEN;
}

module.exports.verifyToken=(req, res, next)=> {
    //Recuperar el header
    const header = req.headers["authorization"];
    if (header  == undefined) {
        if(req.method == "POST" && req.url.match(/\/usuario/g) != null)
            next();
            else
                res.status(403).json({
                   msn: "No autorizado"
                })
    } else {
        var token = header.split(" ")[1];
        jwt.verify(token, Key, (err, authData) => {
          if (err) {
            res.status(403).json({
              msn: "Su sesion expiro, inicie sesion de nuevo"
            });
          } else {
              //verificacion de algun rol
              var rol = authData.rol;
              switch(rol){
                  case "user":
                      if(req.method == "GET" && req.url.match(/\/usuario/g) == null)
                            next();
                      else if(req.method == "POST" && req.url.match(/\/orden/g) != null)
                            next();
                            else{
                                res.status(300).json({
                                    msn: "no autorizado"
                                })
                            }
                      break;
                  case "admin":
                      next();
                        break;

              }
            }
        });
    }
  }