const sequelize = require('../sequelize/sequelize');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);


function send(phone_nummber){
    return client.messages
        .create({
            body: `Your OTP Verification code is : ${Math.floor(Math.random()*1000)} `,
            from: '+16073005522',
            to: '+'.concat(phone_nummber)
          })
         .then(async message =>{
             let code = message.body.match(/\d/g).join('');
             let query = "insert into otp (id,userId) values(?,?)"
             await sequelize.query(query,[code,data.id])
             
         });
}


async function send_otp(phone_nummber){
    phone_nummber = '+'.concat(phone_nummber)
    try {
        let data= await client.verify.services('VA24107b28d6bb6905021138d644bf1391')
             .verifications
             .create({to: phone_nummber, channel: 'sms'})
    if(data && data.sid){
        return {
            'message' : 'Otp Send Sucessfully'
        }
    }
    else{
        return {
            'message': 'Error'
        }
    }
    } catch (error) {
        return error
    }

}
async function verify_otp(phone_nummber,code){
    phone_nummber = '+'.concat(phone_nummber)
    try {
        let data = await client.verify.services('VA24107b28d6bb6905021138d644bf1391')
             .verificationChecks
             .create({to: phone_nummber, code: code})
    if(data.valid){
        return {
            message: 'Otp Verified',
            valid : data.valid
        }
    }
    else{
        return {message : 'Invalid Otp',valid : data.valid}
    }
    } catch (error) {
        return error
    }
    

}
module.exports = {send_otp,verify_otp};