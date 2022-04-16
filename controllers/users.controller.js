const express = require('express');
const validate_user = require('../middleware/verify_user.middleware');
const _userService = require('../services/users.services');
const passport = require('../passport/passport')
const router = express();
const session = require('express-session');
router.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))

router.post('/register',_userService.register);
router.post('/login',_userService.login);
router.post('/auth',validate_user,_userService.auth);
router.get('/login-with-facebook',passport.authenticate("facebook"));
router.get('/auth/facebook',passport.authenticate("facebook"),_userService.facebook_login);
router.get('/login-with-google',passport.authenticate("google"));
router.get('/auth/google',passport.authenticate("google"),_userService.google_login);
router.get('/send-otp',_userService.send_otp)
router.get('/verify-otp',_userService.verify_otp)
module.exports = router;