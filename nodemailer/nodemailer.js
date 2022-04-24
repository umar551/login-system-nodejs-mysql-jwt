const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'youremail551@gmail.com',
        pass:'yourpassword123'
    }
});
const option ={
    from : "youremail551@gmail.com",
    to : "youremail441@gmail.com",
    subject :"email verfication",
    text : "your order is processing"
}
async function sendmail(){
    return transport.sendMail(option,(err,info)=>{
        if(err) throw err;
        else return info
    })
}
module.exports = sendmail