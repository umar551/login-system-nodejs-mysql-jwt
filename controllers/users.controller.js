var express = require('express');
const register = require('../services/users.services');
var router = express();

router.post('/register',register);

module.exports = router;