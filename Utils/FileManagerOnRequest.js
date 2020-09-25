var fs = require('fs');
var multer=require('multer');
var mime=require('mime');

module.exports.catchFile = function(requestKey,pathStorage, Name){
    let diskStr={
      destination: pathStorage,
      filename: function(req,file,cb){
          let ext =file.mimetype.split("/")[1];
        cb(null, Name + "_" + Date.now()+ "."+ ext);
      }
    };
    return  multer({
      storage: multer.diskStorage(diskStr)
    }).single(requestKey);
}
// obtiene un archivo
module.exports.getFile=function(pathStorage,name){
  let dir = pathStorage + (pathStorage.charAt(pathStorage.length-1)=='/'? '':'/') + name;
  var file = fs.readFileSync(dir);
  var mimetype = mime.getType(dir);
  return {content: file,mimetype: mimetype};
};