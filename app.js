var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var apiRouter = require('./src/routes/api')

var app = express();
global.secret = 'fdfdashjkhu'
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//日志中间件
app.use(logger('dev'));

//解析json格式的数据，并保存在req.body中
app.use(express.json());
//解析urlencoded主体（一般为表单数据），并且保存在req.body中
app.use(express.urlencoded({ extended: false }));
//解析浏览器发送的cookie,保存在req.cookie中
app.use(cookieParser());
//设置静态资源的文件路径
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

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
