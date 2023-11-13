const { body, validationResult } = require('express-validator');

exports.validation = [
  body('username', 'Username must be at least 3 characters.')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('password', 'Password must be at least 8 characters.')
    .trim()
    .isLength({ min: 8 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: 'Validation Error',
        errors: errors.array({ onlyFirstError: true }).map(err => err.msg)
      });
    }
    
    next();
  }
];

exports.validationSignup = [
  body('first_name', 'First name must be between 1 and 100 characters.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('last_name', 'Last name must be between 1 and 100 characters.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('age', 'Age must be at least 13.')
    .trim()
    .isNumeric()
    .isInt({ min: 13 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: 'Validation Error',
        errors: errors.array({ onlyFirstError: true }).map(err => err.msg)
      });
    }
    
    next();
  }
]

exports.ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.status(401).send();