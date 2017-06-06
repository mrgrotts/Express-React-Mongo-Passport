const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // validate fields
  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  // see if user with given email exists
  User.findOne({ email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

  // if so, return error
  if (existingUser) {
    // status code 422 is unprocessable entity
    return res.status(422).send({ error: 'Email is in use' });
  }

  // if not, create and save new user
  const user = new User({
    email,
    password
  });

  user.save(function(err) {
    if (err) {
      return next(err);
    }

    // respond to request indicating the user was created
    res.json({ token: tokenForUser(user) });
    });
  });
}
