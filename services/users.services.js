const sequelize = require("../sequelize/sequelize");
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _twilioService = require("../phone-verification-twilio/twilio");
async function register(req,res){
    let query="insert into users (name,email,phone,password) values(?,?,?,?)";
    req.body.password = await bcrypt.hash(req.body.password,10);
    let data = await sequelize.query(query, {replacements:[req.body.name,req.body.email,
        req.body.phone,req.body.password],
        type : QueryTypes.INSERT
    })
    res.json(data)
}

async function login(req,res){
    let query = "select id,password from users where email = ?";
    let data = await sequelize.query(query,{
        replacements:[req.body.email],
        type : QueryTypes.SELECT
    })
    if(data.length>0){
        let verify_password = await bcrypt.compare(req.body.password,data[0].password);
        if(verify_password){
            let payload ={
                id : data[0].id
            }
            let token = jwt.sign(payload,process.env.SECRET_KEY)
            res.json({'access_token':token});
    
        }
        else{
            res.send("Invalid password");
        }
    
    }
    else{
        res.send("Invalid Email")
    }
    
    
}
async function auth(req,res){
    let query = "select id,email,phone,createdAt from users where id = ?";
    let data = await sequelize.query(query,{
        replacements:[req.user_id],
        type: QueryTypes.SELECT
    })
    if(data.length>0){
        res.json({
            data : data[0],
            access_token : req.body.access_token
        })
    }

}
async function facebook_login(req,res){
    //check-user exist
    let user = req.session.passport.user._json;
    let query = "select id from users where email = ?";
    let result = await sequelize.query(query,{
        replacements : [user.email],
        type : QueryTypes.SELECT
    })
    if(result.length>0){
        let payload ={
            id : result[0].id
        }
        let token = jwt.sign(payload,process.env.SECRET_KEY)
        res.json({'access_token':token})

    }
    else{
        query = "insert into users (name, email) values (?,?)"
        let data =await sequelize.query(query,
            {
                replacements:[user.first_name.concat(" ",user.last_name),user.email],
                type : QueryTypes.INSERT
            })
        let payload ={
            id : data[0]
        }
        let token = jwt.sign(payload,process.env.SECRET_KEY)
        res.json({'access_token':token})
    }
}
async function google_login(req,res){
    //check-user exist
    let user = req.session.passport.user;
    let query = "select id from users where email = ?";
    let result = await sequelize.query(query,{
        replacements : [user.emails[0].value],
        type : QueryTypes.SELECT
    })
    if(result.length>0){
        let payload ={
            id : result[0].id
        }
        let token = jwt.sign(payload,process.env.SECRET_KEY)
        res.json({'access_token':token})

    }
    else{
        query = "insert into users (name, email) values (?,?)"
        let data =await sequelize.query(query,
            {
                replacements:[user.displayName,user.emails[0].value],
                type : QueryTypes.INSERT
            })
        let payload ={
            id : data[0]
        }
        let token = jwt.sign(payload,process.env.SECRET_KEY)
        res.json({'access_token':token})
    }

}
async function send_otp(req,res){
    let phone_number = req.query.phone_number.trim();
    let data =await _twilioService.send_otp(phone_number);
    return res.send(data);
}
async function verify_otp(req,res){
    let phone_number = req.query.phone_number.trim();
    let code = req.query.code.trim();
    let data =await _twilioService.verify_otp(phone_number,code);
    if (data.valid){
        let result = await sequelize.query('select id from users where phone =?',{
            replacements:['+'.concat(phone_number)],
            type : QueryTypes.SELECT
        })
        if(result.length>0){
            let payload ={
                id : result[0].id
            }
            let token = jwt.sign(payload,process.env.SECRET_KEY)
            res.send({'access_token':token})
        }
        else{
            res.send({
                'message':'Phone not found'
            })
        }
    }
    else{
        res.send(data)
    }
}
module.exports = {register,login,auth,facebook_login,google_login,send_otp,verify_otp};