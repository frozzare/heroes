module.exports = function (app) {
  app.get('/', app.ensureAuthenticated, function (req, res) {
    res.render('index');
  });

  // Register index route.
  app.get('/login', function (req, res) {
    res.render('login');
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/test', function (req, res) {
    var Doris = require('../lib/doris');
    /*Doris.addUserToTeam('521fadeac42aab5016000001', '1', function () {
      console.log(arguments);
    });*/
    console.log(req.session.passport.user._id);
    res.send('{"ok":true}');
  });

  app.use(function(req, res, next) {
    next()
  });
};