const passport = require('passport');
const JwtStrategy= require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');

// Create Local Strategy
const localOptions = { username: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify email and password, call done with that user
  // if it's correct email and password
  // otherwise, call done with false
  User.findOne({ email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare password in request to stored, encrypted password
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // if so, call done with that user
  // if not, call done without user
  User.findById(payload.sub, function(err,user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell Passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
