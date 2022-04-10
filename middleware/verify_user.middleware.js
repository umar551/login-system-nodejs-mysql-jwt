const jwt = require('jsonwebtoken');
function validate_user(req,res,next){
    if(req.body.access_token){
        let data =jwt.verify(req.body.access_token,process.env.SECRET_KEY);
        if(data){
            req.user_id = data.id;
            next();
        }
        else{
            res.send("Invalid Token")
        }

    }
    else{
        res.send("token is empty")
    }
}
module.exports = validate_user