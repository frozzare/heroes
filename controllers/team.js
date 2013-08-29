module.exports = function (app) {
  // GET: /team/play
  app.get('/team/waiting', /* ensureAuthenticated, */ function (req, res) {
    res.render('team/waiting');
  });

  app.get('/team/mission/:num', /* ensureAuthenticated, */ function (req, res) {
    if (require('fs').existsSync(__dirname + '/../views/team/mission/' + req.params.num + '.html')) {
      res.render('team/mission/' + req.params.num);
    } else {
      res.render('/error');
    }
  });
};