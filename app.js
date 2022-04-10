require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const users = require('./controllers/users.controller');
const db = require('./sequelize/sequelize');
db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/users',users);
app.listen(process.env.PORT,(err)=>{
    if(err) return err
    console.log("Server is running on port",process.env.PORT)
})