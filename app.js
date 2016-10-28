const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const monk = require('monk');

const config = require('./config');
const db = monk(`${config.db.host}:${config.db.port}/${config.db.name}`);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
  outputStyle: 'compressed'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  req.db = db;
  next();
});

// routes
const rootRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
app.use('/', rootRoutes);
app.use('/users', userRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler (with stacktrace)
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
