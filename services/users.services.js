const sequelize = require("../sequelize/sequelize");
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');

async function register(req,res){
    let query="insert into users (name,email,phone,password) values(?,?,?,?)";
    req.body.password = await bcrypt.hash(req.body.password,10);
    let data = await sequelize.query(query, {replacements:[req.body.name,req.body.email,
        req.body.phone,req.body.password],
        type : QueryTypes.INSERT
    },)
    res.json(data)
}
module.exports = register;