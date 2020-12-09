const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const users = require('./routes/users');
const app = express();

app
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .use(logger('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use('/', index)
  .use('/users', users)
  .use(function (req, res, next) {
    const err = Error('Not Found');
    err.status = 404;
    next(err);
  })
  .use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
