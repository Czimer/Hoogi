var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var face = require('./faceRecognition/faceRecognition-try')
const bodyParser = require('body-parser')
const { postgraphile } = require("postgraphile");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const config = require('./appConfig')

var apiRouter = require('./routes/apiRoute');
var app = express();
app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use('/static',express.static(path.join(__dirname, 'static')));

// Routes
app.use('/api', apiRouter);
app.use(postgraphile(config.ConnectionString, 'public', {
  graphiql: true,
  appendPlugins: [ConnectionFilterPlugin],
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
