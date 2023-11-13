require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { uploadFolder } = require('./utils/multer');

const User = require('./models/user');
const ensureAuthenticated = require('./utils/middleware').ensureAuthenticated;
const cookieOpts = require('./utils/settings').cookieOpts;

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const messageRouter = require('./routes/messages');

const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
  
}
main().catch(err => console.log(err));

const app = express();

app.use(cors({ origin: process.env.ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(uploadFolder, express.static(uploadFolder.slice(1)));

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: mongoDB }),
}));

app.use(passport.session());
app.use(passport.initialize());

passport.use("login", new LocalStrategy((username, password, done) => {
  const invalid = 'Incorrect username or password.';
  
  User.findOne({ username })
    .then(user => {
      if (!user) return done(null, false, { message: invalid });
      if (!user.isValidPassword(password)) return done(null, false, { message: invalid });
      
      done(null, user);
    })
    .catch(err => done(err, false));
}));

passport.serializeUser((user, done) => {
  done(null, {
    username: user.username,
    _id: user._id, first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    pfp: user.pfp
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use('/auth', authRouter);
app.use('/users', ensureAuthenticated, usersRouter);
app.use('/posts', ensureAuthenticated, postsRouter);
app.use('/messages', ensureAuthenticated, messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err) console.log(err);

  // render the error page
  res.status(err.status || 500).json({
    error: err
  });
});

module.exports = app;
