var express = require('express')
  , app = express()
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function () {
  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/../views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/../public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'CHANGEME' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });

  app.ensureAuthenticated = function (req, res, next) {
    if (req.session.passport.user !== undefined) {
      return next();
    } else if (req.url !== '/login') {
      var on = require('os').hostname() === 'pukka';
      //on = !on ? true : on;
      return on ? req.url === '/' ? res.redirect('/login') : res.redirect('/auth/facebook') : next();
    }
  };

  require('./auth')(app, passport, FacebookStrategy);
  require('./routes')(app);
  require('./controllers')(app);

  return app;
};