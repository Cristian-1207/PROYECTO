var nodemailer =require('nodemailer');


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


    sendMailWithFactura(to,subject,html,orden,cb){
            //renderisar




        var options = {
            from: 'Proyecto',
            to: to,
            subject: subject,
            html: html,
            attachments: '' //pdf

        }
        this.transporter.sendMail(options,cb);

    }
}

module.exports = new Mail();