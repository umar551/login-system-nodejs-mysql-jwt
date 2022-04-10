var express = require('express');
const validate_user = require('../middleware/verify_user.middleware');
const _userService = require('../services/users.services');
var router = express();

router.post('/register',_userService.register);
router.post('/login',_userService.login);
router.post('/auth',validate_user,_userService.auth);


module.exports = router;