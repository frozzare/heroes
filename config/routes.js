module.exports = function (app) {
  app.get('/', function (req, res) {
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

  app.get('/*', function (req, res, next) {
    console.log(req.url);
    next();
  });
};