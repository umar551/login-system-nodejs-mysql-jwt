const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oidc');
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
done(null, user);
});
passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET'],
    callbackURL: 'http://localhost:3001/users/auth/facebook',
    profileFields: ["email", "name","photos"],
    passReqToCallBack: true
  },function  (accessToken, refreshToken, profile, done){
    return done(null,profile)
  }
))
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3001/users/auth/google',
    passReqToCallBack: true,
    scope : ['email','profile']
  },function  (issuer, profile, done){
    //   req.profile = profile;
    return done(null,profile)
  }
  ))
module.exports = passport