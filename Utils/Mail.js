var nodemailer =require('nodemailer');

//generar pdf
var ejs = require('ejs');
var htmlPdf =require('html-pdf');

async function htmlToPdfBuffer(params) {
    var path=('./views/ordenMail.ejs');
  const html = await ejs.renderFile(path,params);
  return new Promise((resolve, reject) => {
    htmlPdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}


class Mail{

    constructor(){
        this.transporter  = nodemailer.createTransport({
            service : 'Gmail',
            auth: {
                user: 'junioralonso3245@gmail.com',
                pass: 'euqjfugskmjbgwmq'
                }
        });
    }   
    sendMail(to,subject,text,cb){
        var options = {
            from: 'Proyecto',
            to: to,
            subject: subject,
            text: text
        }
        this.transporter.sendMail(options,cb);

    }


    async sendMailWithFactura(to,subject,html,info,cb){
            //renderisar
        var fileBuffer = await htmlToPdfBuffer(info);
        var options = {
            from: 'Proyecto',
            to: to,
            subject: subject,
            html: html,
            attachments: {filename: 'factura.pdf', content: fileBuffer} //pdf

        }
        this.transporter.sendMail(options,cb);

    }
}

//

module.exports = new Mail();