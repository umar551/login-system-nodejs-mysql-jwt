const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

function verify_phone(phone_nummber){
    
    return client.verify.services('MGe04fffd799b539c626d1f31d18091827')
        .verifications
        .create({to: '+'.concat(phone_nummber), channel: 'sms'})
        .then((verification) => {
            console.log(verification.status)
        })
        .catch((err)=>{
            throw err;
        });
}
module.exports = verify_phone;