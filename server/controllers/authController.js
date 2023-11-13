const User = require('../models/user');
const passport = require('passport');
const { generateUserData } = require('../utils/miscellaneous');
const { validationSignup, validation } = require('../utils/middleware');

exports.login = [
  validation,
  (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ errors: [info.message] });
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json(generateUserData(req.user, req));
      });
    })(req, res, next);
  }
];

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(generateUserData(req.user, req));
  }
  
  res.status(401).send();
}

exports.signup = [
  validation,
  validationSignup,
  (req, res, next) => {
    User.findOne({ username: req.body.username })
      .then(userFound => {
        if (userFound) return res.status(401).json({ errors: ['Username already exists.'] });
        
        const user = new User({
          username: req.body.username,
          password: req.body.password,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          age: req.body.age,
        });
        
        user.save()
          .then(() => {
            req.login(user, err => {
              if (err) return next(err);
              res.status(200).json(generateUserData(user, req));
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
];

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie('connect.sid').status(200).send();
  })
}