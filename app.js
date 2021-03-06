var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');
let logRouter = require('./routes/log')
let searchRouter = require('./routes/search')
let plusRouter = require('./routes/plus')
let recordRouter = require('./routes/record')
let userRouter = require('./routes/user')
let addinfoRouter = require('./routes/addinfo')
let helpRouter = require('./routes/help')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  if (req.method === 'GET' || req.method === 'DELETE') {
    res.set('Cache-Control', 'no-store');
  }
  res.header("Access-Control-Allow-Origin", 'https://www.tserch.xyz');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,HEAD,CONNECT,PATCH,TRACE");
  // res.header("X-Powered-By",' 3.2.1')
  next();
})

app.use('/', indexRouter);
app.use('/log', logRouter)
app.use('/sign', signRouter)
app.use('/search', searchRouter)
app.use('/plus', plusRouter)
app.use('/record', recordRouter)
app.use('/user', userRouter)
app.use('/addinfo', addinfoRouter)
app.use('/help', helpRouter)


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
  res.end();
});

module.exports = app;
